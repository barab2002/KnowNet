import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @ApiPropertyOptional({
    description: 'Remove the existing image from the post',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  removeImage?: boolean;

  @ApiPropertyOptional({
    description: 'List of image URLs to remove from the post',
    example: ['data:image/png;base64,abc123'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  removeImageUrls?: string[];
}
