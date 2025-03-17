import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

interface HotelInfoProps {
  name: string;
  rating: number;
  reviews: number;
  address: string;
  image: string;
}

export const HotelInfo = ({
  name,
  rating,
  reviews,
  address,
  image,
}: HotelInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="relative h-48 rounded-lg overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg text-card-foreground">{name}</h3>
        <div className="flex items-center gap-2">
          <FaStar className="text-primary" />
          <span className="text-sm font-medium text-card-foreground">
            {rating}
          </span>
          <span className="text-sm text-muted-foreground">
            ({reviews} đánh giá)
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FaMapMarkerAlt className="text-primary" />
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
};
