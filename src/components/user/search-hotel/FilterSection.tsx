import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Slider } from "../../ui/slider";
import { Checkbox } from "../../ui/checkbox";
import { Star } from "lucide-react";
import { amenitiesApi } from "@/api/amenities/amenities.api";
import { Amenity } from "@/types/amenity";

export interface FilterSectionProps {
  onPriceChange: (range: [number, number]) => void;
  onAmenitiesChange: (amenities: string[]) => void;
  onRoomTypeChange: (roomTypes: string[]) => void;
  onRatingChange: (range: [number, number]) => void;
  initialSelectedAmenities: string[];
  initialSelectedRoomTypes: string[];
  initialRatingRange?: [number, number];
}

const ROOM_TYPES = ["Standard", "Superior", "Deluxe", "Suite", "Family"];

const FilterSection = ({
  onPriceChange,
  onAmenitiesChange,
  onRoomTypeChange,
  onRatingChange,
  initialSelectedAmenities,
  initialSelectedRoomTypes,
  initialRatingRange = [0, 5],
}: FilterSectionProps) => {
  const { t } = useTranslation();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialSelectedAmenities
  );
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(
    initialSelectedRoomTypes
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [ratingRange, setRatingRange] =
    useState<[number, number]>(initialRatingRange);

  useEffect(() => {
    amenitiesApi.getAmenities().then((res) => {
      setAmenities(res.data || []);
    });
  }, []);

  useEffect(() => {
    setSelectedAmenities(initialSelectedAmenities);
  }, [initialSelectedAmenities]);

  useEffect(() => {
    setSelectedRoomTypes(initialSelectedRoomTypes);
  }, [initialSelectedRoomTypes]);

  useEffect(() => {
    setRatingRange(initialRatingRange);
  }, [initialRatingRange]);

  // Xử lý chọn tiện nghi
  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    let updated: string[];
    if (checked) {
      updated = [...selectedAmenities, amenityId];
    } else {
      updated = selectedAmenities.filter((id) => id !== amenityId);
    }
    setSelectedAmenities(updated);
    onAmenitiesChange(updated);
  };

  // Xử lý chọn loại phòng
  const handleRoomTypeChange = (roomType: string, checked: boolean) => {
    let updated: string[];
    if (checked) {
      updated = [...selectedRoomTypes, roomType];
    } else {
      updated = selectedRoomTypes.filter((type) => type !== roomType);
    }
    setSelectedRoomTypes(updated);
    onRoomTypeChange(updated);
  };

  // Xử lý chọn giá
  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    onPriceChange(value);
  };

  // Xử lý chọn đánh giá
  const handleRatingChange = (value: [number, number]) => {
    setRatingRange(value);
    onRatingChange(value);
  };

  // Render stars for rating display
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{t("filter.price_range")}</h3>
        <Slider
          defaultValue={priceRange}
          value={priceRange}
          max={10000000}
          step={100000}
          min={0}
          onValueChange={handlePriceChange}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0].toLocaleString()}đ</span>
          <span>{priceRange[1].toLocaleString()}đ</span>
        </div>
      </div>

      {/* Rating Range */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Đánh giá</h3>
        <Slider
          defaultValue={ratingRange}
          value={ratingRange}
          max={5}
          step={0.5}
          min={0}
          onValueChange={handleRatingChange}
        />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {renderStars(ratingRange[0])}
            <span>{ratingRange[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            {renderStars(ratingRange[1])}
            <span>{ratingRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Room Type */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{t("filter.room_type")}</h3>
        {ROOM_TYPES.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`roomtype-${type}`}
              checked={selectedRoomTypes.includes(type)}
              onCheckedChange={(checked) =>
                handleRoomTypeChange(type, Boolean(checked))
              }
            />
            <label htmlFor={`roomtype-${type}`}>
              {t(`filter.room_type_${type.toLowerCase()}`)}
            </label>
          </div>
        ))}
      </div>
      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{t("filter.amenities")}</h3>
        {amenities.map((amenity) => (
          <div key={amenity._id} className="flex items-center space-x-2">
            <Checkbox
              id={amenity._id}
              checked={selectedAmenities.includes(amenity._id)}
              onCheckedChange={(checked) =>
                handleAmenityChange(amenity._id, Boolean(checked))
              }
            />
            <label htmlFor={amenity._id}>{amenity.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
