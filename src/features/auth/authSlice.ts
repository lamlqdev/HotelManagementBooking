import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/auth";
import { AxiosError } from "axios";
import { AuthState } from "./types";
import { clearCurrentHotel } from "../hotel/hotelSlice";
import { queryClient } from "@/lib/react-query";
import { authApi } from "@/api/auth/auth.api";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await authApi.logout();

      dispatch(resetAuth());
      dispatch(clearCurrentHotel());
      queryClient.clear();

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
      dispatch(resetAuth());
      dispatch(clearCurrentHotel());
      queryClient.clear();
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
      state.isAuthenticated = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
