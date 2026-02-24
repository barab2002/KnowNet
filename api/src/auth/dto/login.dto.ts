import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'student@college.edu' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'P@ssw0rd123' })
  password: string;
}
