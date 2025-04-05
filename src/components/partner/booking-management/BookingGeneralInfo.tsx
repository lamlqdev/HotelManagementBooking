import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import {
  CalendarIcon,
  Clock,
  CreditCard,
  FileText,
  Hotel,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Định nghĩa kiểu dữ liệu cho đơn đặt phòng
interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  hotelName: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
  totalPrice: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed";
  specialRequests: string;
  createdAt: Date;
}

interface BookingGeneralInfoProps {
  booking: Booking;
}

// Hàm định dạng trạng thái đơn đặt phòng
const getStatusBadge = (status: Booking["status"], t: any) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          {t("partner.bookings.statusTypes.pending")}
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          {t("partner.bookings.statusTypes.approved")}
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          {t("partner.bookings.statusTypes.rejected")}
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {t("partner.bookings.statusTypes.completed")}
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          {t("partner.bookings.statusTypes.cancelled")}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {t("partner.bookings.statusTypes.unknown")}
        </Badge>
      );
  }
};

// Hàm định dạng trạng thái thanh toán
const getPaymentStatusBadge = (status: Booking["paymentStatus"], t: any) => {
  switch (status) {
    case "paid":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          {t("partner.bookings.paymentTypes.paid")}
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          {t("partner.bookings.paymentTypes.pending")}
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          {t("partner.bookings.paymentTypes.failed")}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {t("partner.bookings.paymentTypes.unknown")}
        </Badge>
      );
  }
};

// Hàm định dạng giá tiền
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export function BookingGeneralInfo({ booking }: BookingGeneralInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Hotel className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{t("partner.bookings.hotel")}:</span>
            <span>{booking.hotelName}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {t("partner.bookings.roomType")}:
            </span>
            <span>{booking.roomType}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {t("partner.bookings.checkIn")}:
            </span>
            <span>
              {format(booking.checkIn, "dd/MM/yyyy", {
                locale: vi,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {t("partner.bookings.checkOut")}:
            </span>
            <span>
              {format(booking.checkOut, "dd/MM/yyyy", {
                locale: vi,
              })}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{t("partner.bookings.guests")}:</span>
            <span>{booking.guests}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hotel className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{t("partner.bookings.rooms")}:</span>
            <span>{booking.rooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {t("partner.bookings.totalPrice")}:
            </span>
            <span>{formatPrice(booking.totalPrice)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {t("partner.bookings.createdAt")}:
            </span>
            <span>
              {format(booking.createdAt, "dd/MM/yyyy", {
                locale: vi,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-medium">
          {t("partner.bookings.specialRequests")}:
        </div>
        <p className="text-sm text-muted-foreground">
          {booking.specialRequests || t("partner.bookings.noSpecialRequests")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="font-medium">{t("partner.bookings.status")}:</div>
          {getStatusBadge(booking.status, t)}
        </div>
        <div className="space-y-2">
          <div className="font-medium">{t("partner.bookings.payment")}:</div>
          {getPaymentStatusBadge(booking.paymentStatus, t)}
        </div>
      </div>
    </div>
  );
}
