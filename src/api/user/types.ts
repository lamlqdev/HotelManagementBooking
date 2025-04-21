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
