import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Slider } from "../../ui/slider";
import { Checkbox } from "../../ui/checkbox";
import { amenitiesApi } from "@/api/amenities/amenities.api";
import { Amenity } from "@/types/amenity";

interface FilterSectionProps {
  onPriceChange: (range: [number, number]) => void;
  onAmenitiesChange: (amenities: string[]) => void;
  onRoomTypeChange: (roomTypes: string[]) => void;
}

const ROOM_TYPES = ["Standard", "Superior", "Deluxe", "Suite", "Family"];

const FilterSection = ({
  onPriceChange,
  onAmenitiesChange,
  onRoomTypeChange,
}: FilterSectionProps) => {
  const { t } = useTranslation();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);

  useEffect(() => {
    amenitiesApi.getAmenities().then((res) => {
      setAmenities(res.data || []);
    });
  }, []);

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
  const handleRoomTypeChange = (roomType: string) => {
    setSelectedRoomType(roomType);
    onRoomTypeChange([roomType]);
  };

  // Xử lý chọn giá
  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    onPriceChange(value);
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

      {/* Room Type */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{t("filter.room_type")}</h3>
        {ROOM_TYPES.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`roomtype-${type}`}
              name="roomType"
              checked={selectedRoomType === type}
              onChange={() => handleRoomTypeChange(type)}
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
