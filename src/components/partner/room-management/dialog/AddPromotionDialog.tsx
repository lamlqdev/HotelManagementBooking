import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, startOfDay } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { Plus, CalendarIcon } from "lucide-react";

import { roomApi } from "@/api/room/room.api";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddPromotionDialogProps {
  roomId: string;
}

export function AddPromotionDialog({ roomId }: AddPromotionDialogProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const setDiscountMutation = useMutation({
    mutationFn: (data: {
      discountPercent: number;
      startDate: string;
      endDate: string;
    }) => roomApi.setRoomDiscount(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(t("room.dialog.add_promotion.success"));
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("room.dialog.add_promotion.error"));
    },
  });

  const formatDate = (date: Date) => {
    const formatted = format(date, "PPP", {
      locale: i18n.language === "vi" ? vi : enUS,
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!endDate) {
      toast.error(t("room.dialog.add_promotion.end_date_required"));
      return;
    }

    setDiscountMutation.mutate({
      discountPercent: Number(formData.get("discountPercent")),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Label>{t("room.dialog.add_promotion.discount_percent")}</Label>
            <Input
              name="discountPercent"
              type="number"
              min="0"
              max="100"
              placeholder={t("room.dialog.add_promotion.discount_placeholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t("room.dialog.add_promotion.start_date")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(startDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  locale={i18n.language === "vi" ? vi : enUS}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>{t("room.dialog.add_promotion.end_date")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    formatDate(endDate)
                  ) : (
                    <span className="text-muted-foreground">
                      {t("room.dialog.add_promotion.select_end_date")}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  locale={i18n.language === "vi" ? vi : enUS}
                  disabled={(date) => startOfDay(date) < startOfDay(startDate)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={setDiscountMutation.isPending}
            >
              {setDiscountMutation.isPending ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("common.loading")}
                </span>
              ) : (
                t("room.dialog.add_promotion.add")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
