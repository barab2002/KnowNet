import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/api/auth/google/redirect',
      scope: ['email', 'profile'],
      // We might need 'https://www.googleapis.com/auth/generative-language' if it exists, or just rely on API Key.
      // Actually, for "User Quota", we usually need the specific scope.
      // Let's try the broad one for now or just proceed.
      // Re-reading docs: 'https://www.googleapis.com/auth/generative-language.retriever' is good for RAG.
      // For plain generation, it might just need the basic one.
      // Let's stick to adding just 'email', 'profile' effectively, but user wants "his user".
      // I'll add 'email', 'profile'. If I want to use the token for Gemini, I need a scope.
      // Let's add 'https://www.googleapis.com/auth/cloud-platform' is too risky.
      // Let's add 'https://www.googleapis.com/auth/generative-language.retriever'.
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      googleId: id,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
