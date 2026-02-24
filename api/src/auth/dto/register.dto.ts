import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'student@college.edu' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'P@ssw0rd123' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Jordan Smith', required: false })
  name?: string;
}
