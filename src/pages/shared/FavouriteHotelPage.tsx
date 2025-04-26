import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AlertCircle, Heart } from "lucide-react";

import { favouriteApi } from "@/api/favourite/favourite.api";
import { Button } from "@/components/ui/button";
import { Hotel } from "@/types/hotel";
import { HotelCard } from "@/components/common/HotelCard";

const FavouriteHotelPage = () => {
  const { t } = useTranslation();

  // Query để lấy danh sách khách sạn yêu thích
  const {
    data: favoriteHotels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favoriteHotels"],
    queryFn: () => favouriteApi.getFavorites(),
  });

  // Xử lý trạng thái loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pt-32">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("hotels.favorites")}</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Xử lý trạng thái lỗi
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6 pt-32">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("hotels.favorites")}</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("common.error")}</h3>
          <p className="text-muted-foreground mb-4">
            {t("common.error_loading_data")}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t("common.try_again")}
          </Button>
        </div>
      </div>
    );
  }

  // Xử lý trạng thái không có dữ liệu
  if (!favoriteHotels?.data || favoriteHotels.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 pt-32">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("hotels.favorites")}</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t("favourite.no_favourites")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("favourite.no_favourites_user")}
          </p>
        </div>
      </div>
    );
  }

  // Render dữ liệu khi có
  return (
    <div className="container mx-auto px-4 py-6 pt-32">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("hotels.favorites")}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteHotels.data.map((hotel: Hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default FavouriteHotelPage;
