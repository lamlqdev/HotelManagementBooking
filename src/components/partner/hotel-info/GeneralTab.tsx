import { useTranslation } from "react-i18next";
import {
  Camera,
  Building2,
  MapPin,
  FileText,
  Wifi,
  ParkingCircle,
  Snowflake,
  Wine,
  Lock,
  Sun,
  Waves,
  Dumbbell,
  Heart,
  Utensils,
  Coffee,
  Bell,
  Users,
  Briefcase,
  Presentation,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { GeneralTabProps } from "../../../types/hotel";

export function GeneralTab({
  hotel,
  isEditing,
  onInputChange,
  onAmenityToggle,
  availableAmenities,
}: GeneralTabProps) {
  const { t } = useTranslation();

  const getAmenityIcon = (icon: string) => {
    switch (icon) {
      case "wifi":
        return <Wifi className="w-5 h-5" />;
      case "parking":
        return <ParkingCircle className="w-5 h-5" />;
      case "elevator":
        return <Building2 className="w-5 h-5" />;
      case "air-conditioning":
        return <Snowflake className="w-5 h-5" />;
      case "minibar":
        return <Wine className="w-5 h-5" />;
      case "safe":
        return <Lock className="w-5 h-5" />;
      case "balcony":
        return <Sun className="w-5 h-5" />;
      case "ocean-view":
        return <Waves className="w-5 h-5" />;
      case "pool":
        return <Waves className="w-5 h-5" />;
      case "gym":
        return <Dumbbell className="w-5 h-5" />;
      case "spa":
        return <Heart className="w-5 h-5" />;
      case "tennis":
        return <Dumbbell className="w-5 h-5" />;
      case "restaurant":
        return <Utensils className="w-5 h-5" />;
      case "bar":
        return <Wine className="w-5 h-5" />;
      case "cafe":
        return <Coffee className="w-5 h-5" />;
      case "room-service":
        return <Bell className="w-5 h-5" />;
      case "meeting-room":
        return <Users className="w-5 h-5" />;
      case "business-center":
        return <Briefcase className="w-5 h-5" />;
      case "conference-hall":
        return <Presentation className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("hotelInfo.general.basicInfo")}</CardTitle>
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
              value={hotel.name}
              onChange={onInputChange}
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
              value={hotel.address}
              onChange={onInputChange}
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
              value={hotel.description}
              onChange={onInputChange}
              disabled={!isEditing}
              className="flex-1 min-h-[100px]"
              placeholder={t("hotelInfo.general.description")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("hotelInfo.general.images")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <Label className="text-base">
                {t("hotelInfo.general.mainImage")}
              </Label>
            </div>
            <div className="relative group">
              <img
                src={hotel.mainImage}
                alt={t("hotelInfo.general.mainImageAlt")}
                className="w-full h-[400px] object-cover rounded-lg border-2 border-border hover:border-primary/50 transition-all duration-300"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {t("hotelInfo.general.changeImage")}
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("hotelInfo.general.mainImageDesc")}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <Label className="text-base">
                {t("hotelInfo.general.galleryImages")}
              </Label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotel.galleryImages.map((image: string, index: number) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={image}
                    alt={t("hotelInfo.general.galleryImageAlt", {
                      index: index + 1,
                    })}
                    className="w-full h-full object-cover rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Camera className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {t("hotelInfo.general.addImage")}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("hotelInfo.general.galleryImagesDesc")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("hotelInfo.general.amenities")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Tiện nghi đã được chọn */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {t("hotelInfo.general.selectedAmenities")}
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableAmenities
                  .filter((amenity) => hotel.amenities.includes(amenity.id))
                  .map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center space-x-2 p-3 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <Checkbox
                        id={amenity.id}
                        checked={true}
                        onCheckedChange={() => onAmenityToggle(amenity.id)}
                        disabled={!isEditing}
                        className="border-primary"
                      />
                      <div className="flex items-center gap-2">
                        {getAmenityIcon(amenity.icon)}
                        <Label
                          htmlFor={amenity.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t(`hotelInfo.amenities.${amenity.id}`)}
                        </Label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tiện nghi chưa được chọn */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {t("hotelInfo.general.availableAmenities")}
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableAmenities
                  .filter((amenity) => !hotel.amenities.includes(amenity.id))
                  .map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center space-x-2 p-3 bg-secondary/5 border border-border rounded-lg hover:bg-secondary/10 transition-colors"
                    >
                      <Checkbox
                        id={amenity.id}
                        checked={false}
                        onCheckedChange={() => onAmenityToggle(amenity.id)}
                        disabled={!isEditing}
                      />
                      <div className="flex items-center gap-2">
                        {getAmenityIcon(amenity.icon)}
                        <Label
                          htmlFor={amenity.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t(`hotelInfo.amenities.${amenity.id}`)}
                        </Label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
