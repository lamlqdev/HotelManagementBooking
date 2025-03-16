import { useTranslation } from "react-i18next";
import { Slider } from "../../ui/slider";
import { Checkbox } from "../../ui/checkbox";
import { Star } from "lucide-react";

interface FilterSectionProps {
  onPriceChange: (range: [number, number]) => void;
  onStarChange: (stars: number[]) => void;
  onAmenitiesChange: (amenities: string[]) => void;
}

const FilterSection = ({
  onPriceChange,
  onStarChange,
  onAmenitiesChange,
}: FilterSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{t("filter.price_range")}</h3>
        <Slider
          defaultValue={[0, 5000000]}
          max={10000000}
          step={100000}
          onValueChange={(value) => onPriceChange(value as [number, number])}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0đ</span>
          <span>10,000,000đ</span>
        </div>
      </div>

      {/* Star Rating */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{t("filter.star_rating")}</h3>
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center space-x-2">
            <Checkbox
              id={`star-${star}`}
              onCheckedChange={(checked) => onStarChange(checked ? [star] : [])}
            />
            <label
              htmlFor={`star-${star}`}
              className="flex items-center space-x-1"
            >
              {Array(star)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
            </label>
          </div>
        ))}
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{t("filter.amenities")}</h3>
        {[
          "wifi",
          "pool",
          "parking",
          "restaurant",
          "gym",
          "spa",
          "beach_access",
          "room_service",
        ].map((amenity) => (
          <div key={amenity} className="flex items-center space-x-2">
            <Checkbox
              id={amenity}
              onCheckedChange={(checked) =>
                onAmenitiesChange(checked ? [amenity] : [])
              }
            />
            <label htmlFor={amenity}>{t(`amenities.${amenity}`)}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
