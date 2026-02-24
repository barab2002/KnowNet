import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly usersService: UsersService,
    private readonly aiService: AiService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.createWithImage(createPostDto);
  }

  async findAll(
    limit = 10,
    skip = 0,
  ): Promise<{ posts: Post[]; total: number }> {
    const total = await this.postModel.countDocuments();
    const posts = await this.postModel
      .find()
      .populate('authorId', 'name profileImageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return { posts, total };
  }

  async createWithImage(
    createPostDto: CreatePostDto,
    images?: { buffer: Buffer; mimetype: string }[],
  ): Promise<Post> {
    const { content, authorId } = createPostDto;
    const imageUrls = images?.length
      ? this.buildImageUrls(images)
      : [];

    // 1. Create and save post immediately with basic data
    const createdPost = new this.postModel({
      content,
      tags: [], // Will be updated by background process
      userTags: [],
      aiTags: [],
      summary: '',
      imageUrls,
      imageUrl: imageUrls[0],
      authorId,
    });

    await createdPost.save();

    if (authorId) {
      this.incrementPostCount(authorId);
    }

    // 2. Run AI processing synchronously so tags are ready when the post is returned
    try {
      const { summary, tags, userTags, aiTags } = await this.buildAiMetadata(content);
      await this.postModel.findByIdAndUpdate(createdPost._id, { summary, tags, userTags, aiTags });
      createdPost.summary = summary;
      createdPost.tags = tags;
      createdPost.userTags = userTags;
      createdPost.aiTags = aiTags;
    } catch (err) {
      this.logger.error(`AI processing failed for post ${createdPost._id}`, err);
    }

    return createdPost;
  }

  private async buildAiMetadata(content: string) {
    // Run summary and tag generation in parallel
    const [summary, aiTags] = await Promise.all([
      this.aiService.generateSummary(content),
      this.aiService.generateTags(content),
    ]);

    // User-defined hashtags extracted from content
    const hashtags = content.match(/#(\w+)/g);
    const userTags = hashtags
      ? [...new Set(hashtags.map((tag) => tag.substring(1).toLowerCase()))]
      : [];

    // Combined tags: user hashtags first, then AI tags (deduplicated)
    const tags = [...new Set([...userTags, ...aiTags])];

    return { summary, tags, userTags, aiTags };
  }

  async updatePostContent(
    postId: string,
    userId: string,
    content?: string,
    images?: { buffer: Buffer; mimetype: string }[],
    removeImageUrls?: string[],
    removeImage?: boolean,
  ): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    if (!post.authorId || post.authorId.toString() !== userId) {
      throw new ForbiddenException('Unauthorized to edit this post');
    }

    let imageUrls = post.imageUrls?.length
      ? [...post.imageUrls]
      : post.imageUrl
        ? [post.imageUrl]
        : [];

    if (removeImage) {
      imageUrls = [];
    }

    if (removeImageUrls?.length) {
      imageUrls = imageUrls.filter((url) => !removeImageUrls.includes(url));
    }

    if (images?.length) {
      imageUrls.push(...this.buildImageUrls(images));
    }

    post.imageUrls = imageUrls;
    post.imageUrl = imageUrls[0];

    if (typeof content === 'string' && content !== post.content) {
      const { summary, tags, userTags, aiTags } = await this.buildAiMetadata(
        content,
      );
      post.content = content;
      post.summary = summary;
      post.tags = tags;
      post.userTags = userTags;
      post.aiTags = aiTags;
    }

    return post.save();
  }

  private buildImageUrl(imageBuffer: Buffer, mimetype: string) {
    const b64 = Buffer.from(imageBuffer).toString('base64');
    return `data:${mimetype};base64,${b64}`;
  }

  private buildImageUrls(images: { buffer: Buffer; mimetype: string }[]) {
    return images.map((image) => this.buildImageUrl(image.buffer, image.mimetype));
  }

  async toggleLike(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Post not found');

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
      if (post.authorId) {
        this.incrementLikesReceived(post.authorId);
      }
    } else {
      post.likes.splice(index, 1);
      if (post.authorId) {
        this.decrementLikesReceived(post.authorId);
      }
    }
    return post.save();
  }

  async addComment(
    postId: string,
    userId: string,
    content: string,
  ): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Post not found');

    let userName: string | undefined;
    let userProfileImageUrl: string | undefined;
    try {
      const user = await this.usersService.findById(userId);
      userName = user.name;
      userProfileImageUrl = user.profileImageUrl;
    } catch (error) {
      this.logger.warn(`Unable to resolve user for comment: ${userId}`);
    }

    post.comments.push({
      userId,
      userName,
      userProfileImageUrl,
      content,
      createdAt: new Date(),
    });
    return post.save();
  }

  async getComments(postId: string) {
    const post = await this.postModel.findById(postId).select('comments').exec();
    if (!post) throw new NotFoundException('Post not found');
    return post.comments || [];
  }

  async removeComment(
    postId: string,
    commentId: string,
    userId: string,
  ): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const comments = post.comments as any[];
    const commentIndex = comments.findIndex(
      (comment) => comment?._id?.toString() === commentId,
    );
    if (commentIndex === -1) throw new NotFoundException('Comment not found');

    const comment = comments[commentIndex];
    const isPostAuthor = post.authorId?.toString() === userId;
    const isCommentAuthor = comment.userId?.toString() === userId;
    if (!isPostAuthor && !isCommentAuthor) {
      throw new ForbiddenException('Unauthorized to delete this comment');
    }

    comments.splice(commentIndex, 1);
    post.comments = comments as any;
    return post.save();
  }

  async toggleSave(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Post not found');

    const index = post.savedBy.indexOf(userId);
    if (index === -1) {
      post.savedBy.push(userId);
    } else {
      post.savedBy.splice(index, 1);
    }
    return post.save();
  }

  async getCreatePostDto(postId: string) {
    return this.postModel.findById(postId);
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    return this.postModel
      .find({ authorId: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getLikedPosts(userId: string): Promise<Post[]> {
    return this.postModel
      .find({ likes: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSavedPosts(userId: string): Promise<Post[]> {
    return this.postModel
      .find({ savedBy: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUniqueTags(): Promise<string[]> {
    const result = await this.postModel.distinct('tags').exec();
    return result;
  }

  async getTotalLikesForUser(userId: string): Promise<number> {
    const result = await this.postModel.aggregate([
      { $match: { authorId: userId } },
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, totalLikes: { $sum: '$likesCount' } } },
    ]);

    return result.length > 0 ? result[0].totalLikes : 0;
  }

  async search(query: string): Promise<{ expandedTags: string[]; results: Array<Record<string, unknown> & { matchedTags: string[] }> }> {
    const expandedTags = await this.aiService.expandSearchQuery(query);

    // Run tag-based search and full-text search in parallel
    const [tagPosts, textPosts] = await Promise.all([
      this.postModel
        .find({ tags: { $in: expandedTags } })
        .populate('authorId', 'name profileImageUrl')
        .lean()
        .exec(),
      this.postModel
        .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
        .populate('authorId', 'name profileImageUrl')
        .lean()
        .exec(),
    ]);

    // Merge and deduplicate by _id (tag results first for better ranking)
    const seen = new Set<string>();
    const merged = [...tagPosts, ...textPosts].filter((post) => {
      const id = (post._id as { toString(): string }).toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    const results = merged
      .map((post) => ({
        ...post,
        matchedTags: (post.tags as string[]).filter((tag) => expandedTags.includes(tag)),
      }))
      .sort((a, b) => b.matchedTags.length - a.matchedTags.length);

    return { expandedTags, results };
  }

  async summarizePost(postId: string, userId?: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Post not found');

    let accessToken: string | undefined;
    if (userId) {
      const user = await this.usersService.findById(userId);
      accessToken = user.googleAccessToken;
      await this.usersService.incrementAiSummaries(userId);
    }

    const summary = await this.aiService.generateSummary(
      post.content,
      accessToken,
    );
    post.summary = summary;
    return post.save();
  }

  async delete(postId: string, userId: string): Promise<void> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.authorId !== userId) {
      throw new Error('Unauthorized to delete this post');
    }

    const likesCount = post.likes.length;

    await this.postModel.findByIdAndDelete(postId);

    if (userId) {
      await this.usersService
        .decrementPostsCount(userId)
        .catch((err) =>
          this.logger.error(
            `Failed to decrement posts count for user ${userId}`,
            err,
          ),
        );

      if (likesCount > 0) {
        for (let i = 0; i < likesCount; i++) {
          await this.usersService
            .decrementLikesReceived(userId)
            .catch((err) =>
              this.logger.error(
                `Failed to decrement likes count for user ${userId}`,
                err,
              ),
            );
        }
      }
    }
  }

  private async incrementPostCount(authorId: string) {
    await this.usersService
      .incrementPostsCount(authorId)
      .catch((err) =>
        this.logger.error(
          `Failed to increment post count for user ${authorId}`,
          err,
        ),
      );
  }

  private async incrementLikesReceived(authorId: string) {
    await this.usersService
      .incrementLikesReceived(authorId)
      .catch((err) =>
        this.logger.error(
          `Failed to increment likesReceived for user ${authorId}`,
          err,
        ),
      );
  }

  private async decrementLikesReceived(authorId: string) {
    await this.usersService
      .decrementLikesReceived(authorId)
      .catch((err) =>
        this.logger.error(
          `Failed to decrement likesReceived for user ${authorId}`,
          err,
        ),
      );
  }
}
