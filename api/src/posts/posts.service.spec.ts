import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';
import { CreatePostDto } from './dto/create-post.dto';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let model: any;
  let usersService: UsersService;
  let aiService: AiService;

  // Shared save mock to allow test overriding
  const mockSave = jest.fn().mockResolvedValue({});

  const mockPost = {
    _id: 'post1',
    content: 'content',
    authorId: 'user1',
    likes: [],
    savedBy: [],
    comments: [],
    tags: [],
    save: mockSave,
  };

  // Chainable mock helper
  const mockQuery = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  class MockPostModel {
    constructor(private data: any) {
      Object.assign(this, data);
    }
    save = mockSave.mockImplementation(async function (this: any) {
      this._id = 'post1';
      return this;
    });

    static find = jest.fn().mockReturnValue(mockQuery);
    static countDocuments = jest.fn();
    static findById = jest.fn();
    static findByIdAndUpdate = jest.fn();
    static findByIdAndDelete = jest.fn();
    static aggregate = jest.fn();
    static distinct = jest.fn();
  }

  const mockUsersService = {
    incrementPostsCount: jest.fn().mockResolvedValue(undefined),
    decrementPostsCount: jest.fn().mockResolvedValue(undefined),
    incrementLikesReceived: jest.fn().mockResolvedValue(undefined),
    decrementLikesReceived: jest.fn().mockResolvedValue(undefined),
    incrementAiSummaries: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn(),
  };

  const mockAiService = {
    generateSummary: jest.fn().mockResolvedValue('Summary'),
  };

  beforeEach(async () => {
    // Reset mocks
    mockSave.mockClear().mockResolvedValue(mockPost); // Default success
    MockPostModel.find.mockClear().mockReturnValue(mockQuery);
    mockQuery.exec.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: MockPostModel,
        },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    model = module.get(getModelToken(Post.name));
    usersService = module.get<UsersService>(UsersService);
    aiService = module.get<AiService>(AiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a post successfully', async () => {
      const dto: CreatePostDto = { content: 'hello #world', authorId: 'user1' };

      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(mockUsersService.incrementPostsCount).toHaveBeenCalledWith(
        'user1',
      );
    });

    it('should propagate save errors', async () => {
      mockSave.mockRejectedValueOnce(new Error('Save Error'));
      const dto: CreatePostDto = { content: 'fail', authorId: 'user1' };
      await expect(service.create(dto)).rejects.toThrow('Save Error');
    });
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const posts = [mockPost];
      MockPostModel.countDocuments.mockResolvedValue(1);
      mockQuery.exec.mockResolvedValue(posts);

      const result = await service.findAll(10, 0);
      expect(result.posts).toBe(posts);
      expect(result.total).toBe(1);
    });

    it('should handle db error during find', async () => {
      MockPostModel.countDocuments.mockResolvedValue(1);
      mockQuery.exec.mockRejectedValue(new Error('DB Fail'));
      await expect(service.findAll()).rejects.toThrow('DB Fail');
    });
  });

  describe('toggleLike', () => {
    it('should add like if not present', async () => {
      const post = { ...mockPost, likes: [], save: mockSave };
      mockSave.mockResolvedValue(post); // Save returns the post
      MockPostModel.findById.mockResolvedValue(post);

      await service.toggleLike('post1', 'user2');
      expect(post.likes).toContain('user2');
      expect(mockUsersService.incrementLikesReceived).toHaveBeenCalledWith(
        'user1',
      );
    });

    it('should remove like if present', async () => {
      const post = { ...mockPost, likes: ['user2'], save: mockSave };
      mockSave.mockResolvedValue(post);
      MockPostModel.findById.mockResolvedValue(post);

      await service.toggleLike('post1', 'user2');
      expect(post.likes).not.toContain('user2');
      expect(mockUsersService.decrementLikesReceived).toHaveBeenCalledWith(
        'user1',
      );
    });

    it('should throw if post not found', async () => {
      MockPostModel.findById.mockResolvedValue(null);
      await expect(service.toggleLike('badId', 'u1')).rejects.toThrow(
        'Post not found',
      );
    });
  });

  describe('addComment', () => {
    it('should add comment', async () => {
      const post = { ...mockPost, comments: [], save: mockSave };
      mockSave.mockResolvedValue(post);
      MockPostModel.findById.mockResolvedValue(post);

      await service.addComment('post1', 'user1', 'content');
      expect(post.comments).toHaveLength(1);
      expect(post.save).toHaveBeenCalled();
    });

    it('should throw if post not found', async () => {
      MockPostModel.findById.mockResolvedValue(null);
      await expect(service.addComment('bad', 'u', 'c')).rejects.toThrow(
        'Post not found',
      );
    });
  });

  describe('toggleSave', () => {
    it('should toggle save on', async () => {
      const post = { ...mockPost, savedBy: [], save: mockSave };
      mockSave.mockResolvedValue(post);
      MockPostModel.findById.mockResolvedValue(post);
      await service.toggleSave('post1', 'user1');
      expect(post.savedBy).toContain('user1');
    });

    it('should toggle save off', async () => {
      const post = { ...mockPost, savedBy: ['user1'], save: mockSave };
      mockSave.mockResolvedValue(post);
      MockPostModel.findById.mockResolvedValue(post);
      await service.toggleSave('post1', 'user1');
      expect(post.savedBy).not.toContain('user1');
    });

    it('should throw if post missing', async () => {
      MockPostModel.findById.mockResolvedValue(null);
      await expect(service.toggleSave('bad', 'u')).rejects.toThrow(
        'Post not found',
      );
    });
  });

  describe('getPostsByUser', () => {
    it('should return posts', async () => {
      mockQuery.exec.mockResolvedValue([mockPost]);
      const res = await service.getPostsByUser('u1');
      expect(res).toEqual([mockPost]);
    });

    it('should propagate error', async () => {
      mockQuery.exec.mockRejectedValue(new Error('Fail'));
      await expect(service.getPostsByUser('u1')).rejects.toThrow('Fail');
    });
  });

  describe('getLikedPosts', () => {
    it('should return liked posts', async () => {
      mockQuery.exec.mockResolvedValue([mockPost]);
      expect(await service.getLikedPosts('u1')).toEqual([mockPost]);
    });
  });

  describe('getSavedPosts', () => {
    it('should return saved posts', async () => {
      mockQuery.exec.mockResolvedValue([mockPost]);
      expect(await service.getSavedPosts('u1')).toEqual([mockPost]);
    });
  });

  describe('getUniqueTags', () => {
    it('should return tags', async () => {
      MockPostModel.distinct.mockReturnValue({
        exec: jest.fn().mockResolvedValue(['t1']),
      });
      expect(await service.getUniqueTags()).toEqual(['t1']);
    });

    it('should fail if distinct fails', async () => {
      MockPostModel.distinct.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Fail')),
      });
      await expect(service.getUniqueTags()).rejects.toThrow('Fail');
    });
  });

  describe('getTotalLikesForUser', () => {
    it('should return count', async () => {
      MockPostModel.aggregate.mockResolvedValue([{ totalLikes: 5 }]);
      expect(await service.getTotalLikesForUser('u1')).toBe(5);
    });

    it('should return 0 if no results', async () => {
      MockPostModel.aggregate.mockResolvedValue([]);
      expect(await service.getTotalLikesForUser('u1')).toBe(0);
    });
  });

  describe('search', () => {
    it('should return matching posts', async () => {
      mockQuery.exec.mockResolvedValue([mockPost]);
      expect(await service.search('query')).toEqual([mockPost]);
    });
  });

  describe('summarizePost', () => {
    it('should summarize and save', async () => {
      const post = { ...mockPost, content: 'long text', save: mockSave };
      mockSave.mockResolvedValue(post);
      MockPostModel.findById.mockResolvedValue(post);
      mockUsersService.findById.mockResolvedValue({
        googleAccessToken: 'token',
      });

      await service.summarizePost('post1', 'user1');
      expect(aiService.generateSummary).toHaveBeenCalled();
      expect(post.save).toHaveBeenCalled();
    });

    it('should throw if post not found', async () => {
      MockPostModel.findById.mockResolvedValue(null);
      await expect(service.summarizePost('bad', 'u')).rejects.toThrow(
        'Post not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete post and decrement counters', async () => {
      const post = { ...mockPost, authorId: 'u1', likes: ['u2'] };
      MockPostModel.findById.mockResolvedValue(post);
      MockPostModel.findByIdAndDelete.mockResolvedValue(post);

      await service.delete('post1', 'u1');

      expect(MockPostModel.findByIdAndDelete).toHaveBeenCalledWith('post1');
      expect(mockUsersService.decrementPostsCount).toHaveBeenCalledWith('u1');
      expect(mockUsersService.decrementLikesReceived).toHaveBeenCalledWith(
        'u1',
      );
    });

    it('should throw if post missing', async () => {
      MockPostModel.findById.mockResolvedValue(null);
      await expect(service.delete('bad', 'u')).rejects.toThrow(
        'Post not found',
      );
    });

    it('should throw if unauthorized', async () => {
      const post = { ...mockPost, authorId: 'u1' };
      MockPostModel.findById.mockResolvedValue(post);
      await expect(service.delete('post1', 'u2')).rejects.toThrow(
        'Unauthorized',
      );
    });
  });
});
