import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { authApi } from "@/api/auth/auth.api";
import { loginSchema, LoginFormData, ApiError } from "@/api/auth/types";
import { setCredentials, setUser, resetAuth } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { Logo } from "@/components/ui/logo";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    resetOptions: {
      keepValues: true,
      keepErrors: true,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const result = await authApi.login(data.email, data.password);
      return result;
    },
    onSuccess: async (response) => {
      if (response.success && response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        dispatch(
          setCredentials({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken || "",
          })
        );

        try {
          const userResponse = await authApi.getMe();
          if (userResponse.success) {
            // Kiểm tra trạng thái của user
            if (userResponse.data.status !== "active") {
              // Nếu user không active, xóa token và thông báo
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              dispatch(resetAuth());
              toast.error(
                "Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt"
              );
              return;
            }

            dispatch(setUser(userResponse.data));
            toast.success("Đăng nhập thành công");

            // Chuyển hướng dựa trên role
            const role = userResponse.data.role;
            switch (role) {
              case "admin":
                navigate("/admin/partners");
                break;
              case "partner":
                navigate("/partner/hotels/info");
                break;
              case "user":
                navigate("/");
                break;
              default:
                navigate("/");
            }
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user:", error);
          toast.error("Không thể lấy thông tin người dùng");
        }
      } else {
        toast.error(response.message || "Đăng nhập không thành công");
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage || "Có lỗi xảy ra khi đăng nhập");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Hiển thị toast nếu có lỗi từ OAuth hoặc các redirect khác
  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    if (error) {
      setTimeout(() => {
        toast.error(decodeURIComponent(message || "Có lỗi xảy ra"), {
          duration: 6000,
        });
      }, 200);
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=2000&h=1200&fit=crop"
          alt="Tropical Resort"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
          <div className="max-w-[80%] px-8">
            <h1 className="text-3xl font-bold mb-3 text-center text-white">
              {t("auth.login.welcome")}
            </h1>
            <p className="text-lg text-center text-white">
              {t("auth.login.welcomeMessage")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-md border border-border">
          <div className="flex flex-col items-center">
            <Link to="/">
              <Logo className="mb-2 h-24 cursor-pointer" />
            </Link>
            <h2 className="text-2xl font-bold text-card-foreground mb-6">
              {t("auth.login.title")}
            </h2>
          </div>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.login.form.email.label")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder={t("auth.login.form.email.placeholder")}
                          disabled={loginMutation.isPending}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("auth.login.form.password.label")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                            placeholder={t(
                              "auth.login.form.password.placeholder"
                            )}
                            disabled={loginMutation.isPending}
                            autoComplete="current-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center hover:bg-transparent"
                          >
                            {showPassword ? (
                              <FaEyeSlash className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <FaEye className="h-5 w-5 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary hover:text-accent"
                  >
                    {t("auth.login.form.forgotPassword")}
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending
                    ? "Đang đăng nhập..."
                    : t("auth.login.form.submit")}
                </Button>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-input"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">
                      {t("auth.login.divider")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={() => authApi.googleAuth()}
                  >
                    <img
                      src="/src/assets/images/google.svg"
                      alt="Google logo"
                      className="h-5 w-5 mr-2"
                    />
                    {t("auth.login.social.google")}
                  </Button>

                  <Button
                    type="button"
                    className="w-full bg-[#4267B2] hover:bg-[#365899]"
                    onClick={() => authApi.facebookAuth()}
                  >
                    <img
                      src="/src/assets/images/facebook.svg"
                      alt="Facebook logo"
                      className="h-5 w-5 mr-2"
                    />
                    {t("auth.login.social.facebook")}
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-accent"
            >
              {t("auth.login.register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
