import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import OpenAI from 'openai';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  private openai: OpenAI;

  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    // Initialize OpenAI only if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { content } = createPostDto;
    let tags: string[] = [];

    // AI Tag Generation Logic
    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                "You are a helpful assistant that extracts tags from text. Return only the tags as a comma-separated list, e.g. 'tech, ai, coding'. Do not include any other text.",
            },
            { role: 'user', content: content },
          ],
          model: 'gpt-3.5-turbo',
        });

        const generatedText = completion.choices[0].message.content;
        if (generatedText) {
          tags = generatedText.split(',').map((tag) => tag.trim());
        }
      } catch (error) {
        this.logger.error('Failed to generate tags with OpenAI', error);
      }
    } else {
      // Mock fallback if no API key
      this.logger.warn('OPENAI_API_KEY not found, using mock tags');
      tags = ['mock-tag', 'knownet'];
    }

    const createdPost = new this.postModel({
      content,
      tags,
    });
    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async createWithImage(
    createPostDto: CreatePostDto,
    imageUrl?: string,
  ): Promise<Post> {
    const { content } = createPostDto;
    let tags: string[] = [];

    // AI Tag Generation Logic
    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                "You are a helpful assistant that extracts tags from text. Return only the tags as a comma-separated list, e.g. 'tech, ai, coding'. Do not include any other text.",
            },
            { role: 'user', content: content },
          ],
          model: 'gpt-3.5-turbo',
        });

        const generatedText = completion.choices[0].message.content;
        if (generatedText) {
          tags = generatedText.split(',').map((tag) => tag.trim());
        }
      } catch (error) {
        this.logger.error('Failed to generate tags with OpenAI', error);
      }
    } else {
      // Mock fallback if no API key
      this.logger.warn('OPENAI_API_KEY not found, using mock tags');
      tags = ['mock-tag', 'knownet'];
    }

    const createdPost = new this.postModel({
      content,
      tags,
      imageUrl,
    });
    return createdPost.save();
  }

  async toggleLike(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Post not found');

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
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
    return this.postModel.find({}).sort({ createdAt: -1 }).exec(); // Simplified for now since we don't have authorId on post yet, logic update needed if we want strict ownership
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
