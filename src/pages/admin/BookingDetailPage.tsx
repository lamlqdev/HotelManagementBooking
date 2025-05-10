import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "@/api/booking/booking.api";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  CreditCard,
  User,
  Hotel,
  FileText,
  Gift,
  Info,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useRef } from "react";

export default function BookingDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: bookingResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking-detail", id],
    queryFn: async () => {
      if (!id) throw new Error("Booking ID is required");
      return await bookingApi.getBookingDetails(id);
    },
    enabled: !!id,
  });

  const sectionIds = [
    { id: "booking-info", label: "Thông tin đơn đặt phòng" },
    { id: "customer-info", label: "Thông tin khách hàng" },
    { id: "payment-info", label: "Thông tin thanh toán" },
    { id: "special-requests", label: "Yêu cầu đặc biệt" },
    { id: "voucher", label: "Voucher" },
  ];
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">
            {t("common.error")}
          </h2>
          <p className="text-muted-foreground">{t("common.errorMessage")}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!bookingResponse || !bookingResponse.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Không tìm thấy booking</h2>
          <p className="text-muted-foreground">
            Không thể tải thông tin booking. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  const booking = bookingResponse.data;

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">
            Chi tiết đơn đặt phòng #{booking._id.slice(-6).toUpperCase()}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Nội dung các section */}
          <div className="flex-1">
            {/* Thông tin booking */}
            <div
              id="booking-info"
              className="mb-10"
              ref={(el) => {
                sectionRefs.current["booking-info"] = el;
              }}
            >
              <div className="bg-white rounded-2xl shadow-md p-6 border border-primary/10">
                <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                  <FileText className="h-6 w-6" /> Thông tin đơn đặt phòng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-lg">
                      <Hotel className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Khách sạn:</span>
                      <span>
                        {typeof booking.room.hotelId === "object"
                          ? booking.room.hotelId?.name
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Phòng:</span>
                      <span>{booking.room?.roomType}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Nhận phòng:</span>
                      <span>
                        {format(new Date(booking.checkIn), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Trả phòng:</span>
                      <span>
                        {format(new Date(booking.checkOut), "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-lg">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Khách hàng:</span>
                      <span>{booking.user?.name || "-"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Ngày tạo:</span>
                      <span>
                        {format(
                          new Date(booking.createdAt),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Ngày cập nhật:</span>
                      <span>
                        {format(
                          new Date(booking.updatedAt),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Thông tin khách hàng */}
            <div
              id="customer-info"
              className="mb-10"
              ref={(el) => {
                sectionRefs.current["customer-info"] = el;
              }}
            >
              <div className="bg-white rounded-2xl shadow-md p-6 border border-primary/10">
                <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                  <User className="h-6 w-6" /> Thông tin khách hàng
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-lg">
                    <span className="font-semibold">Tên:</span>
                    <span className="text-base">
                      {booking.contactInfo?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <span className="font-semibold">Email:</span>
                    <span className="text-base">
                      {booking.contactInfo?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <span className="font-semibold">Điện thoại:</span>
                    <span className="text-base">
                      {booking.contactInfo?.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Thông tin thanh toán */}
            <div
              id="payment-info"
              className="mb-10"
              ref={(el) => {
                sectionRefs.current["payment-info"] = el;
              }}
            >
              <div className="bg-white rounded-2xl shadow-md p-6 border border-primary/10">
                <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                  <CreditCard className="h-6 w-6" /> Thông tin thanh toán
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-lg">
                    <span className="font-semibold">Thành tiền:</span>
                    <span className="font-bold text-xl text-green-700">
                      {booking.finalPrice.toLocaleString()}₫
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <span className="font-semibold">Giá gốc:</span>
                    <span>{booking.originalPrice.toLocaleString()}₫</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <span className="font-semibold">Giảm giá:</span>
                    <span>
                      {booking.discountAmount > 0
                        ? `- ${booking.discountAmount.toLocaleString()}₫`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <span className="font-semibold">
                      Trạng thái thanh toán:
                    </span>
                    <Badge
                      className="text-base px-4 py-2 rounded-lg"
                      variant={
                        booking.paymentStatus === "paid"
                          ? "default"
                          : booking.paymentStatus === "pending"
                          ? "outline"
                          : booking.paymentStatus === "failed"
                          ? "destructive"
                          : booking.paymentStatus === "refunded"
                          ? "secondary"
                          : "secondary"
                      }
                    >
                      {booking.paymentStatus === "pending"
                        ? "Chờ thanh toán"
                        : booking.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : booking.paymentStatus === "failed"
                        ? "Thanh toán thất bại"
                        : booking.paymentStatus === "refunded"
                        ? "Đã hoàn tiền"
                        : booking.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <span className="font-semibold">
                      Phương thức thanh toán:
                    </span>
                    <span>
                      {booking.paymentMethod === "zalopay"
                        ? "ZaloPay"
                        : booking.paymentMethod === "vnpay"
                        ? "VNPay"
                        : booking.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Yêu cầu đặc biệt */}
            <div
              id="special-requests"
              className="mb-10"
              ref={(el) => {
                sectionRefs.current["special-requests"] = el;
              }}
            >
              <div className="bg-white rounded-2xl shadow-md p-6 border border-primary/10">
                <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                  <Info className="h-6 w-6" /> Yêu cầu đặc biệt
                </h2>
                <div className="font-semibold mb-2 text-lg">
                  Nội dung yêu cầu:
                </div>
                <div className="text-base text-muted-foreground">
                  {booking.specialRequests?.additionalRequests || "-"}
                  <div className="mt-1">
                    Nhận sớm:{" "}
                    {booking.specialRequests?.earlyCheckIn ? "Có" : "Không"} |
                    Trả muộn:{" "}
                    {booking.specialRequests?.lateCheckOut ? "Có" : "Không"}
                  </div>
                </div>
              </div>
            </div>
            {/* Voucher */}
            {booking.voucher && (
              <div
                id="voucher"
                className="mb-10"
                ref={(el) => {
                  sectionRefs.current["voucher"] = el;
                }}
              >
                <div className="bg-white rounded-2xl shadow-md p-6 border border-primary/10">
                  <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                    <Gift className="h-6 w-6" /> Voucher
                  </h2>
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-primary" />
                    <span className="font-semibold">
                      {booking.voucher.code}
                    </span>
                    <span className="text-base">
                      (
                      {booking.voucher.discountType === "percentage"
                        ? `${booking.voucher.discount}%`
                        : `${booking.voucher.discount.toLocaleString()}₫`}
                      )
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Thanh điều hướng sticky dọc bên phải */}
          <div className="hidden md:block min-w-[180px]">
            <div className="sticky top-32 z-40 flex flex-col gap-2 bg-background border-l border-border px-4 py-6 rounded-xl shadow-sm">
              {sectionIds.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    const el = sectionRefs.current[tab.id];
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={
                    "text-left py-2 px-3 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-primary/5"
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
