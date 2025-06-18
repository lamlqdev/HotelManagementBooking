import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { setUser, setCredentials, resetAuth } from "@/features/auth/authSlice";

import { authApi } from "@/api/auth/auth.api";
import LoadingSvg from "@/assets/illustration/Loading.svg";

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

  const { mutate: refreshTokenMutation, isPending: isLoadingRefresh } =
    useMutation({
      mutationFn: () => authApi.refreshToken(),
      onSuccess: async (refreshResponse) => {
        if (refreshResponse.success && refreshResponse.accessToken) {
          try {
            const newUserResponse = await authApi.getMe();
            if (newUserResponse.success) {
              const storedRefreshToken = localStorage.getItem("refreshToken");
              dispatch(
                setCredentials({
                  accessToken: refreshResponse.accessToken,
                  refreshToken:
                    refreshResponse.refreshToken ||
                    (storedRefreshToken as string),
                })
              );
              dispatch(setUser(newUserResponse.data));
              const savedPath = localStorage.getItem("savedPath");
              if (savedPath) {
                localStorage.removeItem("savedPath");
                navigate(savedPath);
              }
            }
          } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
              handleAuthError();
            } else {
              handleAuthError();
            }
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(resetAuth());
    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
    await navigate("/login");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          const userResponse = await authApi.getMe();

          if (userResponse.success) {
            dispatch(
              setCredentials({
                accessToken,
                refreshToken,
              })
            );
            dispatch(setUser(userResponse.data));
          } else {
            await handleAuthError();
          }
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 401) {
            await refreshTokenMutation();
          } else {
            await handleAuthError();
          }
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, navigate, refreshTokenMutation]);

  if (!isInitialized || isLoadingUser || isLoadingRefresh) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <img src={LoadingSvg} alt="Loading" className="w-96 h-96" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
