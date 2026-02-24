import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateFirebaseUser(decodedToken: any) {
    const { uid, email, name, picture } = decodedToken;

    const user = await this.usersService.findOrCreate(uid, {
      email: email || '',
      name: name || email?.split('@')[0] || 'User',
      profileImageUrl: picture,
    });

    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'secretKey',
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      }),
      user: user,
    };
  }

  async register(email: string, password: string, name?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('User already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.createLocalUser(
      email,
      name || email.split('@')[0],
      passwordHash,
    );

    return this.login(user);
  }

  async loginWithPassword(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.login(user);
  }

  async generateRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secretKey',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      },
    );

    const decoded = this.jwtService.decode(refreshToken) as { exp?: number };
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.usersService.addRefreshToken(userId, refreshToken, expiresAt);
    return refreshToken;
  }

  async rotateRefreshToken(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secretKey',
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findByRefreshToken(refreshToken);
    if (!user) {
      await this.usersService.revokeAllRefreshTokens(payload.sub);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    const tokenEntry = user.refreshTokens.find((t) => t.token === refreshToken);
    if (!tokenEntry || tokenEntry.revoked) {
      await this.usersService.revokeAllRefreshTokens(user._id);
      throw new UnauthorizedException('Refresh token revoked');
    }

    if (tokenEntry.expiresAt && tokenEntry.expiresAt < new Date()) {
      await this.usersService.revokeAllRefreshTokens(user._id);
      throw new UnauthorizedException('Refresh token expired');
    }

    const newRefreshToken = this.jwtService.sign(
      { sub: user._id },
      {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secretKey',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      },
    );

    const decoded = this.jwtService.decode(newRefreshToken) as { exp?: number };
    const newExpiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.usersService.rotateRefreshToken(
      user._id,
      refreshToken,
      newRefreshToken,
      newExpiresAt,
    );

    const loginResult = await this.login(user);
    return { ...loginResult, refreshToken: newRefreshToken };
  }

  async revokeRefreshToken(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken) as { sub?: string };
    if (!decoded?.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.usersService.revokeRefreshToken(decoded.sub, refreshToken);
  }

  async revokeAllUserTokensFromRefresh(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken) as { sub?: string };
    if (decoded?.sub) {
      await this.usersService.revokeAllRefreshTokens(decoded.sub);
    }
  }
}
