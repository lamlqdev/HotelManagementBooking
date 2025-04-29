import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { locationApi } from "@/api/location/location.api";
import { PopularLocation } from "@/api/location/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import NoLocationHotel from "@/assets/illustration/NoLocationHotel.svg";

export default function PopularDestinations() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["popularLocations"],
    queryFn: () => locationApi.getPopularLocations(),
  });

  const handleDestinationClick = (locationId: string, locationName: string) => {
    navigate(
      `/search?locationId=${locationId}&locationName=${encodeURIComponent(
        locationName
      )}`
    );
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">
            {t("destinations.popular")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">
            {t("destinations.popular")}
          </h2>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Không thể tải danh sách địa điểm phổ biến"}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  const popularDestinations = data?.data || [];

  if (popularDestinations.length === 0) {
    return (
      <section className="py-6">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">
            {t("destinations.popular")}
          </h2>
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src={NoLocationHotel}
              alt="Không có địa điểm"
              className="w-96 h-96 mb-4"
            />
            <p className="text-lg text-gray-500">
              {t("destinations.no_popular_destinations")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">{t("destinations.popular")}</h2>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {popularDestinations.map((destination: PopularLocation) => (
                <CarouselItem
                  key={destination._id}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div
                    className="relative group overflow-hidden rounded-lg cursor-pointer"
                    onClick={() =>
                      handleDestinationClick(destination._id, destination.name)
                    }
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={destination.image?.url || "/placeholder-image.jpg"}
                        alt={destination.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-semibold mb-1">
                        {destination.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {t("destinations.hotel_count", {
                          count: destination.hotelCount,
                        })}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {popularDestinations.length > 4 && (
              <>
                <CarouselPrevious className="hidden md:flex -left-4 bg-white hover:bg-white/90 text-foreground hover:text-foreground/90 border-none shadow-md" />
                <CarouselNext className="hidden md:flex -right-4 bg-white hover:bg-white/90 text-foreground hover:text-foreground/90 border-none shadow-md" />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
