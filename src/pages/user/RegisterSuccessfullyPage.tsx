import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Clock, Home } from "lucide-react";

const RegisterSuccessfullyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20 mt-20">
      <div className="w-full max-w-2xl space-y-8 text-center bg-card rounded-xl shadow-lg p-8 border border-border/50">
        <div className="flex justify-center mb-6">
          <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
            <img
              src="/images/email-verification.svg"
              alt="Email verification"
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {t("register_success.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("register_success.subtitle")}
          </p>
        </div>

        <div className="space-y-6 bg-muted/30 p-6 rounded-lg mt-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-lg">
                {t("register_success.email_verification")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("register_success.email_verification_desc")}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-lg">
                {t("register_success.admin_approval")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("register_success.admin_approval_desc")}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-lg">
                {t("register_success.result")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("register_success.result_desc")}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Button asChild className="w-full sm:w-auto px-6 py-6 text-base">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              {t("register_success.back_to_home")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccessfullyPage;
