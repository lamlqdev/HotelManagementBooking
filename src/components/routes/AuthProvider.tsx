import { useEffect } from "react";
import { useNavigate } from "react-router";

import { AxiosError } from "axios";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { setUser, setCredentials, resetAuth } from "@/features/auth/authSlice";

import { authApi } from "@/api/auth/auth.api";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          // Thử lấy thông tin user trước
          const userResponse = await authApi.getMe();
          if (userResponse.success) {
            // Nếu lấy được thông tin user, mới set credentials và user
            dispatch(
              setCredentials({
                accessToken,
                refreshToken,
              })
            );
            dispatch(setUser(userResponse.data));
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            // Nếu lỗi 401, thử refresh token
            if (error.response?.status === 401) {
              try {
                const refreshResponse = await authApi.refreshToken();
                if (refreshResponse.success && refreshResponse.accessToken) {
                  // Nếu refresh thành công, thử lấy thông tin user lại
                  const newUserResponse = await authApi.getMe();
                  if (newUserResponse.success) {
                    dispatch(
                      setCredentials({
                        accessToken: refreshResponse.accessToken,
                        refreshToken:
                          refreshResponse.refreshToken || refreshToken,
                      })
                    );
                    dispatch(setUser(newUserResponse.data));
                    return;
                  }
                }
              } catch (refreshError) {
                console.error("Lỗi khi refresh token:", refreshError);
              }
            }
          }

          // Nếu tất cả các cách khôi phục phiên đăng nhập đều thất bại
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          dispatch(resetAuth());
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
          navigate("/login");
        }
      }
    };

    initializeAuth();
  }, [dispatch, navigate]);

  return <>{children}</>;
};

export default AuthProvider;
