import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApprovePartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
}

const ApprovePartnerModal = ({
  open,
  onOpenChange,
  onApprove,
}: ApprovePartnerModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("admin.partners.approval.details.modal.approve.title")}
          </DialogTitle>
          <DialogDescription>
            {t("admin.partners.approval.details.modal.approve.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("admin.partners.approval.details.modal.approve.cancel")}
          </Button>
          <Button onClick={onApprove}>
            {t("admin.partners.approval.details.modal.approve.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovePartnerModal;
