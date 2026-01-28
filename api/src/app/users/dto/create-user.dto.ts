import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'URL to avatar image', required: false })
  avatarUrl?: string;

  @ApiProperty({ example: 'I am a software engineer', description: 'Short bio', required: false })
  bio?: string;
}
