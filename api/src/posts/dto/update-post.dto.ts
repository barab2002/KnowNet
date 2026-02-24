import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Updated text content of the post',
    example: 'Updated post content with new insights.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
