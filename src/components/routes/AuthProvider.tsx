import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { authApi } from "@/api/auth/auth.api";
import { setUser, setCredentials } from "@/features/auth/authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        dispatch(
          setCredentials({
            accessToken,
            refreshToken,
          })
        );

        try {
          const userResponse = await authApi.getMe();
          if (userResponse.success) {
            dispatch(setUser(userResponse.data));
          }
        } catch (error) {
          console.error("Lỗi khi khởi tạo thông tin người dùng:", error);
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
