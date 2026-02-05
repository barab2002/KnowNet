import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findById: jest.fn(),
    findOrCreate: jest.fn(),
    updateProfile: jest.fn(),
    uploadProfileImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { _id: '1' };
      mockUsersService.findById.mockResolvedValue(user);
      expect(await controller.getProfile('1')).toBe(user);
    });

    it('should propagate errors from service', async () => {
      mockUsersService.findById.mockRejectedValue(new Error('Fail'));
      await expect(controller.getProfile('1')).rejects.toThrow('Fail');
    });
  });

  describe('createUser', () => {
    it('should call findOrCreate', async () => {
      const body = { _id: '1', email: 'e', name: 'n' };
      mockUsersService.findOrCreate.mockResolvedValue(body);
      expect(await controller.createUser(body)).toBe(body);
      expect(mockUsersService.findOrCreate).toHaveBeenCalledWith('1', body);
    });

    it('should propagate errors', async () => {
      mockUsersService.findOrCreate.mockRejectedValue(new Error('Fail'));
      await expect(controller.createUser({ _id: '1' } as any)).rejects.toThrow(
        'Fail',
      );
    });
  });

  describe('updateProfile', () => {
    it('should update profile', async () => {
      const dto = { name: 'New' };
      mockUsersService.updateProfile.mockResolvedValue(dto);
      expect(await controller.updateProfile('1', dto)).toBe(dto);
    });

    it('should propagate failure', async () => {
      mockUsersService.updateProfile.mockRejectedValue(new Error('Fail'));
      await expect(controller.updateProfile('1', {})).rejects.toThrow('Fail');
    });
  });

  describe('uploadProfileImage', () => {
    it('should upload image url', async () => {
      const file = { filename: 'f.png' } as any;
      mockUsersService.uploadProfileImage.mockResolvedValue({
        profileImageUrl: 'path/f.png',
      });

      const result = await controller.uploadProfileImage('1', file);
      expect(result.profileImageUrl).toContain('path/f.png');
      expect(mockUsersService.uploadProfileImage).toHaveBeenCalledWith(
        '1',
        expect.stringContaining('uploads/profile-images/f.png'),
      );
    });

    it('should throw BadRequest if file is missing', async () => {
      await expect(controller.uploadProfileImage('1', null)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
