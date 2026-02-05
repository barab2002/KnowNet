import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

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
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateGoogleUser', () => {
    const googleUser = {
      googleId: '123',
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'pic',
      accessToken: 'token',
      refreshToken: 'refresh',
    };

    it('should validate and create/find user', async () => {
      const user = { _id: '123', ...googleUser };
      mockUsersService.findOrCreate.mockResolvedValue(user);

      const result = await service.validateGoogleUser(googleUser);
      expect(result).toBe(user);
      expect(mockUsersService.findOrCreate).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({ email: 'test@test.com' }),
      );
    });

    it('should throw if usersService throws', async () => {
      mockUsersService.findOrCreate.mockRejectedValue(new Error('DB Error'));
      await expect(service.validateGoogleUser(googleUser)).rejects.toThrow(
        'DB Error',
      );
    });
  });

  describe('login', () => {
    const user = { _id: '123', email: 'test@test.com', name: 'John' };

    it('should return access_token and user', async () => {
      mockJwtService.sign.mockReturnValue('signed-token');
      const result = await service.login(user);

      expect(result.access_token).toBe('signed-token');
      expect(result.user).toBe(user);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: '123',
        email: 'test@test.com',
        name: 'John',
      });
    });

    it('should fail if jwt sign fails', async () => {
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('Sign failed');
      });
      await expect(service.login(user)).rejects.toThrow('Sign failed');
    });
  });
});
