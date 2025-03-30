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
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AddPromotionDialogProps {
  onAdd: (promotion: {
    name: string;
    code: string;
    discount: number;
    validUntil: string;
  }) => void;
}

export function AddPromotionDialog({ onAdd }: AddPromotionDialogProps) {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onAdd({
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      discount: Number(formData.get("discount")),
      validUntil: formData.get("validUntil") as string,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          {t("room.detail.add_promotion")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("room.dialog.add_promotion.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("room.dialog.add_promotion.name")}</Label>
            <Input
              name="name"
              placeholder={t("room.dialog.add_promotion.name_placeholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t("room.dialog.add_promotion.code")}</Label>
            <Input
              name="code"
              placeholder={t("room.dialog.add_promotion.code_placeholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t("room.dialog.add_promotion.discount")}</Label>
            <Input
              name="discount"
              type="number"
              placeholder={t("room.dialog.add_promotion.discount_placeholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t("room.dialog.add_promotion.valid_until")}</Label>
            <Input name="validUntil" type="date" required />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              {t("room.dialog.add_promotion.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
