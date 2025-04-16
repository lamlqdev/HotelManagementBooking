import { Building2, MapPin, FileText, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Hotel } from "@/types/hotel";

interface BasicInfoSectionProps {
  hotel: Hotel;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
  editedData: {
    name?: string;
    description?: string;
    address?: string;
    website?: string;
  };
}

export const BasicInfoSection = ({
  hotel,
  isEditing,
  onInputChange,
  editedData,
}: BasicInfoSectionProps) => {
  const { t } = useTranslation();

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
