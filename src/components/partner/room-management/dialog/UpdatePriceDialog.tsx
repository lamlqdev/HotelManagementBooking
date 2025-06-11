import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Calendar, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomApi } from "@/api/room/room.api";
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

interface UpdatePriceDialogProps {
  roomId: string;
  price: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdatePriceDialog({
  roomId,
  price,
  isOpen,
  onOpenChange,
}: UpdatePriceDialogProps) {
  const { t } = useTranslation();
  const [newPrice, setNewPrice] = useState(price);
  const queryClient = useQueryClient();

  const updatePriceMutation = useMutation({
    mutationFn: (price: number) => {
      const formData = new FormData();
      formData.append("price", price.toString());
      return roomApi.updateRoom(roomId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(t("room.dialog.update_price.success"));
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("room.dialog.update_price.error"));
    },
  });

  const handleUpdate = () => {
    if (newPrice <= 0) {
      toast.error(t("room.dialog.update_price.invalid_price"));
      return;
    }
    updatePriceMutation.mutate(newPrice);
  };

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
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
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
            <Button
              onClick={handleUpdate}
              disabled={updatePriceMutation.isPending}
            >
              {updatePriceMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("room.dialog.update_price.updating")}
                </>
              ) : (
                t("room.dialog.update_price.update")
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
