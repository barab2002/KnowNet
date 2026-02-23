import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('firebase')
  async firebaseAuth(@Body() body: { idToken: string }) {
    if (!body.idToken) throw new UnauthorizedException('No token provided');
    const decodedToken = await this.firebaseService.verifyIdToken(body.idToken);
    const user = await this.authService.validateFirebaseUser(decodedToken);
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
