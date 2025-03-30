import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UpdatePriceDialogProps {
  price: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (price: number) => void;
}

export function UpdatePriceDialog({
  price,
  isOpen,
  onOpenChange,
  onUpdate,
}: UpdatePriceDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90">
          {t("room.detail.update_price")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("room.dialog.update_price.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("room.dialog.update_price.new_price")}</Label>
            <div className="relative">
              <Input
                type="number"
                value={price}
                onChange={(e) => onUpdate(Number(e.target.value))}
                className="pl-8"
                min={0}
              />
              <span className="absolute left-3 top-2.5 text-muted-foreground">
                đ
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{t("room.dialog.update_price.apply_from")}</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("room.dialog.update_price.cancel")}
            </Button>
            <Button onClick={() => onUpdate(price)}>
              {t("room.dialog.update_price.update")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
