import { useAmenities } from "@/hooks/useAmenities";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getAmenityIcon } from "@/utils/amenityIcons";

interface AmenitiesSectionProps {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
}

const AmenitiesSection = ({
  selectedAmenities,
  onAmenitiesChange,
}: AmenitiesSectionProps) => {
  const { data: amenities, isLoading } = useAmenities();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-[200px]" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      </div>
    );
  }

  // Lọc chỉ lấy tiện ích khách sạn
  const hotelAmenities =
    amenities?.filter((amenity) => amenity.type === "hotel") || [];

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      onAmenitiesChange([...selectedAmenities, amenityId]);
    } else {
      onAmenitiesChange(selectedAmenities.filter((id) => id !== amenityId));
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {hotelAmenities.map((amenity) => (
        <div
          key={amenity._id}
          className="flex items-center space-x-2 p-3 bg-secondary/5 border border-border rounded-lg hover:bg-secondary/10 transition-colors"
        >
          <Checkbox
            id={amenity._id}
            checked={selectedAmenities.includes(amenity._id)}
            onCheckedChange={(checked) =>
              handleAmenityChange(amenity._id, checked as boolean)
            }
            className="border-primary"
          />
          <div className="flex items-center gap-2">
            {amenity.icon && getAmenityIcon(amenity.icon)}
            <Label
              htmlFor={amenity._id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {amenity.name}
            </Label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AmenitiesSection;
