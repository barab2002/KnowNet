import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by id' })
  @ApiParam({ name: 'userId', example: 'user-123' })
  @ApiResponse({
    status: 200,
    description: 'User profile returned',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'user-123' },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'Jane Doe' },
        bio: { type: 'string', nullable: true },
        major: { type: 'string', nullable: true },
        graduationYear: { type: 'string', nullable: true },
        profileImageUrl: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create or find user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'user-123' },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'Jane Doe' },
      },
      required: ['_id', 'email', 'name'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created or retrieved',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'user-123' },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'Jane Doe' },
        profileImageUrl: { type: 'string', nullable: true },
      },
    },
  })
  async createUser(@Body() body: { _id: string; email: string; name: string }) {
    return this.usersService.findOrCreate(body._id, body);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'userId', example: 'user-123' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'user-123' },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'Jane Doe' },
        bio: { type: 'string', nullable: true },
        major: { type: 'string', nullable: true },
        graduationYear: { type: 'string', nullable: true },
        profileImageUrl: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateDto);
  }

  @Post(':userId/profile-image')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiParam({ name: 'userId', example: 'user-123' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
      required: ['image'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile image updated',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'user-123' },
        profileImageUrl: { type: 'string', example: '/uploads/profile-images/profile-123.png' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid image upload' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadProfileImage(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const imageUrl = `/uploads/profile-images/${file.filename}`;
    return this.usersService.uploadProfileImage(userId, imageUrl);
  }
}
