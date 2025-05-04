import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/api/user/user.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function DeactivateAccountModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");

  const { mutate: deactivateAccount, isPending } = useMutation({
    mutationFn: userApi.deactivateAccount,
    onSuccess: () => {
      toast.success(t("settings.deactivateAccount.success"));
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("common.error"));
      } else {
        toast.error(t("common.error"));
      }
    },
  });

  const handleDeactivate = () => {
    if (!password) {
      toast.error(t("settings.deactivateAccount.passwordRequired"));
      return;
    }

    deactivateAccount({
      password,
      reason: reason || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          {t("settings.deactivateAccount.title")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("settings.deactivateAccount.title")}</DialogTitle>
          <DialogDescription>
            {t("settings.deactivateAccount.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">
              {t("settings.deactivateAccount.password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("settings.deactivateAccount.passwordPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              {t("settings.deactivateAccount.reason")} ({t("common.optional")})
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("settings.deactivateAccount.reasonPlaceholder")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeactivate}
            disabled={isPending}
          >
            {isPending
              ? t("common.processing")
              : t("settings.deactivateAccount.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
