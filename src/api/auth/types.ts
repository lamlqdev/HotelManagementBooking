import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản sử dụng",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
    rememberMe: z.boolean().default(false),
  })
  .required({
    email: true,
    password: true,
  });

export const forgotPasswordEmailSchema = z.object({
  email: z
    .string({ required_error: "auth.forgot_password.error.email_required" })
    .email("auth.forgot_password.error.email_invalid"),
});

export const forgotPasswordOTPSchema = z.object({
  otp: z
    .string({ required_error: "auth.forgot_password.error.otp_required" })
    .min(1, "auth.forgot_password.error.otp_required"),
});

export const forgotPasswordNewPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: "auth.forgot_password.error.password_required",
      })
      .min(6, "auth.forgot_password.error.password_min"),
    confirmPassword: z.string({
      required_error: "auth.forgot_password.error.password_required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.forgot_password.error.password_mismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordEmailFormData = z.infer<
  typeof forgotPasswordEmailSchema
>;
export type ForgotPasswordOTPFormData = z.infer<typeof forgotPasswordOTPSchema>;
export type ForgotPasswordNewPasswordFormData = z.infer<
  typeof forgotPasswordNewPasswordSchema
>;

export interface AuthResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
      isEmailVerified: boolean;
      provider?: string;
    };
  };
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordFormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  response?: {
    status: number;
    data: {
      success: boolean;
      message: string;
    };
  };
}
