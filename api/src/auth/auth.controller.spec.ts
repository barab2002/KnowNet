import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateFirebaseUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    loginWithPassword: jest.fn(),
    generateRefreshToken: jest.fn(),
    rotateRefreshToken: jest.fn(),
    revokeRefreshToken: jest.fn(),
    revokeAllUserTokensFromRefresh: jest.fn(),
  };

  const mockFirebaseService = {
    verifyIdToken: jest.fn(),
  };

  const mockRes = { cookie: jest.fn(), clearCookie: jest.fn() } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: FirebaseService, useValue: mockFirebaseService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('firebaseAuth', () => {
    it('should throw UnauthorizedException when no idToken provided', async () => {
      await expect(controller.firebaseAuth({ idToken: '' }, mockRes)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return accessToken and user on valid token', async () => {
      const decodedToken = { uid: 'uid1', email: 'test@test.com', name: 'John' };
      const user = { _id: 'uid1', email: 'test@test.com', name: 'John' };
      const loginResult = { accessToken: 'jwt-token', user };

      mockFirebaseService.verifyIdToken.mockResolvedValue(decodedToken);
      mockAuthService.validateFirebaseUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(loginResult);
      mockAuthService.generateRefreshToken.mockResolvedValue('refresh-token');

      const result = await controller.firebaseAuth({ idToken: 'valid-firebase-token' }, mockRes);

      expect(mockFirebaseService.verifyIdToken).toHaveBeenCalledWith('valid-firebase-token');
      expect(mockAuthService.validateFirebaseUser).toHaveBeenCalledWith(decodedToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(mockAuthService.generateRefreshToken).toHaveBeenCalledWith(user._id);
      expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
      expect(result).toBe(loginResult);
    });

    it('should throw UnauthorizedException when Firebase verification fails', async () => {
      mockFirebaseService.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(
        controller.firebaseAuth({ idToken: 'bad-token' }, mockRes),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register user and set refresh cookie', async () => {
      const body = { email: 'a@b.com', password: 'pass123', name: 'Alice' };
      const user = { _id: 'u1', email: 'a@b.com', name: 'Alice' };
      const loginResult = { accessToken: 'token', user };

      mockAuthService.register.mockResolvedValue(loginResult);
      mockAuthService.generateRefreshToken.mockResolvedValue('refresh-token');

      const result = await controller.register(body as any, mockRes);

      expect(mockAuthService.register).toHaveBeenCalledWith('a@b.com', 'pass123', 'Alice');
      expect(mockAuthService.generateRefreshToken).toHaveBeenCalledWith('u1');
      expect(mockRes.cookie).toHaveBeenCalled();
      expect(result).toBe(loginResult);
    });
  });

  describe('login', () => {
    it('should login with password and set refresh cookie', async () => {
      const body = { email: 'a@b.com', password: 'pass123' };
      const user = { _id: 'u1', email: 'a@b.com', name: 'Alice' };
      const loginResult = { accessToken: 'token', user };

      mockAuthService.loginWithPassword.mockResolvedValue(loginResult);
      mockAuthService.generateRefreshToken.mockResolvedValue('refresh-token');

      const result = await controller.login(body as any, mockRes);

      expect(mockAuthService.loginWithPassword).toHaveBeenCalledWith('a@b.com', 'pass123');
      expect(result).toBe(loginResult);
    });
  });

  describe('refresh', () => {
    it('should rotate refresh token and set new cookie', async () => {
      const req = { cookies: { refreshToken: 'old-token' } } as any;
      const rotateResult = { accessToken: 'new-access', user: {}, refreshToken: 'new-refresh' };

      mockAuthService.rotateRefreshToken.mockResolvedValue(rotateResult);

      const result = await controller.refresh(req, mockRes);

      expect(mockAuthService.rotateRefreshToken).toHaveBeenCalledWith('old-token');
      expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'new-refresh', expect.any(Object));
      expect(result).not.toHaveProperty('refreshToken');
    });

    it('should throw if no refresh token in cookie', async () => {
      const req = { cookies: {} } as any;
      await expect(controller.refresh(req, mockRes)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should revoke refresh token and clear cookie', async () => {
      const req = { cookies: { refreshToken: 'some-token' } } as any;
      mockAuthService.revokeRefreshToken.mockResolvedValue(undefined);

      const result = await controller.logout(req, mockRes);

      expect(mockAuthService.revokeRefreshToken).toHaveBeenCalledWith('some-token');
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refreshToken', expect.any(Object));
      expect(result).toEqual({ message: 'Logged out' });
    });

    it('should clear cookie even with no refresh token', async () => {
      const req = { cookies: {} } as any;
      const result = await controller.logout(req, mockRes);
      expect(result).toEqual({ message: 'Logged out' });
    });
  });

  describe('getProfile', () => {
    it('should return user from req', () => {
      const req = { user: { _id: '1', email: 'test@test.com' } };
      expect(controller.getProfile(req)).toBe(req.user);
    });

    it('should return undefined if user is not set', () => {
      const req = { user: undefined };
      expect(controller.getProfile(req)).toBeUndefined();
    });
  });
});
