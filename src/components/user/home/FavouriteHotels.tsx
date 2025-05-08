import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AlertCircle } from "lucide-react";

import { favouriteApi } from "@/api/favourite/favourite.api";
import { locationApi } from "@/api/location/location.api";
import { Hotel } from "@/types/hotel";
import { Button } from "../../ui/button";
import { HotelCard } from "@/components/common/HotelCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";

import NoData from "@/assets/illustration/NoData.svg";

export default function FavouriteHotels() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Thêm các giá trị mặc định cho ngày check-in và check-out
  const defaultCheckIn = new Date();
  const defaultCheckOut = new Date();
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 1);

  const finalCheckIn = format(defaultCheckIn, "yyyy-MM-dd");
  const finalCheckOut = format(defaultCheckOut, "yyyy-MM-dd");
  const defaultCapacity = "1";

  // Query để lấy danh sách khách sạn phổ biến
  const {
    data: popularHotels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["popularHotels"],
    queryFn: () => favouriteApi.getPopularHotels(1, 10),
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

  // Xử lý trạng thái loading
  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{t("hotels.favorites")}</h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Xử lý trạng thái lỗi
  if (isError) {
    return (
      <section className="py-12 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{t("hotels.favorites")}</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("common.error")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("common.error_loading_data")}
            </p>
            <Button
              variant="outline"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["popularHotels"] })
              }
            >
              {t("common.try_again")}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Xử lý trạng thái không có dữ liệu
  if (!popularHotels?.data || popularHotels.data.length === 0) {
    return (
      <section className="py-12 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{t("hotels.favorites")}</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={NoData}
              alt="Không có khách sạn"
              className="w-96 h-96 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">
              {t("favourite.no_favourites")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("favourite.no_favourites_description")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Render dữ liệu khi có
  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{t("hotels.favorites")}</h2>
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
              {popularHotels.data.map((hotel: Hotel) => (
                <CarouselItem
                  key={hotel._id}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div onClick={() => handleHotelClick(hotel)}>
                    <HotelCard hotel={hotel} />
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
