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
    return this.createWithImage(createPostDto);
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async createWithImage(
    createPostDto: CreatePostDto,
    imageUrl?: string,
    imageBuffer?: Buffer,
    mimetype?: string,
  ): Promise<Post> {
    const { content, authorId } = createPostDto;
    let tags: string[] = [];

    // AI Tag Generation Logic
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
        });

        const prompt = `You are an expert at categorizing content for a campus social network called KnowNet. 
        Extract 2-4 highly relevant tags from the following content. 
        Focus on academic subjects, campus life, or specific topics mentioned.
        Return ONLY a comma-separated list of tags (e.g., "Physics, Study Tips, Campus Events").
        Do not include hashtags or extra text.
        Content: ${content}`;

        let result;
        if (imageBuffer && mimetype) {
          result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: mimetype,
              },
            },
          ]);
        } else {
          result = await model.generateContent(prompt);
        }

        const generatedText = result.response.text();
        if (generatedText) {
          tags = generatedText
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
            .slice(0, 5);
        }
      } catch (error) {
        this.logger.error('Failed to generate tags with Gemini', error);
      }
    }

    // Manual Hashtag Extraction (User-defined tags)
    const hashtags = content.match(/#(\w+)/g);
    if (hashtags) {
      const extractedTags = hashtags.map((tag) => tag.substring(1)); // Remove '#'
      tags = [...new Set([...tags, ...extractedTags])];
    }

    // Fallback: If no AI tags and no hashtags, use simple keyword extraction (The "Free AI")
    if (tags.length === 0) {
      this.logger.warn('Using fallback keyword extraction for tags');
      const keywords = content
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 4) // Only words longer than 4 chars
        .filter(
          (word) =>
            !['about', 'there', 'their', 'would', 'could', 'should'].includes(
              word,
            ),
        );

      // Get unique keywords, take top 3
      tags = [...new Set(keywords)].slice(0, 3);

      if (tags.length === 0) tags = ['General', 'Community'];
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

  async getTotalLikesForUser(userId: string): Promise<number> {
    const result = await this.postModel.aggregate([
      { $match: { authorId: userId } },
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, totalLikes: { $sum: '$likesCount' } } },
    ]);

    return result.length > 0 ? result[0].totalLikes : 0;
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
        // We need a way to decrement multiple likes at once or loop.
        // Let's see if UsersService has a bulk update.
        // For now, I'll just adjust the likes count if I can.
        // Actually, UsersService only has decrementLikesReceived which decrements by 1.
        // I'll call it in a loop or add a bulk method.
        // Simpler: iterate.
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
}
