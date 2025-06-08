import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { BookingContactForm } from "@/components/user/booking/BookingContactForm";
import { BookingSpecialRequests } from "@/components/user/booking/BookingSpecialRequests";
import { BookingSummary } from "@/components/user/booking/BookingSummary";
import { bookingApi } from "@/api/booking/booking.api";
import type { ContactFormData, SpecialRequestsData } from "@/api/booking/types";
import { contactFormSchema, specialRequestsSchema } from "@/api/booking/types";
import { voucherApi } from "@/api/voucher/voucher.api";

interface ErrorResponse {
  message: string;
}

const BookingInformationPage = () => {
  const { t } = useTranslation();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const [selectedVoucherId, setSelectedVoucherId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      bookingFor: "self",
    },
  });

  const specialRequestsForm = useForm<SpecialRequestsData>({
    resolver: zodResolver(specialRequestsSchema),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let loadingToastId: string | number | undefined;

  // Lấy danh sách voucher có thể sử dụng
  const { data: availableVouchers, isLoading: isVoucherLoading } = useQuery({
    queryKey: ["available-vouchers", roomId],
    queryFn: () => voucherApi.getAvailableVouchers({ roomId: roomId! }),
    enabled: !!roomId,
  });

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      const contactData = contactForm.getValues();
      const specialRequestsData = specialRequestsForm.getValues();

      if (!contactData) {
        throw new Error(t("booking.contactRequired"));
      }

      const bookingData = {
        roomId: roomId!,
        checkIn: searchParams.get("checkIn") || "",
        checkOut: searchParams.get("checkOut") || "",
        voucherId: selectedVoucherId || undefined,
        paymentMethod: contactData.paymentMethod,
        bookingFor: contactData.bookingFor,
        contactInfo: {
          name: contactData.contactName,
          email: contactData.email,
          phone: contactData.phone,
        },
        guestInfo:
          contactData.bookingFor === "other"
            ? {
                name: contactData.contactName || "",
                phone: contactData.phone,
                email: contactData.email,
              }
            : undefined,
        specialRequests: specialRequestsData
          ? {
              earlyCheckIn: specialRequestsData.earlyCheckIn,
              lateCheckOut: specialRequestsData.lateCheckOut,
              additionalRequests: specialRequestsData.additionalRequests,
            }
          : undefined,
      };

      return bookingApi.createBooking(bookingData);
    },
    onMutate: () => {
      loadingToastId = toast.loading("Đang xử lý đặt phòng...");
    },
    onSuccess: (response) => {
      toast.dismiss(loadingToastId);
      toast.success(t("booking.success"));
      // Chuyển đến trang thanh toán
      console.log(response.paymentUrl);
      window.location.href = response.paymentUrl;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.dismiss(loadingToastId);
      console.error("Error creating booking:", error);
      // Hiển thị message lỗi từ server nếu có, nếu không thì hiển thị message mặc định
      const errorMessage = error.response?.data?.message || t("booking.error");
      toast.error(errorMessage);
    },
  });

  const handleBookingSubmit = async () => {
    // Validate contact form
    const contactResult = await contactForm.trigger();
    if (!contactResult) {
      toast.error(t("booking.contactRequired"));
      return;
    }

    // Validate special requests form if it has been touched
    if (specialRequestsForm.formState.isDirty) {
      const specialRequestsResult = await specialRequestsForm.trigger();
      if (!specialRequestsResult) {
        return;
      }
    }

    createBookingMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <h1 className="text-2xl font-bold mb-6">{t("booking.pageTitle")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form điền thông tin */}
        <div className="lg:col-span-2 space-y-6">
          <BookingContactForm form={contactForm} />
          <BookingSpecialRequests form={specialRequestsForm} />
          {/* Chọn voucher */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2 text-card-foreground">
              Chọn voucher
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Chọn một voucher bên dưới để áp dụng cho đơn đặt phòng của bạn
              (nếu có).
            </p>
            {isVoucherLoading ? (
              <div>Đang tải voucher...</div>
            ) : availableVouchers &&
              availableVouchers.data &&
              availableVouchers.data.length > 0 ? (
              <select
                className="w-full border rounded px-3 py-2 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
                value={selectedVoucherId || ""}
                onChange={(e) =>
                  setSelectedVoucherId(e.target.value || undefined)
                }
              >
                <option value="">Không sử dụng voucher</option>
                {availableVouchers.data.map((voucher) => (
                  <option key={voucher._id} value={voucher._id}>
                    {voucher.code} - Giảm {voucher.discount}
                    {voucher.discountType === "percentage" ? "%" : "₫"}
                    {voucher.maxDiscount
                      ? ` (Tối đa ${voucher.maxDiscount.toLocaleString()}₫)`
                      : ""}
                    {voucher.minOrderValue
                      ? ` | Đơn tối thiểu ${voucher.minOrderValue.toLocaleString()}₫`
                      : ""}
                    {voucher.expiryDate
                      ? ` | HSD: ${new Date(
                          voucher.expiryDate
                        ).toLocaleDateString("vi-VN")}`
                      : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div>Không có voucher khả dụng</div>
            )}
          </div>
        </div>

        {/* Thông tin đặt phòng */}
        <div className="lg:col-span-1">
          <BookingSummary
            roomId={roomId!}
            searchParams={{
              hotelId: searchParams.get("hotelId") || "",
              checkIn: searchParams.get("checkIn") || "",
              checkOut: searchParams.get("checkOut") || "",
              capacity: parseInt(searchParams.get("capacity") || "1"),
            }}
            selectedVoucher={
              selectedVoucherId && availableVouchers && availableVouchers.data
                ? availableVouchers.data.find(
                    (v) => v._id === selectedVoucherId
                  )
                : undefined
            }
            onSubmit={handleBookingSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingInformationPage;
