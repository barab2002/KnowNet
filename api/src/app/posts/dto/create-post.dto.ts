export class CreatePostDto {
  content: string;
  author: string; // ID of the user
  tags?: string[];
}
