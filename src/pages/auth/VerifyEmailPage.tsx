import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { authApi } from "@/api/auth/auth.api";
import { ApiError } from "@/api/auth/types";

let isVerifying = false;

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  const verifyMutation = useMutation({
    mutationFn: (verificationToken: string) =>
      authApi.verifyEmail(verificationToken),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(t("auth.verify_email.page.success"));
        navigate("/login");
      } else {
        toast.error(response.message);
        navigate("/register");
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage || t("auth.verify_email.page.error"));
      navigate("/register");
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/register");
      return;
    }

    if (!isVerifying) {
      isVerifying = true;
      verifyMutation.mutate(token);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-md text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {t("auth.verify_email.page.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("auth.verify_email.page.loading")}
        </p>
      </div>
    </div>
  );
};
export default VerifyEmailPage;
