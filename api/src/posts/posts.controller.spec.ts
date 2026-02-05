import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    findAll: jest.fn(),
    createWithImage: jest.fn(),
    getUniqueTags: jest.fn(),
    search: jest.fn(),
    getPostsByUser: jest.fn(),
    summarizePost: jest.fn(),
    toggleLike: jest.fn(),
    toggleSave: jest.fn(),
    addComment: jest.fn(),
    getLikedPosts: jest.fn(),
    getSavedPosts: jest.fn(),
    getTotalLikesForUser: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const result = { posts: [], total: 0 };
      mockPostsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(10, 0)).toBe(result);
      expect(mockPostsService.findAll).toHaveBeenCalledWith(10, 0);
    });

    it('should throw if service fails', async () => {
      mockPostsService.findAll.mockRejectedValue(new Error('Fail'));
      await expect(controller.findAll(10, 0)).rejects.toThrow('Fail');
    });
  });

  describe('create', () => {
    it('should create a post', async () => {
      const dto: CreatePostDto = { content: 'test', authorId: 'user1' };
      const req = { user: { _id: 'user1' } };
      const result = { _id: 'post1', ...dto };

      mockPostsService.createWithImage.mockResolvedValue(result);

      expect(await controller.create(dto, req)).toBe(result);
      expect(mockPostsService.createWithImage).toHaveBeenCalledWith(
        expect.objectContaining({ authorId: 'user1' }),
        '',
        undefined,
        undefined,
      );
    });

    it('should create a post with image', async () => {
      const dto: CreatePostDto = { content: 'test', authorId: 'user1' };
      const req = { user: { _id: 'user1' } };
      const image = { buffer: Buffer.from('img'), mimetype: 'image/png' };
      const result = { _id: 'post1', ...dto, imageUrl: 'data:...' };

      mockPostsService.createWithImage.mockResolvedValue(result);

      expect(await controller.create(dto, req, image)).toBe(result);
      expect(mockPostsService.createWithImage).toHaveBeenCalled();
    });

    it('should propagate service error', async () => {
      const dto: CreatePostDto = { content: 'test', authorId: 'user1' };
      const req = { user: { _id: 'user1' } };
      mockPostsService.createWithImage.mockRejectedValue(new Error('Fail'));
      await expect(controller.create(dto, req)).rejects.toThrow('Fail');
    });
  });

  describe('getTags', () => {
    it('should return unique tags', async () => {
      const tags = ['tag1', 'tag2'];
      mockPostsService.getUniqueTags.mockResolvedValue(tags);
      expect(await controller.getTags()).toBe(tags);
    });

    it('should fail if service fails', async () => {
      mockPostsService.getUniqueTags.mockRejectedValue(new Error('Fail'));
      await expect(controller.getTags()).rejects.toThrow('Fail');
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      const posts = [{ content: 'hello' }];
      mockPostsService.search.mockResolvedValue(posts);
      expect(await controller.search('hello')).toBe(posts);
    });

    it('should return empty array for empty query', async () => {
      expect(await controller.search('')).toEqual([]);
      expect(mockPostsService.search).not.toHaveBeenCalled();
    });

    it('should fail if service fails', async () => {
      mockPostsService.search.mockRejectedValue(new Error('Fail'));
      await expect(controller.search('q')).rejects.toThrow('Fail');
    });
  });

  describe('summarize', () => {
    it('should summarize post', async () => {
      mockPostsService.summarizePost.mockResolvedValue('summary');
      expect(await controller.summarize('1')).toBe('summary');
    });

    it('should fail on service error', async () => {
      mockPostsService.summarizePost.mockRejectedValue(new Error('Fail'));
      await expect(controller.summarize('1')).rejects.toThrow('Fail');
    });
  });

  describe('toggleLike', () => {
    it('should toggle like', async () => {
      const result = { likes: [] };
      mockPostsService.toggleLike.mockResolvedValue(result);
      expect(await controller.toggleLike('1', 'user1')).toBe(result);
    });

    it('should fail if service throws', async () => {
      mockPostsService.toggleLike.mockRejectedValue(new Error('Fail'));
      await expect(controller.toggleLike('1', 'u')).rejects.toThrow('Fail');
    });
  });

  describe('toggleSave', () => {
    it('should toggle save', async () => {
      const result = { saved: true };
      mockPostsService.toggleSave.mockResolvedValue(result);
      expect(await controller.toggleSave('1', 'user1')).toBe(result);
    });

    it('should fail if service throws', async () => {
      mockPostsService.toggleSave.mockRejectedValue(new Error('Fail'));
      await expect(controller.toggleSave('1', 'u')).rejects.toThrow('Fail');
    });
  });

  describe('addComment', () => {
    it('should add comment', async () => {
      const result = { comments: [{ content: 'nice' }] };
      mockPostsService.addComment.mockResolvedValue(result);
      expect(await controller.addComment('1', 'user1', 'nice')).toBe(result);
    });

    it('should fail if service throws', async () => {
      mockPostsService.addComment.mockRejectedValue(new Error('Fail'));
      await expect(controller.addComment('1', 'u', 'c')).rejects.toThrow(
        'Fail',
      );
    });
  });

  describe('getUserPosts', () => {
    it('should return user posts', async () => {
      const result = [];
      mockPostsService.getPostsByUser.mockResolvedValue(result);
      expect(await controller.getUserPosts('user1')).toBe(result);
    });

    it('should propagate error', async () => {
      mockPostsService.getPostsByUser.mockRejectedValue(new Error('Fail'));
      await expect(controller.getUserPosts('u')).rejects.toThrow('Fail');
    });
  });

  describe('getLikedPosts', () => {
    it('should return liked posts', async () => {
      const result = [];
      mockPostsService.getLikedPosts.mockResolvedValue(result);
      expect(await controller.getLikedPosts('user1')).toBe(result);
    });

    it('should propagate error', async () => {
      mockPostsService.getLikedPosts.mockRejectedValue(new Error('Fail'));
      await expect(controller.getLikedPosts('u')).rejects.toThrow('Fail');
    });
  });

  describe('getSavedPosts', () => {
    it('should return saved posts', async () => {
      const result = [];
      mockPostsService.getSavedPosts.mockResolvedValue(result);
      expect(await controller.getSavedPosts('user1')).toBe(result);
    });

    it('should propagate error', async () => {
      mockPostsService.getSavedPosts.mockRejectedValue(new Error('Fail'));
      await expect(controller.getSavedPosts('u')).rejects.toThrow('Fail');
    });
  });

  describe('getTotalLikes', () => {
    it('should return total likes', async () => {
      mockPostsService.getTotalLikesForUser.mockResolvedValue(10);
      expect(await controller.getTotalLikes('user1')).toEqual({
        totalLikes: 10,
      });
    });

    it('should propagate error', async () => {
      mockPostsService.getTotalLikesForUser.mockRejectedValue(
        new Error('Fail'),
      );
      await expect(controller.getTotalLikes('u')).rejects.toThrow('Fail');
    });
  });

  describe('delete', () => {
    it('should delete post', async () => {
      const req = { user: { _id: 'user1' } };
      mockPostsService.delete.mockResolvedValue({ deleted: true });
      expect(await controller.delete('1', req)).toEqual({ deleted: true });
      expect(mockPostsService.delete).toHaveBeenCalledWith('1', 'user1');
    });

    it('should propagate error', async () => {
      const req = { user: { _id: 'user1' } };
      mockPostsService.delete.mockRejectedValue(new Error('Fail'));
      await expect(controller.delete('1', req)).rejects.toThrow('Fail');
    });
  });
});
