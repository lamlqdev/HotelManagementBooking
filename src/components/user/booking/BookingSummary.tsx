import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdLocalOffer } from "react-icons/md";

import { hotelApi } from "@/api/hotel/hotel.api";
import { roomApi } from "@/api/room/room.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingDates } from "@/components/user/booking/BookingDates";
import { HotelInfo } from "@/components/user/booking/HotelInfo";
import { PricingSummary } from "@/components/user/booking/PricingSummary";

import { getAmenityIcon } from "@/utils/amenityIcons";
import type { BookingSummaryProps } from "@/api/booking/types";

export const BookingSummary = ({
  roomId,
  searchParams,
  onSubmit,
}: BookingSummaryProps) => {
  const { t } = useTranslation();

  const { data: hotelResponse, isLoading: isLoadingHotel } = useQuery({
    queryKey: ["hotel", searchParams.hotelId],
    queryFn: () => hotelApi.getHotel(searchParams.hotelId),
    enabled: !!searchParams.hotelId,
  });

  const { data: roomResponse, isLoading: isLoadingRoom } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => roomApi.getRoom(roomId),
    enabled: !!roomId,
  });

  if (isLoadingHotel || isLoadingRoom) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6 sticky top-24">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const hotel = hotelResponse?.data;
  const room = roomResponse?.data;

  if (!hotel || !room) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6 sticky top-24 text-center">
        <h2 className="text-xl font-semibold mb-4 text-card-foreground">
          {t("common.error")}
        </h2>
        <p>{t("common.not_found")}</p>
      </div>
    );
  }

  // Calculate nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights(searchParams.checkIn, searchParams.checkOut);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
    return format(date, "EEEE, d 'thg' M yyyy", { locale: vi });
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6 sticky top-32">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        {t("booking.summary.title")}
      </h2>

      <div className="space-y-4">
        <HotelInfo
          name={hotel.name}
          rating={hotel.rating}
          reviews={hotel.favoriteCount}
          address={hotel.address}
          image={hotel.featuredImage?.url || "/placeholder-hotel.jpg"}
        />

        <div className="border-t border-border dark:border-primary/30 pt-4">
          <BookingDates
            checkIn={{
              date: formatDate(searchParams.checkIn),
              time: hotel.policies.checkInTime,
            }}
            checkOut={{
              date: formatDate(searchParams.checkOut),
              time: hotel.policies.checkOutTime,
            }}
            nights={nights}
          />
        </div>

        <div className="border-t border-border dark:border-primary/30 pt-4">
          <h3 className="text-lg font-medium mb-3">
            {t("booking.summary.amenities.title")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {room.amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {getAmenityIcon(amenity.icon || "")}
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border dark:border-primary/30 pt-4">
          <PricingSummary
            roomType={room.roomName}
            guests={searchParams.capacity}
            rooms={1}
            nightsStay={nights}
            pricePerNight={room.price}
            totalPrice={room.price * nights}
          />
        </div>

        <div className="border-t border-border dark:border-primary/30 pt-4">
          <div className="relative">
            <MdLocalOffer className="absolute top-3 left-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("booking.summary.coupon.placeholder")}
              className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <Button type="button" onClick={onSubmit} className="w-full mt-6">
        {t("booking.summary.submitButton")}
      </Button>
    </div>
  );
};
