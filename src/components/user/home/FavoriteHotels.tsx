import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AlertCircle, Heart } from "lucide-react";

import { favouriteApi } from "@/api/favourite/favourite.api";
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

export default function FavoriteHotels() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Query để lấy danh sách khách sạn phổ biến
  const {
    data: popularHotels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["popularHotels"],
    queryFn: () => favouriteApi.getPopularHotels(1, 10),
  });

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
            <Heart className="w-12 h-12 text-muted-foreground mb-4" />
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t("hotels.favorites")}</h2>
          <Button variant="outline" className="font-medium">
            {t("common.view_all")}
          </Button>
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
                  <HotelCard hotel={hotel} />
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
