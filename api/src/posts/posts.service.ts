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
    const { content, authorId } = createPostDto;

    // Generate summary using AiService (tags are no longer AI-generated)
    const summary = await this.aiService.generateSummary(content);
    const tags: string[] = []; // Default empty tags

    const createdPost = new this.postModel({
      content,
      tags,
      summary,
      authorId,
    });

    if (authorId) {
      this.incrementPostCount(authorId);
    }

    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async createWithImage(
    createPostDto: CreatePostDto,
    imageUrl?: string,
  ): Promise<Post> {
    const { content, authorId } = createPostDto;

    // Generate summary using AiService (tags are no longer AI-generated)
    const summary = await this.aiService.generateSummary(content);
    const tags: string[] = []; // Default empty tags

    const createdPost = new this.postModel({
      content,
      tags,
      summary,
      imageUrl,
      authorId,
    });

    if (authorId) {
      this.incrementPostCount(authorId);
    }

    return createdPost.save();
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

  async summarizePost(postId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Post not found');

    const summary = await this.aiService.generateSummary(post.content);
    post.summary = summary;
    return post.save();
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
