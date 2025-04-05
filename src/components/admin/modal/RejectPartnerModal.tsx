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
import { Checkbox } from "@/components/ui/checkbox";
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
  onRejectReasonsChange: (reasons: RejectReasons) => void;
  rejectDetails: string;
  onRejectDetailsChange: (details: string) => void;
}

const RejectPartnerModal = ({
  open,
  onOpenChange,
  onReject,
  rejectReasons,
  onRejectReasonsChange,
  rejectDetails,
  onRejectDetailsChange,
}: RejectPartnerModalProps) => {
  const { t } = useTranslation();

  const handleReject = () => {
    onReject(rejectReasons, rejectDetails);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("admin.partners.approval.details.modal.reject.title")}
          </DialogTitle>
          <DialogDescription>
            {t("admin.partners.approval.details.modal.reject.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              {t("admin.partners.approval.details.modal.reject.reasons.title")}
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="incomplete"
                  checked={rejectReasons.incomplete}
                  onCheckedChange={(checked) =>
                    onRejectReasonsChange({
                      ...rejectReasons,
                      incomplete: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="incomplete">
                  {t(
                    "admin.partners.approval.details.modal.reject.reasons.incomplete"
                  )}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="invalid"
                  checked={rejectReasons.invalid}
                  onCheckedChange={(checked) =>
                    onRejectReasonsChange({
                      ...rejectReasons,
                      invalid: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="invalid">
                  {t(
                    "admin.partners.approval.details.modal.reject.reasons.invalid"
                  )}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="duplicate"
                  checked={rejectReasons.duplicate}
                  onCheckedChange={(checked) =>
                    onRejectReasonsChange({
                      ...rejectReasons,
                      duplicate: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="duplicate">
                  {t(
                    "admin.partners.approval.details.modal.reject.reasons.duplicate"
                  )}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={rejectReasons.other}
                  onCheckedChange={(checked) =>
                    onRejectReasonsChange({
                      ...rejectReasons,
                      other: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="other">
                  {t(
                    "admin.partners.approval.details.modal.reject.reasons.other"
                  )}
                </Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              {t("admin.partners.approval.details.modal.reject.details.title")}
            </Label>
            <Textarea
              placeholder={t(
                "admin.partners.approval.details.modal.reject.details.placeholder"
              )}
              value={rejectDetails}
              onChange={(e) => onRejectDetailsChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("admin.partners.approval.details.modal.reject.cancel")}
          </Button>
          <Button
            onClick={handleReject}
            disabled={
              !Object.values(rejectReasons).some(Boolean) || !rejectDetails
            }
          >
            {t("admin.partners.approval.details.modal.reject.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectPartnerModal;
