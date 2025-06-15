export interface AvatarData {
  url: string;
  publicId: string;
  filename: string;
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
  phone?: string;
  avatar: AvatarData;
  role: "user" | "partner" | "admin";
  status: "pending" | "active" | "rejected";
  isEmailVerified: boolean;
  provider: "local" | "google" | "facebook";
  address?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: string;
  refreshToken?: string;
  verificationToken?: string;
  verificationTokenExpire?: string;
  favoriteHotels: string[];
  tier: "Bronze" | "Silver" | "Gold";
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

export interface UploadAvatarResponse {
  success: boolean;
  data: {
    avatar: AvatarData[];
  };
}

export interface UserTierResponse {
  success: boolean;
  data: {
    tier: "Bronze" | "Silver" | "Gold";
    totalAmount: number;
  };
}
