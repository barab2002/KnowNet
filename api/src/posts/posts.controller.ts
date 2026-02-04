import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

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
  async toggleLike(@Param('id') id: string, @Body('userId') userId: string) {
    return this.postsService.toggleLike(id, userId);
  }

  @Post(':id/save')
  @ApiOperation({ summary: 'Toggle save post' })
  async toggleSave(@Param('id') id: string, @Body('userId') userId: string) {
    return this.postsService.toggleSave(id, userId);
  }

  @Post(':id/comment')
  @ApiOperation({ summary: 'Add comment to post' })
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
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new post with optional image' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
    @UploadedFile() image?: any,
  ) {
    // Enforce authorId from token
    createPostDto.authorId = req.user._id;

    // In a real app, upload to S3/Cloudinary here.
    // In a real app, upload to S3/Cloudinary here.
    // For local demo, we'll base64 encode small images or just skip file persistence complexity (recommend using a cloud service for better perf).
    // Let's implement basics: if image exists, we'll pretend we got a URL.
    let imageUrl = '';
    if (image) {
      // Simple base64 for MVP without external storage
      const b64 = Buffer.from(image.buffer).toString('base64');
      imageUrl = `data:${image.mimetype};base64,${b64}`;
    }

    return this.postsService.createWithImage(
      createPostDto,
      imageUrl,
      image ? image.buffer : undefined,
      image ? image.mimetype : undefined,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  findAll() {
    return this.postsService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a post' })
  async delete(@Param('id') id: string, @Req() req) {
    return this.postsService.delete(id, req.user._id);
  }
}
