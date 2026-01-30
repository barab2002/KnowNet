import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The content of the post',
    example: 'This is a post content about AI.',
  })
  @IsString()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The ID of the user creating the post',
    example: 'user-123',
    required: false, // Optional for now to maintain backward compatibility during migration
  })
  @IsString()
  authorId?: string;
}
