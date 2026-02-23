import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

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
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
