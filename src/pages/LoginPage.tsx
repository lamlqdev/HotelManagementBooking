import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/src/assets/images/cover-auth-page-1.png"
          alt="Resort"
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

      {/* Phần form đăng nhập bên phải */}
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

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.login.form.email.placeholder")}
                  className="border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring"
                />
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder={t("auth.login.form.password.placeholder")}
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
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  className="border border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-card-foreground"
                >
                  {t("auth.login.form.rememberMe")}
                </label>
              </div>
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
              <Button type="submit" className="w-full">
                {t("auth.login.form.submit")}
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
