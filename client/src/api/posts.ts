import axios from 'axios';

export interface Post {
  _id: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  content: string;
}

// In development, Vite will proxy /api to http://localhost:3000
// In production (Docker/Nginx), Nginx will proxy /api to http://api:3000
const API_URL = '/api/posts';

export const getPosts = async (): Promise<Post[]> => {
  const response = await axios.get<Post[]>(API_URL);
  return response.data;
};

export const createPost = async (data: CreatePostDto): Promise<Post> => {
  const response = await axios.post<Post>(API_URL, data);
  return response.data;
};
