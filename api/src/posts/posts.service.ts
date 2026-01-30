import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly usersService: UsersService,
  ) {
    // Initialize Gemini only if API key is available
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { content, authorId } = createPostDto;
    let tags: string[] = [];

    // AI Tag Generation Logic
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
        });
        const prompt = `You are a helpful assistant that extracts tags from text. Return only the tags as a comma-separated list, e.g. 'tech, ai, coding'. Do not include any other text. Extract tags from this content: ${content}`;

        const result = await model.generateContent(prompt);
        const generatedText = result.response.text();

        if (generatedText) {
          tags = generatedText.split(',').map((tag) => tag.trim());
        }
      } catch (error) {
        this.logger.error('Failed to generate tags with Gemini', error);
      }
    } else {
      // Mock fallback if no API key
      this.logger.warn('GEMINI_API_KEY not found, using mock tags');
      tags = ['mock-tag', 'knownet'];
    }

    const createdPost = new this.postModel({
      content,
      tags,
      authorId,
    });

    if (authorId) {
      await this.usersService
        .incrementPostsCount(authorId)
        .catch((err) =>
          this.logger.error(
            `Failed to increment post count for user ${authorId}`,
            err,
          ),
        );
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
    let tags: string[] = [];

    // AI Tag Generation Logic
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
        });
        const prompt = `You are a helpful assistant that extracts tags from text. Return only the tags as a comma-separated list, e.g. 'tech, ai, coding'. Do not include any other text. Extract tags from this content: ${content}`;

        const result = await model.generateContent(prompt);
        const generatedText = result.response.text();

        if (generatedText) {
          tags = generatedText.split(',').map((tag) => tag.trim());
        }
      } catch (error) {
        this.logger.error('Failed to generate tags with Gemini', error);
      }
    } else {
      // Mock fallback if no API key
      this.logger.warn('GEMINI_API_KEY not found, using mock tags');
      tags = ['mock-tag', 'knownet'];
    }

    const createdPost = new this.postModel({
      content,
      tags,
      imageUrl,
      authorId,
    });

    if (authorId) {
      await this.usersService
        .incrementPostsCount(authorId)
        .catch((err) =>
          this.logger.error(
            `Failed to increment post count for user ${authorId}`,
            err,
          ),
        );
    }

    return createdPost.save();
  }

  async toggleLike(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Post not found');

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
      // Increment author's likesReceived
      if (post.authorId) {
        await this.usersService
          .incrementLikesReceived(post.authorId)
          .catch((err) =>
            this.logger.error(
              `Failed to increment likesReceived for user ${post.authorId}`,
              err,
            ),
          );
      }
    } else {
      post.likes.splice(index, 1);
      // Decrement author's likesReceived
      if (post.authorId) {
        await this.usersService
          .decrementLikesReceived(post.authorId)
          .catch((err) =>
            this.logger.error(
              `Failed to decrement likesReceived for user ${post.authorId}`,
              err,
            ),
          );
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
    // If mocking is still needed for old posts without authorId, keep find({}) or migrate data
    // For now, let's filter by authorId to satisfy the user request "see it in my profile"
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
}
