import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { jest } from '@jest/globals';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    findAll: jest.fn(),
    createWithImage: jest.fn(),
    getUniqueTags: jest.fn(),
    search: jest.fn(),
    getPostsByUser: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return posts', async () => {
      const result = { posts: [], total: 0 };
      (mockPostsService.findAll as any).mockResolvedValue(result);

      expect(await controller.findAll(10, 0)).toBe(result);
      expect(mockPostsService.findAll).toHaveBeenCalledWith(10, 0);
    });
  });

  describe('getUserPosts', () => {
    it('should return user posts', async () => {
      const result = [];
      (mockPostsService.getPostsByUser as any).mockResolvedValue(result);
      expect(await controller.getUserPosts('user1')).toBe(result);
    });
  });
});
