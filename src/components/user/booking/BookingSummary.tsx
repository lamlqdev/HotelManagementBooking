import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { hotelApi } from "@/api/hotel/hotel.api";
import { roomApi } from "@/api/room/room.api";
import { reviewApi } from "@/api/review/review.api";

import { Button } from "@/components/ui/button";
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
  selectedVoucher,
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

  const { data: reviewsResponse, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", searchParams.hotelId],
    queryFn: () => reviewApi.getHotelReviews(searchParams.hotelId),
    enabled: !!searchParams.hotelId,
  });

  if (isLoadingHotel || isLoadingRoom || isLoadingReviews) {
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
  const reviews = reviewsResponse?.data || [];

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

  // Tính giá giảm và giá cuối cùng nếu có voucher
  const originalPrice = room.price * nights;
  let discountAmount = 0;
  if (selectedVoucher) {
    // Kiểm tra minOrderValue
    if (
      !selectedVoucher.minOrderValue ||
      originalPrice >= selectedVoucher.minOrderValue
    ) {
      if (selectedVoucher.discountType === "percentage") {
        discountAmount = Math.round(
          (originalPrice * selectedVoucher.discount) / 100
        );
        if (
          selectedVoucher.maxDiscount &&
          discountAmount > selectedVoucher.maxDiscount
        ) {
          discountAmount = selectedVoucher.maxDiscount;
        }
      } else {
        discountAmount = selectedVoucher.discount;
        if (
          selectedVoucher.maxDiscount &&
          discountAmount > selectedVoucher.maxDiscount
        ) {
          discountAmount = selectedVoucher.maxDiscount;
        }
      }
    }
  }
  const finalPrice = originalPrice - discountAmount;

  return (
    <div className="bg-card rounded-lg shadow-md p-6 sticky top-32">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        {t("booking.summary.title")}
      </h2>

      <div className="space-y-4">
        <HotelInfo
          name={hotel.name}
          rating={hotel.rating}
          reviews={reviews.length}
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
            roomType={room.roomType}
            guests={searchParams.capacity}
            rooms={1}
            nightsStay={nights}
            pricePerNight={room.price}
            totalPrice={originalPrice}
          />
          {/* Hiển thị giá giảm và giá cuối cùng nếu có voucher */}
          {discountAmount > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giá gốc</span>
                <span className="line-through text-muted-foreground">
                  {originalPrice.toLocaleString()}₫
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-green-600 font-medium">Giảm giá</span>
                <span className="text-green-600 font-medium">
                  - {discountAmount.toLocaleString()}₫
                </span>
              </div>
              <div className="flex justify-between text-base mt-2 font-bold">
                <span className="text-primary">Giá cuối cùng</span>
                <span className="text-primary">
                  {finalPrice.toLocaleString()}₫
                </span>
              </div>
            </div>
          )}
          {discountAmount === 0 && selectedVoucher && (
            <div className="mt-4 text-sm text-yellow-600">
              Không đủ điều kiện áp dụng voucher này.
            </div>
          )}
        </div>
      </div>

      <Button type="button" onClick={onSubmit} className="w-full mt-6">
        {t("booking.summary.submitButton")}
      </Button>
    </div>
  );
};
