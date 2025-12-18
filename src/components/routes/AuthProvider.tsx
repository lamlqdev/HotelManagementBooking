import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";

import { useAppDispatch } from "@/store/hooks";
import { setUser, resetAuth } from "@/features/auth/authSlice";

import { authApi } from "@/api/auth/auth.api";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => authApi.getMe(),
    enabled: false,
    retry: false,
  });

  const { isPending: isLoadingRefresh } = useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: async (refreshResponse) => {
      if (refreshResponse.success && refreshResponse.accessToken) {
        try {
          const newUserResponse = await authApi.getMe();
          if (newUserResponse.success) {
            dispatch(setUser(newUserResponse.data));
            const savedPath = localStorage.getItem("savedPath");
            if (savedPath) {
              localStorage.removeItem("savedPath");
              navigate(savedPath);
            }
          }
        } catch (error) {
          console.error("Lỗi khi refresh token:", error);
          handleAuthError();
        }
      } else {
        handleAuthError();
      }
    },
    onError: () => {
      handleAuthError();
    },
  });

  const handleAuthError = async () => {
    localStorage.setItem("savedPath", location.pathname);
    dispatch(resetAuth());
    // toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
    // await navigate("/login");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userResponse = await authApi.getMe();

        if (userResponse.success) {
          dispatch(setUser(userResponse.data));
        } else {
          handleAuthError();
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          handleAuthError();
        } else {
          setIsInitialized(true);
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  if (!isInitialized || isLoadingUser || isLoadingRefresh) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <svg
              className="w-12 h-12 animate-spin text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-30"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
          <p className="text-base font-medium text-muted-foreground animate-pulse">
            Đang tải dữ liệu ...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
