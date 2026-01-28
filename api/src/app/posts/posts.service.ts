import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Ideally we would get the author ID from the JWT user context, 
    // but for now we trust the DTO or hardcode it in controller.
    const createdPost = new this.postModel({
      ...createPostDto,
      likes: 0,
      comments: []
    });
    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().populate('author', 'name avatarUrl').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Post> {
    return this.postModel.findById(id).populate('author', 'name avatarUrl').exec();
  }
}
