import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaHeart, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { toast } from "sonner";

import { favouriteApi } from "@/api/favourite/favourite.api";
import { useAppSelector } from "@/store/hooks";

interface HotelHeaderProps {
  id: string;
  name: string;
  rating: number;
  totalReviews: number;
  address: string;
}

const HotelHeader = ({
  id,
  name,
  rating,
  totalReviews,
  address,
}: HotelHeaderProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  // Query để kiểm tra trạng thái yêu thích
  const { data: favoriteStatus, isLoading: isCheckingFavorite } = useQuery({
    queryKey: ["favorite", id],
    queryFn: () => favouriteApi.checkFavorite(id),
    enabled: isAuthenticated,
  });

  // Mutation để thêm/xóa yêu thích
  const { mutate: toggleFavorite, isPending: isToggling } = useMutation({
    mutationFn: async () => {
      if (favoriteStatus?.isFavorite) {
        return favouriteApi.removeFavorite(id);
      }
      return favouriteApi.addFavorite(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", id] });
      toast.success(
        favoriteStatus?.isFavorite
          ? "Đã xóa khách sạn khỏi danh sách yêu thích"
          : "Đã thêm khách sạn vào danh sách yêu thích"
      );
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
    },
  });

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }
    toggleFavorite();
  };

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">{name}</h1>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {Array.from({ length: Math.floor(rating) }).map((_, index) => (
              <FaStar key={index} className="text-yellow-400" />
            ))}
            {rating % 1 !== 0 && (
              <FaStar className="text-yellow-400 opacity-50" />
            )}
            <span className="ml-2 text-muted-foreground">
              {rating} ({totalReviews} Reviews)
            </span>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground">
          <FaMapMarkerAlt className="mr-2" />
          <span>{address}</span>
        </div>
      </div>
      {isAuthenticated && (
        <button
          onClick={handleToggleFavorite}
          disabled={isCheckingFavorite || isToggling}
          className="p-3 rounded-full bg-card shadow-md hover:shadow-lg transition-all duration-300 group relative"
        >
          {isCheckingFavorite || isToggling ? (
            <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
          ) : (
            <FaHeart
              className={`text-xl transition-colors duration-300 ${
                favoriteStatus?.isFavorite
                  ? "text-red-500"
                  : "text-muted group-hover:text-muted-foreground"
              }`}
            />
          )}
        </button>
      )}
    </div>
  );
};

export default HotelHeader;
