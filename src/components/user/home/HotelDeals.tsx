import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { format } from "date-fns";

import { hotelApi } from "@/api/hotel/hotel.api";
import { locationApi } from "@/api/location/location.api";
import { Hotel } from "@/types/hotel";

import NoDealHotel from "@/assets/illustration/NoDealHotel.svg";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Badge } from "../../ui/badge";
import { Skeleton } from "../../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";

export default function HotelDeals() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Thêm các giá trị mặc định cho ngày check-in và check-out
  const defaultCheckIn = new Date();
  const defaultCheckOut = new Date();
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 1);

  const finalCheckIn = format(defaultCheckIn, "yyyy-MM-dd");
  const finalCheckOut = format(defaultCheckOut, "yyyy-MM-dd");
  const defaultCapacity = "1";

  // Sử dụng React Query để gọi API lấy danh sách khách sạn đang có giảm giá
  const { data, isLoading, isError } = useQuery({
    queryKey: ["discounted-hotels"],
    queryFn: () => hotelApi.getDiscountedHotels({ limit: 8 }),
  });

  // Hàm xử lý khi click vào khách sạn
  const handleHotelClick = async (hotel: Hotel) => {
    try {
      // Lấy thông tin địa điểm từ locationId
      const locationResponse = await locationApi.getLocation(hotel.locationId);
      const locationName = locationResponse.data.name;

      const params = new URLSearchParams();
      params.append("locationName", locationName);
      params.append("checkIn", finalCheckIn);
      params.append("checkOut", finalCheckOut);
      params.append("capacity", defaultCapacity);
      navigate(`/hoteldetail/${hotel._id}?${params.toString()}`);
    } catch (error) {
      console.error("Error fetching location:", error);
      // Nếu không lấy được locationName, vẫn chuyển hướng với các tham số khác
      const params = new URLSearchParams();
      params.append("checkIn", finalCheckIn);
      params.append("checkOut", finalCheckOut);
      params.append("capacity", defaultCapacity);
      navigate(`/hoteldetail/${hotel._id}?${params.toString()}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Xử lý trạng thái loading
  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-card rounded-lg overflow-hidden border border-border"
              >
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Xử lý trạng thái error
  if (isError) {
    return (
      <section className="py-12 bg-background">
        <div className="container">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>
              {t("common.error_loading_data")}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  // Xử lý trạng thái không có dữ liệu
  if (!data?.data || data.data.length === 0) {
    return (
      <section className="py-6">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">{t("hotels.best_deals")}</h2>
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src={NoDealHotel}
              alt="Không có khách sạn"
              className="w-96 h-96 mb-4"
            />
            <p className="text-lg text-gray-500">
              {t("hotels.no_deals_available")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{t("hotels.best_deals")}</h2>
        </div>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {data.data.map((hotel) => (
                <CarouselItem
                  key={hotel._id}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div
                    className="bg-card rounded-lg overflow-hidden border border-border group cursor-pointer"
                    onClick={() => handleHotelClick(hotel)}
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={
                          hotel.featuredImage?.url ||
                          "https://via.placeholder.com/800x600"
                        }
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      {hotel.highestDiscountPercent > 0 && (
                        <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">
                          -{hotel.highestDiscountPercent}%
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {hotel.rating}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">
                        {hotel.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {hotel.locationDescription || hotel.address}
                      </p>
                      <div className="space-y-1">
                        {hotel.lowestPrice > hotel.lowestDiscountedPrice && (
                          <p className="text-sm line-through text-muted-foreground">
                            {formatPrice(hotel.lowestPrice)}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(hotel.lowestDiscountedPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-white hover:bg-white/90 text-foreground hover:text-foreground/90 border-none shadow-md" />
            <CarouselNext className="hidden md:flex -right-4 bg-white hover:bg-white/90 text-foreground hover:text-foreground/90 border-none shadow-md" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
