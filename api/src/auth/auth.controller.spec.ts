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
  };

  const mockFirebaseService = {
    verifyIdToken: jest.fn(),
  };

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
      await expect(controller.firebaseAuth({ idToken: '' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return access_token and user on valid token', async () => {
      const decodedToken = { uid: 'uid1', email: 'test@test.com', name: 'John' };
      const user = { _id: 'uid1', email: 'test@test.com', name: 'John' };
      const loginResult = { access_token: 'jwt-token', user };

      mockFirebaseService.verifyIdToken.mockResolvedValue(decodedToken);
      mockAuthService.validateFirebaseUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(loginResult);

      const result = await controller.firebaseAuth({ idToken: 'valid-firebase-token' });

      expect(mockFirebaseService.verifyIdToken).toHaveBeenCalledWith('valid-firebase-token');
      expect(mockAuthService.validateFirebaseUser).toHaveBeenCalledWith(decodedToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toBe(loginResult);
    });

    it('should throw UnauthorizedException when Firebase verification fails', async () => {
      mockFirebaseService.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(
        controller.firebaseAuth({ idToken: 'bad-token' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user from req', () => {
      const req = { user: { _id: '1', email: 'test@test.com' } };
      expect(controller.getProfile(req)).toBe(req.user);
    });

    it('should return undefined if user is not set (guard handles protection)', () => {
      const req = { user: undefined };
      expect(controller.getProfile(req)).toBeUndefined();
    });
  });
});
