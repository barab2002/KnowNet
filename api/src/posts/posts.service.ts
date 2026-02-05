import { Injectable, Logger } from '@nestjs/common';
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
    imageUrl?: string,
    imageBuffer?: Buffer,
    mimetype?: string,
  ): Promise<Post> {
    const { content, authorId } = createPostDto;

    // 1. Create and save post immediately with basic data
    const createdPost = new this.postModel({
      content,
      tags: [], // Will be updated by background process
      userTags: [],
      aiTags: [],
      summary: '',
      imageUrl,
      authorId,
    });

    await createdPost.save();

    if (authorId) {
      this.incrementPostCount(authorId);
    }

    // 2. Trigger background AI processing
    this.processAiInBackground(createdPost._id.toString(), content).catch(
      (err) =>
        this.logger.error(
          `Background AI processing failed for post ${createdPost._id}`,
          err,
        ),
    );

    return createdPost;
  }

  // Helper for background processing
  private async processAiInBackground(postId: string, content: string) {
    this.logger.log(`Starting background AI processing for post ${postId}`);

    try {
      // Generate summary
      const summary = await this.aiService.generateSummary(content);

      // User-defined hashtags
      let userTags: string[] = [];
      const hashtags = content.match(/#(\w+)/g);
      if (hashtags) {
        userTags = [...new Set(hashtags.map((tag) => tag.substring(1)))];
      }

      // AI/Fallback keywords
      let aiTags: string[] = [];
      if (userTags.length === 0) {
        const keywords = content
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter((word) => word.length > 4)
          .filter(
            (word) =>
              !['about', 'there', 'their', 'would', 'could', 'should'].includes(
                word,
              ),
          );
        aiTags = [...new Set(keywords)].slice(0, 3);
        if (aiTags.length === 0) aiTags = ['General', 'Community'];
      }

      // Combined tags
      const tags = [...userTags, ...aiTags];

      // Update the post
      await this.postModel.findByIdAndUpdate(postId, {
        summary,
        tags,
        userTags,
        aiTags,
      });

      this.logger.log(`Completed background AI processing for post ${postId}`);
    } catch (error) {
      this.logger.error(`Failed to process AI for post ${postId}`, error);
    }
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

    post.comments.push({ userId, content, createdAt: new Date() });
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

  async search(query: string): Promise<Post[]> {
    return this.postModel
      .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .exec();
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
