export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
}
