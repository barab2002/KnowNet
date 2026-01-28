import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ default: 0 })
  likes: number;

  @Prop([String])
  tags: string[];
  
  // Simple comments array for now, could be its own schema later
  @Prop({ type: [{ user: { type: Types.ObjectId, ref: 'User' }, text: String, createdAt: Date }] })
  comments: Record<string, any>[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
