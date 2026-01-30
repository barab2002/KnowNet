import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
