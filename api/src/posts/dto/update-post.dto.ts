import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Updated text content of the post',
    example: 'Updated post content with new insights.',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  content?: string;
}
