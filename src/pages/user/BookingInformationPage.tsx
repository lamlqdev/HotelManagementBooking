import { FaWifi, FaParking, FaSwimmingPool, FaUtensils } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { BookingContactForm } from "@/components/sections/booking/BookingContactForm";
import { BookingSpecialRequests } from "@/components/sections/booking/BookingSpecialRequests";
import { BookingSummary } from "@/components/sections/booking/BookingSummary";

const BookingInformationPage = () => {
  const { t } = useTranslation();

  const hotelInfo = {
    name: "Lakeside Motel Warefront",
    rating: 4.5,
    reviews: 128,
    checkIn: "14:00",
    checkOut: "12:00",
    address: "Lorem ipsum road, Tantruim-2322, Melbourne, Australia",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    bookingDates: {
      checkIn: {
        date: "Thứ 3, 18 thg 3 2025",
        time: "14:00",
      },
      checkOut: {
        date: "Thứ 4, 19 thg 3 2025",
        time: "12:00",
      },
      nights: 1,
    },
    amenities: [
      { icon: FaWifi, name: t("booking.bookingSummary.amenities.wifi") },
      { icon: FaParking, name: t("booking.bookingSummary.amenities.parking") },
      {
        icon: FaSwimmingPool,
        name: t("booking.bookingSummary.amenities.pool"),
      },
      {
        icon: FaUtensils,
        name: t("booking.bookingSummary.amenities.restaurant"),
      },
    ],
  };

  const bookingDetails = {
    roomType: "Deluxe Double Room",
    guests: 2,
    rooms: 1,
    nightsStay: 2,
    pricePerNight: 1200000,
    totalPrice: 2400000,
  };

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
            hotelInfo={hotelInfo}
            bookingDetails={bookingDetails}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingInformationPage;
