import { MdLocalOffer } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HotelInfo } from "@/components/common/HotelInfo";
import { BookingDates } from "@/components/common/BookingDates";
import { AmenitiesList } from "@/components/common/AmenitiesList";
import { PricingSummary } from "@/components/common/PricingSummary";
import { IconType } from "react-icons";
import { useTranslation } from "react-i18next";

interface BookingSummaryProps {
  hotelInfo: {
    name: string;
    rating: number;
    reviews: number;
    address: string;
    image: string;
    bookingDates: {
      checkIn: {
        date: string;
        time: string;
      };
      checkOut: {
        date: string;
        time: string;
      };
      nights: number;
    };
    amenities: Array<{
      icon: IconType;
      name: string;
    }>;
  };
  bookingDetails: {
    roomType: string;
    guests: number;
    rooms: number;
    nightsStay: number;
    pricePerNight: number;
    totalPrice: number;
  };
  onSubmit: () => void;
}

export const BookingSummary = ({
  hotelInfo,
  bookingDetails,
  onSubmit,
}: BookingSummaryProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        {t("booking.bookingSummary.title")}
      </h2>
      <div className="space-y-6">
        <HotelInfo
          name={hotelInfo.name}
          rating={hotelInfo.rating}
          reviews={hotelInfo.reviews}
          address={hotelInfo.address}
          image={hotelInfo.image}
        />

        <div className="border-t border-border dark:border-primary/30 pt-4">
          <BookingDates
            checkIn={hotelInfo.bookingDates.checkIn}
            checkOut={hotelInfo.bookingDates.checkOut}
            nights={hotelInfo.bookingDates.nights}
          />
        </div>

        <div className="border-t border-border dark:border-primary/30 pt-4">
          <AmenitiesList amenities={hotelInfo.amenities} />
        </div>

        <div className="border-t border-border dark:border-primary/30 pt-4">
          <PricingSummary {...bookingDetails} />
        </div>

        <div className="border-t border-border dark:border-primary/30 pt-4">
          <div className="relative">
            <MdLocalOffer className="absolute top-3 left-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("booking.bookingSummary.coupon.placeholder")}
              className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <Button type="button" className="w-full" onClick={onSubmit}>
          {t("booking.bookingSummary.submitButton")}
        </Button>
      </div>
    </div>
  );
};
