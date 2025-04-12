import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  ForgotPasswordEmailFormData,
  ForgotPasswordOTPFormData,
  ForgotPasswordNewPasswordFormData,
  forgotPasswordEmailSchema,
  forgotPasswordOTPSchema,
  forgotPasswordNewPasswordSchema,
  ApiError,
} from "@/api/auth/types";
import { authApi } from "@/api/auth/auth.api";

type Step = "email" | "otp" | "password";

const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const sendOTPMutation = useMutation({
    mutationFn: (email: string) => authApi.sendOTP(email),
    onSuccess: () => {
      toast.success(t("auth.forgot_password.success.otp_sent"));
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t("auth.forgot_password.error.unknown"));
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authApi.verifyOTP(email, otp),
    onSuccess: () => {
      toast.success(t("auth.forgot_password.success.otp_verified"));
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t("auth.forgot_password.error.unknown"));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({
      email,
      otp,
      password,
    }: {
      email: string;
      otp: string;
      password: string;
    }) => authApi.resetPassword(email, otp, password),
    onSuccess: () => {
      toast.success(t("auth.forgot_password.success.password_reset"));
      navigate("/login");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t("auth.forgot_password.error.unknown"));
    },
  });

  const emailForm = useForm<ForgotPasswordEmailFormData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<ForgotPasswordOTPFormData>({
    resolver: zodResolver(forgotPasswordOTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  const passwordForm = useForm<ForgotPasswordNewPasswordFormData>({
    resolver: zodResolver(forgotPasswordNewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onEmailSubmit = async (data: ForgotPasswordEmailFormData) => {
    await sendOTPMutation.mutateAsync(data.email);
    setEmail(data.email);
    setStep("otp");
  };

  const onOTPSubmit = async (data: ForgotPasswordOTPFormData) => {
    await verifyOTPMutation.mutateAsync({ email, otp: data.otp });
    setStep("password");
  };

  const onPasswordSubmit = async (data: ForgotPasswordNewPasswordFormData) => {
    await resetPasswordMutation.mutateAsync({
      email,
      otp: otpForm.getValues("otp"),
      password: data.password,
    });
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{t("auth.forgot_password.title")}</CardTitle>
        <CardDescription>
          {step === "email" && t("auth.forgot_password.description")}
          {step === "otp" && t("auth.forgot_password.otp_description")}
          {step === "password" && t("auth.forgot_password.reset_password")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.forgot_password.email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "auth.forgot_password.email_placeholder"
                        )}
                        type="email"
                        autoComplete="email"
                        disabled={sendOTPMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={sendOTPMutation.isPending}
              >
                {sendOTPMutation.isPending
                  ? t("auth.forgot_password.sending")
                  : t("auth.forgot_password.send_otp")}
              </Button>
            </form>
          </Form>
        )}

        {step === "otp" && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOTPSubmit)}
              className="space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.forgot_password.otp")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("auth.forgot_password.otp_placeholder")}
                        type="text"
                        maxLength={6}
                        autoComplete="one-time-code"
                        disabled={verifyOTPMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={verifyOTPMutation.isPending}
              >
                {verifyOTPMutation.isPending
                  ? t("auth.forgot_password.verifying")
                  : t("auth.forgot_password.verify")}
              </Button>
            </form>
          </Form>
        )}

        {step === "password" && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("auth.forgot_password.new_password")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t(
                          "auth.forgot_password.new_password_placeholder"
                        )}
                        autoComplete="new-password"
                        disabled={resetPasswordMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("auth.forgot_password.confirm_password")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t(
                          "auth.forgot_password.confirm_password_placeholder"
                        )}
                        autoComplete="new-password"
                        disabled={resetPasswordMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending
                  ? t("auth.forgot_password.submitting")
                  : t("auth.forgot_password.submit")}
              </Button>
            </form>
          </Form>
        )}

        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="text-primary hover:text-primary/90"
            onClick={() => (window.location.href = "/login")}
          >
            {t("auth.forgot_password.back_to_login")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
