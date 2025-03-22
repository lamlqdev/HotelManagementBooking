import axios from "axios";
import { RegisterFormData, AuthResponse } from "./types";

const API_URL = "http://localhost:3000/api/auth";

export const authApi = {
  // Đăng ký tài khoản
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/register`, {
      name: data.fullName,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  // Xác thực email
  verifyEmail: async (token: string): Promise<AuthResponse> => {
    const response = await axios.get(`${API_URL}/verify-email/${token}`);
    return response.data;
  },

  // Đăng nhập
  login: async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  },

  // Lấy thông tin user
  getMe: async (): Promise<AuthResponse> => {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  },

  // Đăng xuất
  logout: async (): Promise<AuthResponse> => {
    const response = await axios.get(`${API_URL}/logout`);
    return response.data;
  },

  // Gửi OTP để reset password
  sendOTP: async (email: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  // Xác thực OTP
  verifyOTP: async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return response.data;
  },

  // Reset password
  resetPassword: async (
    email: string,
    otp: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/reset-password`, {
      email,
      otp,
      password,
    });
    return response.data;
  },

  // Đăng nhập với Google
  googleAuth: () => {
    window.location.href = `${API_URL}/google`;
  },

  // Đăng nhập với Facebook
  facebookAuth: () => {
    window.location.href = `${API_URL}/facebook`;
  },
};
