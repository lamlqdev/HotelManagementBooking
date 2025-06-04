import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { Booking } from "@/types/booking";

interface BookingActionsProps {
  bookingId: string;
  status: Booking["status"];
  onApprove: (bookingId: string, note: string) => void;
  onReject: (bookingId: string, note: string) => void;
  onCancel: (bookingId: string, note: string) => void;
}

export function BookingActions({
  bookingId,
  status,
  onApprove,
  onReject,
  onCancel,
}: BookingActionsProps) {
  const { t } = useTranslation();
  const [note, setNote] = useState("");

  const handleApprove = () => {
    onApprove(bookingId, note);
    setNote("");
  };

  const handleReject = () => {
    onReject(bookingId, note);
    setNote("");
  };

  const handleCancel = () => {
    onCancel(bookingId, note);
    setNote("");
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={t("partner.bookings.notePlaceholder")}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex gap-2">
        {status === "pending" && (
          <>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleApprove}
            >
              {t("partner.bookings.approve")}
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleReject}
            >
              {t("partner.bookings.reject")}
            </Button>
          </>
        )}
        {status === "confirmed" && (
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleCancel}
          >
            {t("partner.bookings.cancel")}
          </Button>
        )}
      </div>
    </div>
  );
}
