import React from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VerifyEmailNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const VerifyEmailNotification: React.FC<
  VerifyEmailNotificationProps
> = ({ isOpen, onClose, email }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-6">
            {t("auth.verify_email.notification.title")}
          </DialogTitle>
          <DialogDescription className="text-center space-y-4">
            <p>{t("auth.verify_email.notification.sent_to")}</p>
            <p className="font-medium text-primary">{email}</p>
            <p className="mt-6">
              {t("auth.verify_email.notification.instruction")}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-8">
          <Button type="button" onClick={handleClose} className="w-full">
            {t("auth.verify_email.notification.understand_button")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
