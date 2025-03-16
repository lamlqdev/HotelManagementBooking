import { FaHeart, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { useState } from "react";

interface HotelHeaderProps {
  name: string;
  rating: number;
  totalReviews: number;
  address: string;
}

const HotelHeader = ({
  name,
  rating,
  totalReviews,
  address,
}: HotelHeaderProps) => {
  const [isLiked, setIsLiked] = useState(false);

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
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="p-3 rounded-full bg-card shadow-md hover:shadow-lg transition-all duration-300 group"
      >
        <FaHeart
          className={`text-xl transition-colors duration-300 ${
            isLiked
              ? "text-red-500"
              : "text-muted group-hover:text-muted-foreground"
          }`}
        />
      </button>
    </div>
  );
};

export default HotelHeader;
