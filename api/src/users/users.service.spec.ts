import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  _id: 'user1',
  email: 'test@example.com',
  name: 'Test User',
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let model: any;

  class MockUserModel {
    constructor(private data: any) {
      Object.assign(this, data);
    }
    save = jest.fn().mockResolvedValue(this);
    static findById = jest.fn();
    static findOne = jest.fn();
    static findByIdAndUpdate = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      MockUserModel.findById.mockResolvedValue(mockUser);
      const result = await service.findById('user1');
      expect(result).toBe(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      MockUserModel.findById.mockResolvedValue(null);
      await expect(service.findById('user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOrCreate', () => {
    it('should return existing user if found by googleId', async () => {
      const initialData = { googleId: 'g1' };
      MockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findOrCreate('user1', initialData);
      expect(result).toBe(mockUser);
      expect(MockUserModel.findOne).toHaveBeenCalledWith({ googleId: 'g1' });
    });

    it('should create new user if not found', async () => {
      MockUserModel.findOne.mockResolvedValue(null);
      MockUserModel.findById.mockResolvedValue(null);

      // The constructor is called, we need to inspect the invocation or the result
      // Since we mocked the class implementation, the save() in the mock class returns 'this'

      const result = await service.findOrCreate('user1', {});
      expect(result._id).toBe('user1');
      // Verify save was called? MockUserModel instances have save mocked.
      // result.save is a jest mock.
      expect((result as any).save).toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('should update and return user', async () => {
      MockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);
      const dto = { name: 'New Name' };
      const result = await service.updateProfile('user1', dto);
      expect(result).toBe(mockUser);
      expect(MockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user1',
        { $set: dto },
        { new: true, upsert: true },
      );
    });

    it('should throw if update returns null', async () => {
      MockUserModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.updateProfile('user1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('uploadProfileImage', () => {
    it('should update profile image', async () => {
      MockUserModel.findByIdAndUpdate.mockResolvedValue({
        ...mockUser,
        profileImageUrl: 'url',
      });
      const result = await service.uploadProfileImage('user1', 'url');
      expect((result as any).profileImageUrl).toBe('url');
    });

    it('should throw if user not found during image upload', async () => {
      MockUserModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.uploadProfileImage('user1', 'url')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('increment/decrement counters', () => {
    it('should increment posts count', async () => {
      MockUserModel.findByIdAndUpdate.mockResolvedValue({});
      await service.incrementPostsCount('user1');
      expect(MockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('user1', {
        $inc: { postsCount: 1 },
      });
    });

    it('should decrement posts count', async () => {
      MockUserModel.findByIdAndUpdate.mockResolvedValue({});
      await service.decrementPostsCount('user1');
      expect(MockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('user1', {
        $inc: { postsCount: -1 },
      });
    });
  });
});
