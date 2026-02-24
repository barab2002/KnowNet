import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOrCreate(
    userId: string,
    initialData?: Partial<User>,
  ): Promise<User> {
    // If googleId provided in initialData, try to find by that first
    if (initialData?.googleId) {
      const existingUser = await this.userModel.findOne({
        googleId: initialData.googleId,
      });
      if (existingUser) return existingUser;
    }

    let user = await this.userModel.findById(userId);
    if (!user && initialData?.email) {
      user = await this.userModel.findOne({ email: initialData.email });
    }
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

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createLocalUser(
    email: string,
    name: string,
    passwordHash: string,
  ): Promise<User> {
    const user = new this.userModel({
      _id: new Types.ObjectId().toString(),
      email,
      name,
      passwordHash,
    });
    await user.save();
    return user;
  }

  async findByRefreshToken(token: string): Promise<User | null> {
    return this.userModel
      .findOne({ 'refreshTokens.token': token })
      .exec();
  }

  async addRefreshToken(userId: string, token: string, expiresAt: Date) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          refreshTokens: {
            token,
            createdAt: new Date(),
            expiresAt,
            revoked: false,
          },
        },
      },
      { new: true },
    );
  }

  async rotateRefreshToken(
    userId: string,
    oldToken: string,
    newToken: string,
    newExpiresAt: Date,
  ) {
    return this.userModel.findOneAndUpdate(
      { _id: userId, 'refreshTokens.token': oldToken },
      {
        $set: {
          'refreshTokens.$.revoked': true,
          'refreshTokens.$.replacedByToken': newToken,
        },
        $push: {
          refreshTokens: {
            token: newToken,
            createdAt: new Date(),
            expiresAt: newExpiresAt,
            revoked: false,
          },
        },
      },
      { new: true },
    );
  }

  async revokeRefreshToken(userId: string, token: string) {
    return this.userModel.findOneAndUpdate(
      { _id: userId, 'refreshTokens.token': token },
      { $set: { 'refreshTokens.$.revoked': true } },
      { new: true },
    );
  }

  async revokeAllRefreshTokens(userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $set: { 'refreshTokens.$[].revoked': true } },
      { new: true },
    );
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
