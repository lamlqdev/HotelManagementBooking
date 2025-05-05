import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router";

import { BookingContactForm } from "@/components/user/booking/BookingContactForm";
import { BookingSpecialRequests } from "@/components/user/booking/BookingSpecialRequests";
import { BookingSummary } from "@/components/user/booking/BookingSummary";

const BookingInformationPage = () => {
  const { t } = useTranslation();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();

  const onSubmit = () => {
    // Xử lý submit form và chuyển đến trang thanh toán
    console.log("Submit booking");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <h1 className="text-2xl font-bold mb-6">{t("booking.pageTitle")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form điền thông tin */}
        <div className="lg:col-span-2 space-y-6">
          <BookingContactForm />
          <BookingSpecialRequests />
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
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingInformationPage;
