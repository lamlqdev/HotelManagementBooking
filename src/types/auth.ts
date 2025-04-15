export interface AvatarData {
  url: string;
  publicId: string;
  filename: string;
  _id: string;
  id: string;
}

export interface Document {
  url: string;
  publicId: string;
  filename: string;
  type: string;
  _id: string;
  id: string;
}

export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: AvatarData[];
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  defaultAvatar: string;
  partnerInfo?: {
    documents: Document[];
  };
  status: string;
  favoriteHotels: string[];
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

export interface UploadAvatarResponse {
  success: boolean;
  data: {
    avatar: AvatarData[];
  };
}
