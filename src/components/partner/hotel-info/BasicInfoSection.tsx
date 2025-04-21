import { Building2, MapPin, FileText, Globe, Map } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hotel } from "@/types/hotel";
import { Location } from "@/api/location/types";
import { locationApi } from "@/api/location/location.api";

interface BasicInfoSectionProps {
  hotel: Hotel;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
  editedData: {
    name?: string;
    description?: string;
    address?: string;
    website?: string;
    locationId?: string;
  };
  location?: Location;
}

export const BasicInfoSection = ({
  hotel,
  isEditing,
  onInputChange,
  editedData,
  location,
}: BasicInfoSectionProps) => {
  const { t } = useTranslation();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await locationApi.getLocations();
        if (response.success) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách địa điểm:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {t("hotelInfo.general.basicInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-[180px]">
            <Building2 className="w-4 h-4" />
            <Label htmlFor="name">{t("hotelInfo.general.name")}</Label>
          </div>
          <Input
            id="name"
            name="name"
            value={editedData.name ?? hotel.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            disabled={!isEditing}
            className="flex-1"
            placeholder={t("hotelInfo.general.name")}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-[180px]">
            <MapPin className="w-4 h-4" />
            <Label htmlFor="address">{t("hotelInfo.general.address")}</Label>
          </div>
          <Input
            id="address"
            name="address"
            value={editedData.address ?? hotel.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            disabled={!isEditing}
            className="flex-1"
            placeholder={t("hotelInfo.general.address")}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-[180px]">
            <Map className="w-4 h-4" />
            <Label htmlFor="location">{t("hotelInfo.general.location")}</Label>
          </div>
          {isEditing ? (
            <Select
              onValueChange={(value) => onInputChange("locationId", value)}
              defaultValue={editedData.locationId ?? hotel.locationId}
              disabled={isLoadingLocations}
            >
              <SelectTrigger className="flex-1">
                <SelectValue
                  placeholder={t("hotelInfo.general.location_placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc._id} value={loc._id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="location"
              name="location"
              value={location?.name || ""}
              disabled={true}
              className="flex-1"
              placeholder={t("hotelInfo.general.location")}
            />
          )}
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2 w-[180px] pt-2">
            <FileText className="w-4 h-4" />
            <Label htmlFor="description">
              {t("hotelInfo.general.description")}
            </Label>
          </div>
          <Textarea
            id="description"
            name="description"
            value={editedData.description ?? hotel.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            disabled={!isEditing}
            className="flex-1 min-h-[100px]"
            placeholder={t("hotelInfo.general.description")}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-[180px]">
            <Globe className="w-4 h-4" />
            <Label htmlFor="website">{t("hotelInfo.general.website")}</Label>
          </div>
          <Input
            id="website"
            name="website"
            value={editedData.website ?? hotel.website}
            onChange={(e) => onInputChange("website", e.target.value)}
            disabled={!isEditing}
            className="flex-1"
            placeholder={t("hotelInfo.general.website")}
          />
        </div>
      </CardContent>
    </Card>
  );
};
