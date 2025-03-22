import React from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { VerifyEmailNotification } from "@/components/auth/VerifyEmailNotification";

import { authApi } from "@/api/auth/auth.api";
import { registerSchema, RegisterFormData, ApiError } from "@/api/auth/types";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response, variables) => {
      if (response.success) {
        setRegisteredEmail(variables.email);
        setIsVerifyModalOpen(true);
        toast.success(
          response.message ||
            "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
        );
      } else {
        toast.error(response.message);
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Có lỗi xảy ra khi đăng ký");
    },
  });

  const handleGoogleAuth = () => {
    authApi.googleAuth();
  };

  const handleFacebookAuth = () => {
    authApi.facebookAuth();
  };

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1920&auto=format&fit=crop"
            alt="Luxury Resort"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <div className="max-w-[80%] px-8">
              <h1 className="text-3xl font-bold mb-3 text-center text-white">
                {t("auth.register.welcome")}
              </h1>
              <p className="text-lg text-center text-white">
                {t("auth.register.welcomeMessage")}
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
                {t("auth.register.title")}
              </h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-card-foreground"
                  >
                    {t("auth.register.form.fullName.label")}
                  </label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    type="text"
                    className={`border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                    placeholder={t("auth.register.form.fullName.placeholder")}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-card-foreground"
                  >
                    {t("auth.register.form.email.label")}
                  </label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    className={`border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder={t("auth.register.form.email.placeholder")}
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
                    {t("auth.register.form.password.label")}
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className={`pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      placeholder={t("auth.register.form.password.placeholder")}
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
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-card-foreground"
                  >
                    {t("auth.register.form.confirmPassword.label")}
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      className={`pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                      placeholder={t(
                        "auth.register.form.confirmPassword.placeholder"
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 px-3 flex items-center hover:bg-transparent"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <FaEye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  onCheckedChange={(checked) => {
                    setValue("agreeToTerms", checked === true);
                  }}
                  className={`border border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${
                    errors.agreeToTerms ? "border-red-500" : ""
                  }`}
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm text-card-foreground"
                >
                  {t("auth.register.form.terms.prefix")}{" "}
                  <Link
                    to="/terms"
                    className="text-primary hover:text-accent underline"
                  >
                    {t("auth.register.form.terms.termsOfService")}
                  </Link>{" "}
                  {t("auth.register.form.terms.and")}{" "}
                  <Link
                    to="/privacy"
                    className="text-primary hover:text-accent underline"
                  >
                    {t("auth.register.form.terms.privacyPolicy")}
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.agreeToTerms.message}
                </p>
              )}

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? "Đang xử lý..."
                    : t("auth.register.form.submit")}
                </Button>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-input"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">
                      {t("auth.register.divider")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={handleGoogleAuth}
                  >
                    <img
                      src="/src/assets/images/google.svg"
                      alt="Google logo"
                      className="h-5 w-5 mr-2"
                    />
                    {t("auth.register.social.google")}
                  </Button>

                  <Button
                    type="button"
                    className="w-full bg-[#4267B2] hover:bg-[#365899]"
                    onClick={handleFacebookAuth}
                  >
                    <img
                      src="/src/assets/images/facebook.svg"
                      alt="Facebook logo"
                      className="h-5 w-5 mr-2"
                    />
                    {t("auth.register.social.facebook")}
                  </Button>
                </div>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("auth.register.hasAccount")}{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-accent"
              >
                {t("auth.register.login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <VerifyEmailNotification
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        email={registeredEmail}
      />
    </>
  );
};

export default RegisterPage;
