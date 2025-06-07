import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Heart, Star } from "lucide-react";

import { favouriteApi } from "@/api/favourite/favourite.api";
import { useAppSelector } from "@/store/hooks";
import { Hotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const dayAfterTomorrow = format(addDays(new Date(), 2), "yyyy-MM-dd");

  // Query kiểm tra trạng thái yêu thích
  const { data: favoriteStatus, isLoading: isCheckingFavorite } = useQuery({
    queryKey: ["favorite", hotel._id],
    queryFn: () => favouriteApi.checkFavorite(hotel._id),
    enabled: isAuthenticated,
  });

  // Mutation để thêm/xóa khách sạn khỏi danh sách yêu thích
  const { mutate: toggleFavorite, isPending: isToggling } = useMutation({
    mutationFn: async () => {
      if (favoriteStatus?.isFavorite) {
        return favouriteApi.removeFavorite(hotel._id);
      }
      return favouriteApi.addFavorite(hotel._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteHotels"] });
      queryClient.invalidateQueries({ queryKey: ["favorite", hotel._id] });
      toast.success(
        favoriteStatus?.isFavorite
          ? t("favourite.remove_success")
          : t("favourite.add_success")
      );
    },
    onError: () => {
      toast.error(
        favoriteStatus?.isFavorite
          ? t("favourite.remove_error")
          : t("favourite.add_error")
      );
    },
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t("favourite.login_required"));
      return;
    }
    toggleFavorite();
  };

  const handleClick = () => {
    navigate(
      `/hoteldetail/${hotel._id}?checkIn=${tomorrow}&checkOut=${dayAfterTomorrow}&capacity=1`
    );
  };

  return (
    <div
      className="bg-card rounded-lg overflow-hidden border border-border group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[4/3]">
        <img
          src={hotel.featuredImage?.url}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white/90 transition-colors group/btn"
            onClick={handleToggleFavorite}
            disabled={isToggling || isCheckingFavorite}
          >
            {isToggling || isCheckingFavorite ? (
              <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
            ) : (
              <Heart
                className={`w-5 h-5 transition-colors ${
                  favoriteStatus?.isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500 group-hover/btn:text-red-500"
                }`}
              />
            )}
          </Button>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {hotel.rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({hotel.favoriteCount} {t("common.reviews")})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm text-muted-foreground">
              {hotel.favoriteCount.toLocaleString()} {t("common.favorites")}
            </span>
          </div>
        </div>
        <h3 className="font-semibold mb-1 line-clamp-1">{hotel.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {hotel.description}
        </p>
        <p className="text-muted-foreground text-sm">{hotel.address}</p>
      </div>
    </div>
  );
};
