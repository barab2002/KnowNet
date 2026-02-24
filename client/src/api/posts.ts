import axios from 'axios';

export interface Post {
  _id: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  imageUrls?: string[];
  summary?: string;
  authorId?: string | { _id: string; name: string; profileImageUrl?: string }; // ID or Populated User Object
  likes: string[];
  userTags?: string[];
  aiTags?: string[];
  savedBy: string[];
  comments: {
    _id?: string;
    userId: string;
    userName?: string;
    userProfileImageUrl?: string;
    content: string;
    createdAt: string;
  }[];
}

export interface CreatePostDto {
  content: string;
  authorId?: string;
  tagModel?: string;
}

export interface UpdatePostDto {
  content?: string;
  removeImage?: boolean;
  removeImageUrls?: string[];
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
  images?: File[],
): Promise<Post> => {
  if (images && images.length > 0) {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.authorId) {
      formData.append('authorId', data.authorId);
    }
    if (data.tagModel) {
      formData.append('tagModel', data.tagModel);
    }
    images.forEach((image) => formData.append('images', image));
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

export const getComments = async (
  postId: string,
): Promise<Post['comments']> => {
  const response = await axios.get<Post['comments']>(
    `${API_URL}/${postId}/comments`,
  );
  return response.data;
};

export const deleteComment = async (
  postId: string,
  commentId: string,
  token?: string | null,
): Promise<Post> => {
  const rawToken =
    token ||
    (axios.defaults.headers.common?.Authorization as string | undefined);
  const authHeader = rawToken
    ? rawToken.startsWith('Bearer ')
      ? rawToken
      : `Bearer ${rawToken}`
    : undefined;
  const response = await axios.post<Post>(
    `${API_URL}/${postId}/comments/${commentId}/delete`,
    {},
    {
      headers: authHeader ? { Authorization: authHeader } : undefined,
    },
  );
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

export interface SearchResultPost extends Post {
  matchedTags: string[];
  matchSnippet?: string;
}

export interface SearchResponse {
  expandedTags: string[];
  queryWords: string[];
  results: SearchResultPost[];
}

export const searchPosts = async (query: string): Promise<SearchResponse> => {
  const response = await axios.get<SearchResponse>(`${API_URL}/search`, {
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

export const updatePost = async (
  postId: string,
  data: UpdatePostDto,
  images?: File[],
  token?: string | null,
): Promise<Post> => {
  const rawToken =
    token ||
    (axios.defaults.headers.common?.Authorization as string | undefined);
  const authHeader = rawToken
    ? rawToken.startsWith('Bearer ')
      ? rawToken
      : `Bearer ${rawToken}`
    : undefined;
  if ((images && images.length > 0) || data.removeImageUrls?.length) {
    const formData = new FormData();
    if (data.content) {
      formData.append('content', data.content);
    }
    if (data.removeImage) {
      formData.append('removeImage', 'true');
    }
    if (data.removeImageUrls?.length) {
      data.removeImageUrls.forEach((url) =>
        formData.append('removeImageUrls', url),
      );
    }
    if (images && images.length > 0) {
      images.forEach((image) => formData.append('images', image));
    }
    const response = await axios.patch<Post>(`${API_URL}/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });
    return response.data;
  }

  const response = await axios.patch<Post>(`${API_URL}/${postId}`, data, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });
  return response.data;
};
