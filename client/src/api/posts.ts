import axios from 'axios';

export interface Post {
  _id: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  summary?: string;
  authorId?: string | { _id: string; name: string; profileImageUrl?: string }; // ID or Populated User Object
  likes: string[];
  userTags?: string[];
  aiTags?: string[];
  savedBy: string[];
  comments: {
    userId: string;
    content: string;
    createdAt: string;
  }[];
}

export interface CreatePostDto {
  content: string;
  authorId?: string;
}

// In development, Vite will proxy /api to http://localhost:3000
// In production (Docker/Nginx), Nginx will proxy /api to http://api:3000
const API_URL = '/api/posts';

export const getPosts = async (
  limit: number = 10,
  skip: number = 0,
): Promise<{ posts: Post[]; total: number }> => {
  const response = await axios.get<{ posts: Post[]; total: number }>(API_URL, {
    params: { limit, skip },
  });
  return response.data;
};

export const createPost = async (
  data: CreatePostDto,
  image?: File,
): Promise<Post> => {
  if (image) {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.authorId) {
      formData.append('authorId', data.authorId);
    }
    formData.append('image', image);
    const response = await axios.post<Post>(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
  const response = await axios.post<Post>(API_URL, data);
  return response.data;
};

export const toggleLike = async (
  postId: string,
  userId: string = 'current-user-id',
): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}/${postId}/like`, {
    userId,
  });
  return response.data;
};

export const toggleSave = async (
  postId: string,
  userId: string = 'current-user-id',
): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}/${postId}/save`, {
    userId,
  });
  return response.data;
};

export const addComment = async (
  postId: string,
  content: string,
  userId: string = 'current-user-id',
): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}/${postId}/comment`, {
    userId,
    content,
  });
  return response.data;
};

export const getMyPosts = async (
  userId: string = 'current-user-id',
): Promise<Post[]> => {
  const response = await axios.get<Post[]>(`${API_URL}/user/${userId}`);
  return response.data;
};

export const getLikedPosts = async (
  userId: string = 'current-user-id',
): Promise<Post[]> => {
  const response = await axios.get<Post[]>(`${API_URL}/liked/${userId}`);
  return response.data;
};

export const getSavedPosts = async (
  userId: string = 'current-user-id',
): Promise<Post[]> => {
  const response = await axios.get<Post[]>(`${API_URL}/saved/${userId}`);
  return response.data;
};

export const getTotalLikesForUser = async (userId: string): Promise<number> => {
  const response = await axios.get<{ totalLikes: number }>(
    `${API_URL}/user/${userId}/total-likes`,
  );
  return response.data.totalLikes;
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  const response = await axios.get<Post[]>(`${API_URL}/search`, {
    params: { q: query },
  });
  return response.data;
};

export const summarizePost = async (postId: string): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}/${postId}/summarize`);
  return response.data;
};

export const deletePost = async (
  postId: string,
  userId: string, // Kept for interface compatibility but unused in payload
): Promise<void> => {
  await axios.delete(`${API_URL}/${postId}`);
};
