import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('firebase')
  @ApiOperation({ summary: 'Login with Firebase ID token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid Firebase token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idToken: { type: 'string', example: 'FIREBASE_ID_TOKEN' },
      },
      required: ['idToken'],
    },
  })
  async firebaseAuth(
    @Body() body: { idToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body.idToken) throw new UnauthorizedException('No token provided');
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(body.idToken);
      const user = await this.authService.validateFirebaseUser(decodedToken);
      const loginResult = await this.authService.login(user);
      const refreshToken = await this.authService.generateRefreshToken(user._id);
      this.setRefreshCookie(res, refreshToken);
      return loginResult;
    } catch (error) {
      console.error('Firebase auth error:', error.message);
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register with email/password' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 409, description: 'User already registered' })
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(
      body.email,
      body.password,
      body.name,
    );
    const refreshToken = await this.authService.generateRefreshToken(
      result.user._id,
    );
    this.setRefreshCookie(res, refreshToken);
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email/password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginWithPassword(
      body.email,
      body.password,
    );
    const refreshToken = await this.authService.generateRefreshToken(
      result.user._id,
    );
    this.setRefreshCookie(res, refreshToken);
    return result;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token (uses refresh cookie)' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    const { refreshToken: newRefreshToken, ...loginResult } =
      await this.authService.rotateRefreshToken(refreshToken);
    this.setRefreshCookie(res, newRefreshToken);
    return loginResult;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout (revokes refresh token cookie)' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        await this.authService.revokeRefreshToken(refreshToken);
      } catch (error) {
        await this.authService.revokeAllUserTokensFromRefresh(refreshToken);
      }
    }
    res.clearCookie('refreshToken', this.getCookieOptions());
    return { message: 'Logged out' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req) {
    return req.user;
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, this.getCookieOptions());
  }

  private getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    };
  }
}
