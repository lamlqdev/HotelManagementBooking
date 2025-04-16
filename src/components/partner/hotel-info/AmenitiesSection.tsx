import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Hotel } from "@/types/hotel";
import { Amenity } from "@/types/amenity";
import { getAmenityIcon } from "@/utils/amenityIcons";

interface AmenitiesSectionProps {
  hotel: Hotel;
  isEditing: boolean;
  availableAmenities: Amenity[];
  editedData: {
    amenities?: string[];
  };
  onAmenityToggle: (amenityId: string) => void;
}

export const AmenitiesSection = ({
  hotel,
  isEditing,
  availableAmenities,
  editedData,
  onAmenityToggle,
}: AmenitiesSectionProps) => {
  const { t } = useTranslation();

  const selectedAmenities = availableAmenities.filter((amenity) =>
    (editedData.amenities || hotel.amenities || []).includes(amenity._id)
  );

  const unselectedAmenities = availableAmenities.filter(
    (amenity) =>
      !(editedData.amenities || hotel.amenities || []).includes(amenity._id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {t("hotelInfo.general.amenities")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t("hotelInfo.general.selectedAmenities")}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedAmenities.map((amenity) => (
                <div
                  key={amenity._id}
                  className="flex items-center space-x-2 p-3 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <Checkbox
                    id={amenity._id}
                    checked={true}
                    onCheckedChange={() => onAmenityToggle(amenity._id)}
                    disabled={!isEditing}
                    className="border-primary"
                  />
                  <div className="flex items-center gap-2">
                    {getAmenityIcon(amenity.icon || "default-icon")}
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
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t("hotelInfo.general.availableAmenities")}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {unselectedAmenities.map((amenity) => (
                <div
                  key={amenity._id}
                  className="flex items-center space-x-2 p-3 bg-secondary/5 border border-border rounded-lg hover:bg-secondary/10 transition-colors"
                >
                  <Checkbox
                    id={amenity._id}
                    checked={false}
                    onCheckedChange={() => onAmenityToggle(amenity._id)}
                    disabled={!isEditing}
                  />
                  <div className="flex items-center gap-2">
                    {getAmenityIcon(amenity.icon || "default-icon")}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
