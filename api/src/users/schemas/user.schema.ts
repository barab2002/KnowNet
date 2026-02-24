import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  passwordHash?: string;

  @Prop()
  googleId?: string;

  @Prop()
  googleAccessToken?: string;

  @Prop()
  googleRefreshToken?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  bio?: string;

  @Prop()
  major?: string;

  @Prop()
  graduationYear?: string;

  @Prop()
  profileImageUrl?: string;

  @Prop({ default: Date.now })
  joinedDate: Date;

  @Prop({ default: 0 })
  postsCount: number;

  @Prop({ default: 0 })
  likesReceived: number;

  @Prop({ default: 0 })
  aiSummariesCount: number;

  @Prop({
    type: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date,
        revoked: { type: Boolean, default: false },
        replacedByToken: String,
      },
    ],
    default: [],
  })
  refreshTokens: {
    token: string;
    createdAt: Date;
    expiresAt: Date;
    revoked?: boolean;
    replacedByToken?: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
