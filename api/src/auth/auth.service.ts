import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleUser: any) {
    // googleUser is the object returned from GoogleStrategy.validate
    // We use the googleId as the User ID for simplicity in this implementation,
    // or we could find by email/googleId

    // Check if user exists by googleId (we need to update UsersService for this)
    // For now, let's reuse findOrCreate functionality.
    // We'll use the googleId as the _id since our system uses string IDs.

    const user = await this.usersService.findOrCreate(googleUser.googleId, {
      email: googleUser.email,
      name: `${googleUser.firstName} ${googleUser.lastName}`,
      profileImageUrl: googleUser.picture,
      googleAccessToken: googleUser.accessToken,
      googleRefreshToken: googleUser.refreshToken,
    });

    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
