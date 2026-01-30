import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOrCreate(
    userId: string,
    initialData?: Partial<User>,
  ): Promise<User> {
    let user = await this.userModel.findById(userId);
    if (!user) {
      user = new this.userModel({
        _id: userId,
        email: initialData?.email || `user-${userId}@knownet.com`,
        name: initialData?.name || 'Anonymous User',
        ...initialData,
      });
      await user.save();
    }
    return user;
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateDto },
      { new: true, upsert: true },
    );
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async uploadProfileImage(userId: string, imageUrl: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { profileImageUrl: imageUrl } },
      { new: true, upsert: true },
    );
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async incrementPostsCount(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });
  }

  async decrementPostsCount(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { postsCount: -1 },
    });
  }

  async incrementLikesReceived(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { likesReceived: 1 },
    });
  }

  async decrementLikesReceived(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { likesReceived: -1 },
    });
  }

  async incrementAiSummaries(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { aiSummariesCount: 1 },
    });
  }
}
