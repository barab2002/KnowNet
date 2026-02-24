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
import { FilesInterceptor } from '@nestjs/platform-express';
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

type UploadedImage = {
  buffer: Buffer;
  mimetype: string;
};

const postResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: 'post-123' },
    content: { type: 'string', example: 'Post content' },
    tags: { type: 'array', items: { type: 'string' } },
    userTags: { type: 'array', items: { type: 'string' } },
    aiTags: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string', nullable: true },
    imageUrl: { type: 'string', nullable: true },
    imageUrls: { type: 'array', items: { type: 'string' } },
    authorId: { type: 'string', nullable: true },
    likes: { type: 'array', items: { type: 'string' } },
    savedBy: { type: 'array', items: { type: 'string' } },
    comments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { type: 'string' },
          userName: { type: 'string', nullable: true },
          userProfileImageUrl: { type: 'string', nullable: true },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('tags')
  @ApiOperation({ summary: 'Get all unique tags' })
  @ApiResponse({
    status: 200,
    description: 'Unique tags list',
    schema: { type: 'array', items: { type: 'string' } },
  })
  async getTags() {
    return this.postsService.getUniqueTags();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search posts by text' })
  @ApiResponse({
    status: 200,
    description: 'Matching posts',
    schema: { type: 'array', items: postResponseSchema },
  })
  async search(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return this.postsService.search(query);
  }

  @Post(':id/summarize')
  @ApiOperation({ summary: 'Generate AI summary for post' })
  @ApiResponse({
    status: 200,
    description: 'Post with summary',
    schema: postResponseSchema,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Updated post',
    schema: postResponseSchema,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Updated post',
    schema: postResponseSchema,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Updated post with new comment',
    schema: postResponseSchema,
  })
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

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({
    status: 200,
    description: 'Post comments list',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { type: 'string' },
          userName: { type: 'string', nullable: true },
          userProfileImageUrl: { type: 'string', nullable: true },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getComments(@Param('id') id: string) {
    return this.postsService.getComments(id);
  }

  @Delete(':id/comments/:commentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment from a post' })
  @ApiResponse({
    status: 200,
    description: 'Updated post after comment removal',
    schema: postResponseSchema,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post or comment not found' })
  async deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Req() req,
  ) {
    return this.postsService.removeComment(id, commentId, req.user._id);
  }

  @Post(':id/comments/:commentId/delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment from a post (POST alias)' })
  @ApiResponse({
    status: 200,
    description: 'Updated post after comment removal',
    schema: postResponseSchema,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post or comment not found' })
  async deleteCommentViaPost(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Req() req,
  ) {
    return this.postsService.removeComment(id, commentId, req.user._id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user posts (mocked to all for now)' })
  @ApiResponse({
    status: 200,
    description: 'Posts by user',
    schema: { type: 'array', items: postResponseSchema },
  })
  async getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getPostsByUser(userId);
  }

  @Get('liked/:userId')
  @ApiOperation({ summary: 'Get liked posts by user' })
  @ApiResponse({
    status: 200,
    description: 'Liked posts',
    schema: { type: 'array', items: postResponseSchema },
  })
  async getLikedPosts(@Param('userId') userId: string) {
    return this.postsService.getLikedPosts(userId);
  }

  @Get('saved/:userId')
  @ApiOperation({ summary: 'Get saved posts by user' })
  @ApiResponse({
    status: 200,
    description: 'Saved posts',
    schema: { type: 'array', items: postResponseSchema },
  })
  async getSavedPosts(@Param('userId') userId: string) {
    return this.postsService.getSavedPosts(userId);
  }

  @Get('user/:userId/total-likes')
  @ApiOperation({ summary: 'Get total likes received by user' })
  @ApiResponse({
    status: 200,
    description: 'Total likes count',
    schema: {
      type: 'object',
      properties: {
        totalLikes: { type: 'number', example: 42 },
      },
    },
  })
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
    schema: postResponseSchema,
  })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
    @UploadedFiles() images?: UploadedImage[],
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
  @ApiResponse({
    status: 200,
    description: 'Return all posts.',
    schema: {
      type: 'object',
      properties: {
        posts: { type: 'array', items: postResponseSchema },
        total: { type: 'number', example: 100 },
      },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'Updated post',
    schema: postResponseSchema,
  })
  async updateContent(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @Req() req,
    @UploadedFiles() images?: UploadedImage[],
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
  @ApiResponse({
    status: 200,
    description: 'Post deleted',
    schema: { type: 'object', properties: {} },
  })
  async delete(@Param('id') id: string, @Req() req) {
    return this.postsService.delete(id, req.user._id);
  }
}
