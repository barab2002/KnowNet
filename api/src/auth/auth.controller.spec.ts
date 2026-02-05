import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateGoogleUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('googleAuth', () => {
    it('should be defined', async () => {
      // It's a guard protected route, void body
      expect(await controller.googleAuth({})).toBeUndefined();
    });

    it('should handle call (no-op)', async () => {
      // Technically nothing to fail here as it's empty
      const result = await controller.googleAuth({});
      expect(result).toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it('should redirect to frontend with token', async () => {
      const req = { user: { googleId: '123' } };
      const res = { redirect: jest.fn() } as unknown as Response;
      const user = { _id: '123' };

      mockAuthService.validateGoogleUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue({ access_token: 'jwt-token' });

      await controller.googleAuthRedirect(req, res);

      expect(mockAuthService.validateGoogleUser).toHaveBeenCalledWith(req.user);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('?token=jwt-token'),
      );
    });

    it('should throw if auth service fails', async () => {
      const req = { user: {} };
      const res = { redirect: jest.fn() } as unknown as Response;
      mockAuthService.validateGoogleUser.mockRejectedValue(
        new Error('Auth failed'),
      );

      await expect(controller.googleAuthRedirect(req, res)).rejects.toThrow(
        'Auth failed',
      );
    });
  });

  describe('getProfile', () => {
    it('should return user from req', () => {
      const req = { user: { id: 1 } };
      expect(controller.getProfile(req)).toBe(req.user);
    });

    it('should succeed even if user is undefined (guard handles protection)', () => {
      const req = { user: undefined };
      expect(controller.getProfile(req)).toBeUndefined();
    });
  });
});
