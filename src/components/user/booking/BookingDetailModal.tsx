import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Hotel,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CreditCard,
  BedDouble,
  Users,
  Tag,
} from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import type { MyBookingItem } from "@/api/booking/types";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingApi } from "@/api/booking/booking.api";

interface BookingDetailModalProps {
  booking: MyBookingItem;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDetailModal = ({
  booking,
  isOpen,
  onClose,
}: BookingDetailModalProps) => {
  const { t } = useTranslation();
  const roomImg = booking.room.images?.[0]?.url;
  const nights = Math.max(
    1,
    differenceInCalendarDays(
      new Date(booking.checkOut),
      new Date(booking.checkIn)
    )
  );

  // Badge trạng thái đặt phòng
  const statusColor =
    booking.status === "confirmed"
      ? "default"
      : booking.status === "pending"
      ? "secondary"
      : booking.status === "cancelled"
      ? "destructive"
      : "outline";

  // Badge trạng thái thanh toán
  const paymentColor =
    booking.paymentStatus === "paid"
      ? "default"
      : booking.paymentStatus === "pending"
      ? "secondary"
      : booking.paymentStatus === "failed"
      ? "destructive"
      : "outline";

  // Mutation huỷ đặt phòng
  const cancelMutation = useMutation({
    mutationFn: () => bookingApi.cancelBooking(booking._id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          t("booking.detailModal.cancelSuccess") || "Huỷ đặt phòng thành công"
        );
        onClose();
      } else {
        toast.error(response.message || "Huỷ đặt phòng thất bại");
      }
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Có lỗi xảy ra khi huỷ đặt phòng"
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Header với ảnh phòng và trạng thái */}
        <div className="relative">
          <img
            src={roomImg || "/images/room-default.jpg"}
            alt={booking.room.roomName}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={statusColor} className="text-base px-3 py-1">
              {t(`booking.myBookingPage.status.${booking.status}`)}
            </Badge>
            <Badge variant={paymentColor} className="text-base px-3 py-1">
              {t(
                `booking.myBookingPage.paymentStatus.${booking.paymentStatus}`
              )}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/60 text-white rounded px-3 py-1 text-sm font-medium">
            #{booking._id}
          </div>
        </div>
        <DialogHeader className="px-6 pt-4 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Hotel className="h-5 w-5" />
            {booking.room.roomName}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin phòng */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-primary">
                {t("booking.detailModal.roomInfo")}
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("booking.detailModal.roomType")}: {booking.room.roomType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("booking.detailModal.bedType")}: {booking.room.bedType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("booking.detailModal.capacity")}: {booking.room.capacity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {t("booking.detailModal.floor")}:
                  </span>
                  <span>{booking.room.floor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {t("booking.detailModal.area")}:
                  </span>
                  <span>{booking.room.squareMeters} m²</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-primary">
                {t("booking.detailModal.contactInfo")}
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.contactInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.contactInfo.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Thông tin đặt phòng & thanh toán */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-primary">
                {t("booking.detailModal.bookingInfo")}
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("booking.detailModal.checkIn")}:{" "}
                    {format(booking.checkIn, "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("booking.detailModal.checkOut")}:{" "}
                    {format(booking.checkOut, "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("booking.detailModal.createdAt")}:{" "}
                    {format(booking.createdAt, "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {t("booking.detailModal.nights")}:
                  </span>
                  <span>{nights}</span>
                </div>
                {booking.specialRequests?.additionalRequests && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {t("booking.detailModal.specialRequests")}:
                    </span>
                    <span>{booking.specialRequests.additionalRequests}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-primary">
                {t("booking.detailModal.paymentInfo")}
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("booking.detailModal.paymentMethod")}:{" "}
                    {booking.paymentMethod === "zalopay"
                      ? t("booking.detailModal.paymentMethodZaloPay")
                      : t("booking.detailModal.paymentMethodVNPay")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {t("booking.detailModal.originalPrice")}:
                  </span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(booking.originalPrice)}
                  </span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {t("booking.detailModal.discount")}:
                    </span>
                    <span className="text-green-600">
                      -
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(booking.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {t("booking.detailModal.total")}:
                  </span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(booking.finalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-6">
          <Button variant="outline" onClick={onClose}>
            {t("booking.detailModal.close")}
          </Button>
          {booking.status === "pending" && (
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending
                ? t("booking.detailModal.cancelling") || "Đang huỷ..."
                : t("booking.detailModal.cancel")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
