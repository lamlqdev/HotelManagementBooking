import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/auth";
import { AxiosError } from "axios";
import { AuthState } from "./types";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Reset state
      dispatch(resetAuth());

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Chi tiết lỗi khi logout:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      } else {
        console.error("Lỗi không xác định:", error);
      }
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setCredentials, setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
