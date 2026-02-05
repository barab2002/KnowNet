import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';
import { MockType } from '../../test/mocks';

describe('PostsService', () => {
  let service: PostsService;
  let model: any; // Mock Model

  const mockPostModel = {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };

  // Class mock for "new this.postModel()"
  class MockPostModelClass {
    constructor(private data: any) {}
    save = jest.fn().mockResolvedValue({ _id: 'new_id', ...this.data });
    static find = jest.fn().mockReturnThis();
    static populate = jest.fn().mockReturnThis();
    static sort = jest.fn().mockReturnThis();
    static skip = jest.fn().mockReturnThis();
    static limit = jest.fn().mockReturnThis();
    static exec = jest.fn().mockResolvedValue([]);
    static countDocuments = jest.fn().mockResolvedValue(0);
    static findByIdAndUpdate = jest.fn().mockResolvedValue({});
  }

  const mockUsersService = {
    incrementPostCount: jest.fn(),
  };

  const mockAiService = {
    generateSummary: jest.fn(),
    generateTags: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: MockPostModelClass,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    model = module.get(getModelToken(Post.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const mockPosts = [{ _id: '1', content: 'test' }];
      // Setup chain
      jest.spyOn(MockPostModelClass, 'find').mockReturnThis();
      jest.spyOn(MockPostModelClass, 'populate').mockReturnThis();
      jest.spyOn(MockPostModelClass, 'sort').mockReturnThis();
      jest.spyOn(MockPostModelClass, 'skip').mockReturnThis();
      jest.spyOn(MockPostModelClass, 'limit').mockReturnThis();
      jest.spyOn(MockPostModelClass, 'exec').mockResolvedValue(mockPosts);
      jest.spyOn(MockPostModelClass, 'countDocuments').mockResolvedValue(1);

      const result = await service.findAll(10, 0);

      expect(result.posts).toEqual(mockPosts);
      expect(result.total).toBe(1);
    });
  });

  /*
  describe('createWithImage', () => {
    it.skip('should create post and trigger background AI', async () => {
      (service as any).incrementPostCount = jest
        .fn()
        .mockResolvedValue(undefined);
      (service as any).processAiInBackground = jest
        .fn()
        .mockResolvedValue(undefined);

      const dto = { content: 'test content', authorId: 'user1' };
      const result = await service.createWithImage(dto);

      expect(result).toBeDefined();
      expect(result.content).toBe('test content');
      // processAiInBackground called? It's private, but we spied on prototype or instance
      // "service as any" allows access.
      expect((service as any).processAiInBackground).toHaveBeenCalled();
    });
  });
  */
});
