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

    // 1. Manual Hashtag Extraction (User-defined tags) - DO THIS FIRST
    const hashtagsMatch = content.match(/#(\w+)/g);
    const userHashtags = hashtagsMatch
      ? hashtagsMatch.map((tag) => tag.substring(1))
      : [];

    // 2. AI Tag Generation Logic
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
        });

        const prompt = `You are an expert at categorizing content for a campus social network called KnowNet. 
        The user has already provided these tags: [${userHashtags.join(', ')}].
        
        Please provide 2-3 ADDITIONAL highly relevant tags that add more context or categorization depth.
        Focus on academic subjects, campus life, or high-level themes.
        Return ONLY a comma-separated list of NEW tags.
        Do not repeat the user's tags.
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
          const aiTags = generatedText
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
            .slice(0, 5);

          tags = [...aiTags];
        }
      } catch (error) {
        this.logger.error('Failed to generate tags with Gemini', error);
      }
    }

    // 3. Merge All (User Hashtags + AI Tags) - Ensure user hashtags are ALWAYS included
    tags = [...new Set([...userHashtags, ...tags])];

    // Fallback: If no AI tags and no hashtags, use simple keyword extraction
    if (tags.length === 0) {
      this.logger.warn('Using fallback keyword extraction for tags');
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
}
