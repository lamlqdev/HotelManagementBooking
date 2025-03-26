import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "auth.register.form.error.name")
      .max(50, "auth.register.form.error.name"),
    email: z
      .string()
      .email("auth.register.form.error.email")
      .max(100, "auth.register.form.error.email"),
    password: z
      .string()
      .min(6, "auth.register.form.error.min")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
        "auth.register.form.error.format"
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "auth.register.form.error.required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.register.form.error.mismatch",
    path: ["confirmPassword"],
  });

export const loginSchema = z
  .object({
    email: z.string().email("auth.login.form.error.email"),
    password: z.string().min(1, "auth.login.form.error.password"),
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
