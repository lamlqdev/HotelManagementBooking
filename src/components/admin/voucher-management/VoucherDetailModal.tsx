import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Percent, Tag, Clock } from "lucide-react";
import { Voucher } from "@/types/voucher";
import { useTranslation } from "react-i18next";

interface VoucherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher;
}

export default function VoucherDetailModal({
  isOpen,
  onClose,
  voucher,
}: VoucherDetailModalProps) {
  const { t } = useTranslation();
  if (!voucher) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-xl p-0 overflow-hidden">
        <DialogHeader className="bg-primary text-primary-foreground px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5" />
            {t("admin.vouchers.detail")}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-6 bg-background">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <div className="text-xs text-muted-foreground mb-1">
                {t("admin.vouchers.form.code")}
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg flex items-center gap-2">
                  {voucher.code}
                </div>
                <Badge variant="outline">
                  {t(`admin.vouchers.types.${voucher.discountType}`)}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {t("admin.vouchers.form.status")}
              </div>
              <Badge
                variant={voucher.status === "active" ? "default" : "secondary"}
              >
                {t(`admin.vouchers.status.${voucher.status}`)}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {t("admin.vouchers.form.value")}
              </div>
              <div className="font-semibold flex items-center gap-1">
                <Percent className="h-4 w-4 text-muted-foreground" />
                {voucher.discountType === "percentage"
                  ? `${voucher.discount}%`
                  : `${voucher.discount.toLocaleString()}đ`}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {t("admin.vouchers.form.maxDiscount")}
              </div>
              <div className="font-semibold">
                {voucher.maxDiscount ?? (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {t("admin.vouchers.form.expiryDate")}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {t("admin.vouchers.table.createdAt")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(voucher.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {t("admin.vouchers.form.usageLimit")}
              </div>
              <div className="font-semibold">
                {voucher.usageLimit ?? (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {t("admin.vouchers.form.minOrderValue")}
              </div>
              <div className="font-semibold">
                {voucher.minOrderValue?.toLocaleString() ?? (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-muted-foreground mb-1">
                {t("admin.vouchers.form.applicableTiers")}
              </div>
              <div className="flex flex-wrap gap-2">
                {voucher.applicableTiers.map((tier) => (
                  <Badge key={tier} variant="secondary">
                    {t(`admin.vouchers.tiers.${tier.toLowerCase()}`)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={onClose}>
              {t("common.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
