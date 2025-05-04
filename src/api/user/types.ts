import { User } from "@/types/auth";
import { z } from "zod";

export interface UploadAvatarResponse {
  success: boolean;
  data: {
    avatar: string;
  };
}

export interface UpdateMeRequest {
  name: string;
  phone: string;
}

export const updateMeSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được vượt quá 50 ký tự"),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
});

export type UpdateMeFormData = z.infer<typeof updateMeSchema>;

export interface UpdateMeResponse {
  success: boolean;
  data: User;
}

export interface GetUsersParams {
  search?: string;
  role?: string;
  isEmailVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  previousPage?: number;
  nextPage?: number;
}

export interface GetUsersResponse {
  success: boolean;
  count: number;
  pagination: PaginationInfo;
  data: User[];
}

export interface GetUserResponse {
  success: boolean;
  data: User;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isEmailVerified?: boolean;
  active?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface UserStats {
  total: number;
  roles: Record<string, number>;
  emailVerification: {
    verified: number;
    unverified: number;
  };
  inactive: number;
  newUsers: Array<{
    year: number;
    month: number;
    count: number;
  }>;
}

export interface GetUserStatsResponse {
  success: boolean;
  data: UserStats;
}

export interface DeactivateUserRequest {
  reason: string;
}

export interface DeactivateUserResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    status: string;
    deactivationReason: string;
    deactivatedAt: number;
  };
}

export interface ActivateUserResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    status: string;
  };
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export interface DeactivateAccountRequest {
  password: string;
  reason?: string;
}

export interface DeactivateAccountResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    status: string;
    deactivationReason?: string;
    deactivatedAt?: Date;
  };
}
