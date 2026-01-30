import axios from 'axios';

export interface User {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  major?: string;
  graduationYear?: string;
  profileImageUrl?: string;
  joinedDate: string;
  postsCount: number;
  likesReceived: number;
  aiSummariesCount: number;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  bio?: string;
  major?: string;
  graduationYear?: string;
}

const API_URL = '/api/users';

export const getUserProfile = async (userId: string): Promise<User> => {
  const response = await axios.get<User>(`${API_URL}/${userId}`);
  return response.data;
};

export const createUser = async (user: {
  _id: string;
  email: string;
  name: string;
}): Promise<User> => {
  const response = await axios.post<User>(API_URL, user);
  return response.data;
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileDto,
): Promise<User> => {
  const response = await axios.put<User>(`${API_URL}/${userId}`, data);
  return response.data;
};

export const uploadProfileImage = async (
  userId: string,
  image: File,
): Promise<User> => {
  const formData = new FormData();
  formData.append('image', image);
  const response = await axios.post<User>(
    `${API_URL}/${userId}/profile-image`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return response.data;
};
