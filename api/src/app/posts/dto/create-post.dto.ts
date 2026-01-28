import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'This is a great post', description: 'The content of the post' })
  content: string;

  @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'ID of the user author' })
  author: string; // ID of the user

  @ApiProperty({ example: ['tech', 'news'], description: 'Tags for the post', required: false })
  tags?: string[];
}
