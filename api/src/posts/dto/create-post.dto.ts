import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The content of the post',
    example: 'This is a post content about AI.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
