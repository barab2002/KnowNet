import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { DEFAULT_TAG_MODEL, TagModelId } from '../ai/ai.service';
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
    const { content, authorId, tagModel } = createPostDto;
    const imageUrls = images?.length ? this.buildImageUrls(images) : [];

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

    // 2. Wait for AI to generate tags and summary before returning the post
    try {
      const { summary, tags, userTags, aiTags } = await this.buildAiMetadata(
        content,
        (tagModel as TagModelId) || DEFAULT_TAG_MODEL,
      );
      await this.postModel.findByIdAndUpdate(createdPost._id, {
        summary,
        tags,
        userTags,
        aiTags,
      });
      createdPost.summary = summary;
      createdPost.tags = tags;
      createdPost.userTags = userTags;
      createdPost.aiTags = aiTags;
    } catch (err) {
      this.logger.error(
        `AI processing failed for post ${createdPost._id}`,
        err,
      );
    }

    // 3. Generate and store embedding in background (non-blocking)
    this.aiService
      .generateEmbedding(content)
      .then((embedding) => {
        if (embedding.length > 0) {
          this.postModel
            .findByIdAndUpdate(createdPost._id, { embedding })
            .exec();
        }
      })
      .catch((err) =>
        this.logger.error(
          `Embedding generation failed for post ${createdPost._id}`,
          err,
        ),
      );

    const aiQuotaExceeded = this.aiService.wasQuotaExceeded();
    return Object.assign(createdPost, { aiQuotaExceeded });
  }

  private async buildAiMetadata(
    content: string,
    tagModel: TagModelId = DEFAULT_TAG_MODEL,
  ) {
    // Run summary and tag generation in parallel — use allSettled so one failure doesn't kill the other
    const [summaryResult, aiTagsResult] = await Promise.allSettled([
      this.aiService.generateSummary(content),
      this.aiService.generateTags(content, tagModel),
    ]);

    const summary =
      summaryResult.status === 'fulfilled' ? summaryResult.value : '';
    const aiTags =
      aiTagsResult.status === 'fulfilled' ? aiTagsResult.value : [];

    // User-defined hashtags extracted from content — filter out stop words and short words
    const TAG_STOP_WORDS = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'is',
      'was',
      'are',
      'were',
      'be',
      'been',
      'being',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'can',
      'also',
      'actually',
      'known',
      'false',
      'true',
      'just',
      'very',
      'quite',
      'really',
      'too',
      'so',
      'as',
      'if',
      'then',
      'than',
      'that',
      'this',
      'these',
      'those',
      'it',
      'its',
      'not',
      'no',
      'nor',
      'both',
      'either',
      'neither',
      'each',
      'every',
      'all',
      'any',
      'few',
      'more',
      'most',
      'other',
      'some',
      'such',
      'same',
      'like',
      'about',
      'after',
      'before',
      'into',
      'through',
      'during',
      'without',
      'within',
      'along',
      'across',
      'behind',
      'beyond',
      'up',
      'out',
      'around',
      'down',
      'off',
      'above',
      'below',
      'between',
      'new',
      'old',
      'well',
      'here',
      'there',
      'when',
      'where',
      'who',
      'what',
      'how',
      'why',
      'which',
    ]);
    const hashtags = content.match(/#(\w+)/g);
    const userTags = hashtags
      ? [
          ...new Set(
            hashtags
              .map((tag) => tag.substring(1).toLowerCase())
              .filter((t) => t.length > 2 && !TAG_STOP_WORDS.has(t)),
          ),
        ]
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
      const { summary, tags, userTags, aiTags } =
        await this.buildAiMetadata(content);
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
    return images.map((image) =>
      this.buildImageUrl(image.buffer, image.mimetype),
    );
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
    const post = await this.postModel
      .findById(postId)
      .select('comments')
      .exec();
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

  async search(query: string): Promise<{
    expandedTags: string[];
    queryWords: string[];
    results: Array<Record<string, unknown> & { matchedTags: string[] }>;
  }> {
    const startTime = Date.now();
    const cleanedQuery = query.toLowerCase().trim();

    // 1. Parallel: Embedding + Tag Expansion
    const [queryEmbedding, expandedTags] = await Promise.all([
      this.aiService.generateEmbedding(query).catch(() => [] as number[]),
      this.aiService.expandSearchQuery(query).catch(() => [] as string[]),
    ]);

    // 2. Pre-process query for text matching
    const SEARCH_STOP_WORDS = new Set([
      'the',
      'and',
      'with',
      'for',
      'this',
      'that',
      'how',
      'to',
      'find',
      'a',
      'an',
      'in',
      'on',
      'at',
      'of',
      'is',
      'it',
      'can',
      'you',
      'your',
      'my',
      'me',
      'i',
      'was',
      'were',
      'what',
      'where',
      'when',
      'את',
      'של',
      'על',
      'עם',
      'כי',
      'גם',
      'זה',
      'על',
      'הוא',
      'היא',
      'הם',
      'הן',
    ]);
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[.,?!:;]$/, '')) // Clean trailing punctuation
      .filter((w) => w.length > 1 && !SEARCH_STOP_WORDS.has(w));

    const wordRegexes = queryWords.map(
      (w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'iu'),
    );

    // Create a version of the query without trailing punctuation for literal matching
    const softCleanedQuery = query
      .toLowerCase()
      .trim()
      .replace(/[.,?!:;]+$/, '');

    // 3. Regex Support: Only trigger if query looks like an INTENTIONAL pattern (not just a question mark)
    let rawRegex: RegExp | null = null;
    try {
      // Check for complex regex markers (e.g., brackets, anchors, or middle-word wildcards)
      // Leaving out a trailing '?' since that usually means a natural language question
      if (
        /[*+^${}()|[\]\\]/.test(query) ||
        (query.includes('?') && !query.trim().endsWith('?'))
      ) {
        rawRegex = new RegExp(query, 'iu');
      }
    } catch (e) {}

    // 4. elite Candidate Retrieval (Query DB broadly)
    const candidates = await this.postModel
      .find({
        $or: [
          { content: { $regex: cleanedQuery, $options: 'i' } },
          { content: { $regex: softCleanedQuery, $options: 'i' } },
          // Also look for individual keywords in content
          ...(queryWords.length > 0
            ? [{ content: { $in: queryWords.map((w) => new RegExp(w, 'i')) } }]
            : []),
          { tags: { $in: [...expandedTags, ...queryWords] } },
          { aiTags: { $in: queryWords } },
          { userTags: { $in: queryWords } },
          ...(query.length < 4
            ? [
                {
                  createdAt: {
                    $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // Extended recent pool
                  },
                },
              ]
            : []),
        ],
      })
      .sort({ createdAt: -1 })
      .limit(300)
      .select('+embedding')
      .populate('authorId', 'name profileImageUrl')
      .lean()
      .exec();

    // fetch semantical fallbacks if needed
    let allCandidates = candidates;
    if (candidates.length < 50 && queryEmbedding.length > 0) {
      const more = await this.postModel
        .find({ _id: { $nin: candidates.map((c) => c._id) } })
        .sort({ createdAt: -1 })
        .limit(100)
        .select('+embedding')
        .populate('authorId', 'name profileImageUrl')
        .lean()
        .exec();
      allCandidates = [...candidates, ...more];
    }

    // 5. Advanced Scoring Fusion
    const scored = allCandidates.map((post) => {
      const content = (post.content || '').toLowerCase();
      const postTags = [
        ...(post.tags || []),
        ...(post.aiTags || []),
        ...(post.userTags || []),
      ] as string[];

      // Vector Score (Semantic)
      const postEmbedding = post.embedding as unknown as number[] | undefined;
      const vScore =
        queryEmbedding.length && postEmbedding?.length
          ? this.cosineSimilarity(queryEmbedding, postEmbedding)
          : 0;

      // Match Score (Text)
      let mScore = 0;
      if (content.includes(cleanedQuery)) {
        mScore = 0.95;
      } else if (content.includes(softCleanedQuery)) {
        mScore = 0.9; // High score for punctuation-free match (e.g., 'fish' matching 'fish?')
      } else if (rawRegex && rawRegex.test(content)) {
        mScore = 0.9;
      } else {
        const hits = wordRegexes.filter((r) => r.test(content)).length;
        // Significant boost for matching any keywords from the query
        mScore = wordRegexes.length ? (hits / wordRegexes.length) * 0.75 : 0;
      }

      // Tag Score
      const matchedTags = postTags.filter(
        (t) => expandedTags.includes(t) || queryWords.includes(t),
      );
      const tScore =
        matchedTags.length > 0
          ? Math.min(0.4 + matchedTags.length * 0.2, 1.0)
          : 0;

      // Final Fusion
      let score = 0;
      if (vScore > 0) {
        score = vScore * 0.5 + mScore * 0.4 + tScore * 0.1;
        if (mScore >= 0.75 && score < mScore) score = mScore;
      } else {
        score = mScore * 0.75 + tScore * 0.25;
      }

      // Freshness bonus (max +0.05)
      const ageDays =
        (Date.now() - new Date(post.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);
      score += Math.max(0, 1 - ageDays / 180) * 0.05;

      // Snippet Generation
      let snippet = '';
      if (mScore > 0 && queryWords.length > 0) {
        const firstMatch = queryWords.find((w) => content.includes(w));
        const snippetAnchor = firstMatch || cleanedQuery;
        const idx = content.indexOf(snippetAnchor);
        if (idx !== -1) {
          snippet = content.substring(
            Math.max(0, idx - 40),
            Math.min(content.length, idx + 80),
          );
        }
      }

      return {
        ...post,
        _score: score,
        matchedTags,
        matchSnippet: snippet,
        _debug: { vScore, mScore, tScore },
      };
    });

    const results = scored
      .filter((p) => p._score >= 0.5)
      .sort((a, b) => b._score - a._score)
      .slice(0, 50);

    this.logger.log(
      `Search: ${allCandidates.length} candidates -> ${results.length} results. Time: ${Date.now() - startTime}ms`,
    );
    return { expandedTags, queryWords, results };
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (!a?.length || !b?.length || a.length !== b.length) return 0;
    let dot = 0,
      normA = 0,
      normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  async summarizePost(postId: string, userId?: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

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
