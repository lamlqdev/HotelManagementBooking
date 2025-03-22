import axios from "axios";
import { RegisterFormData, AuthResponse } from "./types";

const API_URL = "http://localhost:3000/api/auth";

export const authApi = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/register`, {
      name: data.fullName,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  verifyEmail: async (token: string): Promise<AuthResponse> => {
    const response = await axios.get(`${API_URL}/verify-email/${token}`);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  },

  googleAuth: () => {
    window.location.href = `${API_URL}/google`;
  },

  facebookAuth: () => {
    window.location.href = `${API_URL}/facebook`;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_URL}/logout`);
    localStorage.removeItem("accessToken");
  },

  // Refresh token
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await axios.post(`${API_URL}/refresh-token`);
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return response.data;
  },

  // Reset password request
  requestPasswordReset: async (email: string): Promise<void> => {
    await axios.post(`${API_URL}/forgot-password`, { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await axios.post(`${API_URL}/reset-password/${token}`, {
      password: newPassword,
    });
  },
};
