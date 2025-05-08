import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectReasons {
  incomplete: boolean;
  invalid: boolean;
  duplicate: boolean;
  other: boolean;
}

interface RejectPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reasons: RejectReasons, details: string) => void;
  rejectReasons: RejectReasons;
  rejectDetails: string;
  onRejectDetailsChange: (details: string) => void;
  isLoading?: boolean;
}

const RejectPartnerModal = ({
  open,
  onOpenChange,
  onReject,
  rejectReasons,
  rejectDetails,
  onRejectDetailsChange,
  isLoading = false,
}: RejectPartnerModalProps) => {
  const { t } = useTranslation();

  const handleSubmit = () => {
    onReject(rejectReasons, rejectDetails);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("admin.partners.approval.modal.reject.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("admin.partners.approval.modal.reject.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>
              {t("admin.partners.approval.modal.reject.details.title")}
            </Label>
            <Textarea
              placeholder={t(
                "admin.partners.approval.modal.reject.details.placeholder"
              )}
              value={rejectDetails}
              onChange={(e) => onRejectDetailsChange(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                {t("common.rejecting")}
              </div>
            ) : (
              t("common.reject")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectPartnerModal;
