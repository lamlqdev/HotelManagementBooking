import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { authApi } from "@/api/auth/auth.api";
import { loginSchema, LoginFormData, ApiError } from "@/api/auth/types";
import { setCredentials, setUser } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
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
            dispatch(setUser(userResponse.data));
            toast.success("Đăng nhập thành công");
            navigate("/");
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit((data) => {
      if (!isSubmitting) {
        loginMutation.mutate(data);
      }
    })(e);
  };

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
            <img
              src="/src/assets/images/logo.png"
              alt="BookIt Logo"
              className="mb-2 h-24"
            />
            <h2 className="text-2xl font-bold text-card-foreground mb-6">
              {t("auth.login.title")}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-card-foreground"
                >
                  {t("auth.login.form.email.label")}
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={loginMutation.isPending || isSubmitting}
                  placeholder={t("auth.login.form.email.placeholder")}
                  className={`border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-card-foreground"
                >
                  {t("auth.login.form.password.label")}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    disabled={loginMutation.isPending || isSubmitting}
                    className={`pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder={t("auth.login.form.password.placeholder")}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={loginMutation.isPending || isSubmitting}
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
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
                disabled={loginMutation.isPending || isSubmitting}
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
                <Button variant="outline" type="button" className="w-full">
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
