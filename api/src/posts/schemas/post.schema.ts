import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  userTags: string[]; // User-written hashtags

  @Prop({ type: [String], default: [] })
  aiTags: string[]; // AI-generated or keyword fallback tags

  @Prop({ required: false })
  summary?: string;

  @Prop({ type: String, required: false })
  imageUrl?: string;

  @Prop({ type: String, ref: 'User', required: false }) // Making optional for backward compatibility
  authorId?: string;

  @Prop({ type: [String], default: [] })
  likes: string[]; // User IDs

  @Prop({ type: [String], default: [] })
  savedBy: string[]; // User IDs

  @Prop({
    type: [
      {
        userId: String,
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: {
    userId: string;
    content: string;
    createdAt: Date;
  }[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ content: 'text', tags: 'text' });
