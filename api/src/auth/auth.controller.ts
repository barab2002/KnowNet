import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Guard initiates Google Login
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // req.user is populated by GoogleStrategy.validate -> AuthService.validateGoogleUser (if we configured it so, actually Strategy returns the google profile object, we need to handle the user creation here or in the strategy)
    // Actually, usually Strategy return calls done(null, user), that user object is assigned to req.user.

    const user = await this.authService.validateGoogleUser(req.user);
    const { access_token } = await this.authService.login(user);

    // Redirect to frontend with token
    // Assuming frontend is running on localhost:4200 (or whatever configured)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    res.redirect(`${frontendUrl}/login/success?token=${access_token}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
