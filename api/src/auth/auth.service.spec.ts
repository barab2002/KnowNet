import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findOrCreate: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateFirebaseUser', () => {
    const decodedToken = {
      uid: 'firebase-uid-123',
      email: 'test@test.com',
      name: 'John Doe',
      picture: 'https://example.com/pic.jpg',
    };

    it('should find or create user from Firebase decoded token', async () => {
      const user = { _id: 'firebase-uid-123', email: 'test@test.com', name: 'John Doe' };
      mockUsersService.findOrCreate.mockResolvedValue(user);

      const result = await service.validateFirebaseUser(decodedToken);

      expect(result).toBe(user);
      expect(mockUsersService.findOrCreate).toHaveBeenCalledWith(
        'firebase-uid-123',
        expect.objectContaining({
          email: 'test@test.com',
          name: 'John Doe',
          profileImageUrl: 'https://example.com/pic.jpg',
        }),
      );
    });

    it('should fall back to email prefix when name is missing', async () => {
      const tokenWithoutName = { uid: 'uid-1', email: 'test@test.com', name: undefined, picture: undefined };
      mockUsersService.findOrCreate.mockResolvedValue({ _id: 'uid-1' });

      await service.validateFirebaseUser(tokenWithoutName);

      expect(mockUsersService.findOrCreate).toHaveBeenCalledWith(
        'uid-1',
        expect.objectContaining({ name: 'test' }),
      );
    });

    it('should throw if usersService throws', async () => {
      mockUsersService.findOrCreate.mockRejectedValue(new Error('DB Error'));
      await expect(service.validateFirebaseUser(decodedToken)).rejects.toThrow('DB Error');
    });
  });

  describe('login', () => {
    const user = { _id: '123', email: 'test@test.com', name: 'John' };

    it('should return accessToken and user', async () => {
      mockJwtService.sign.mockReturnValue('signed-token');
      const result = await service.login(user);

      expect(result.accessToken).toBe('signed-token');
      expect(result.user).toBe(user);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: '123', email: 'test@test.com', name: 'John' },
        expect.objectContaining({ secret: expect.any(String), expiresIn: expect.any(String) }),
      );
    });

    it('should throw if jwt sign fails', async () => {
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('Sign failed');
      });
      await expect(service.login(user)).rejects.toThrow('Sign failed');
    });
  });
});
