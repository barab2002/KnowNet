import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('tags')
  @ApiOperation({ summary: 'Get all unique tags' })
  async getTags() {
    return this.postsService.getUniqueTags();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search posts by text' })
  async search(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return this.postsService.search(query);
  }

  @Post(':id/summarize')
  @ApiOperation({ summary: 'Generate AI summary for post' })
  async summarize(@Param('id') id: string) {
    try {
      return await this.postsService.summarizePost(id);
    } catch (error) {
      // Re-throw with proper HTTP status
      throw error;
    }
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Toggle like on post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string', example: 'user-123' } },
      required: ['userId'],
    },
  })
  async toggleLike(@Param('id') id: string, @Body('userId') userId: string) {
    return this.postsService.toggleLike(id, userId);
  }

  @Post(':id/save')
  @ApiOperation({ summary: 'Toggle save post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string', example: 'user-123' } },
      required: ['userId'],
    },
  })
  async toggleSave(@Param('id') id: string, @Body('userId') userId: string) {
    return this.postsService.toggleSave(id, userId);
  }

  @Post(':id/comment')
  @ApiOperation({ summary: 'Add comment to post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user-123' },
        content: { type: 'string', example: 'Great post!' },
      },
      required: ['userId', 'content'],
    },
  })
  async addComment(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Body('content') content: string,
  ) {
    return this.postsService.addComment(id, userId, content);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user posts (mocked to all for now)' })
  async getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getPostsByUser(userId);
  }

  @Get('liked/:userId')
  @ApiOperation({ summary: 'Get liked posts by user' })
  async getLikedPosts(@Param('userId') userId: string) {
    return this.postsService.getLikedPosts(userId);
  }

  @Get('saved/:userId')
  @ApiOperation({ summary: 'Get saved posts by user' })
  async getSavedPosts(@Param('userId') userId: string) {
    return this.postsService.getSavedPosts(userId);
  }

  @Get('user/:userId/total-likes')
  @ApiOperation({ summary: 'Get total likes received by user' })
  async getTotalLikes(@Param('userId') userId: string) {
    return { totalLikes: await this.postsService.getTotalLikesForUser(userId) };
  }

  @Post()
  @UseGuards(AuthGuard('jwt')) // Enforce login for posting
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Create a new post with optional images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'Post content' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    // Enforce authorId from token
    createPostDto.authorId = req.user._id;

    const files = images?.length
      ? images.map((image) => ({ buffer: image.buffer, mimetype: image.mimetype }))
      : undefined;

    return this.postsService.createWithImage(createPostDto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  async findAll(
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    return this.postsService.findAll(Number(limit), Number(skip));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post text or image (author only)' })
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'Updated post content' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
        removeImage: { type: 'boolean', example: true },
        removeImageUrls: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async updateContent(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @Req() req,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    const files = images?.length
      ? images.map((image) => ({ buffer: image.buffer, mimetype: image.mimetype }))
      : undefined;
    const removeImageUrls = this.normalizeRemoveImageUrls(body.removeImageUrls);
    return this.postsService.updatePostContent(
      id,
      req.user._id,
      body.content,
      files,
      removeImageUrls,
      body.removeImage,
    );
  }

  private normalizeRemoveImageUrls(input?: string[] | string): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return input
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    }
    return [];
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  async delete(@Param('id') id: string, @Req() req) {
    return this.postsService.delete(id, req.user._id);
  }
}
