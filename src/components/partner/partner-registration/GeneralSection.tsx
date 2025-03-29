import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Wifi,
  ParkingCircle,
  Building2,
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

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { PartnerFormData, availableAmenities } from "@/api/partner/types";

import FileUpload from "./FileUpload";
import AddressSection from "./AddressSection";

interface HotelInfoSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

const HotelInfoSection = ({ form }: HotelInfoSectionProps) => {
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
      <FormField
        control={form.control}
        name="hotelName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.hotel_info.hotel_name")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(
                  "register_partner.hotel_info.hotel_name_placeholder"
                )}
                className="dark:border-gray-700 focus:dark:border-primary"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.hotel_info.description")}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={t(
                  "register_partner.hotel_info.description_placeholder"
                )}
                className="min-h-[100px] dark:border-gray-700 focus:dark:border-primary"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AddressSection form={form} />

      <FormField
        control={form.control}
        name="mainImage"
        render={({ field: { onChange, ...field } }) => (
          <FormItem>
            <FormLabel>{t("register_partner.hotel_info.main_image")}</FormLabel>
            <FormDescription>
              {t("register_partner.hotel_info.main_image_desc")}
            </FormDescription>
            <FormControl>
              <FileUpload
                onChange={onChange}
                accept="image/*"
                multiple={false}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="galleryImages"
        render={({ field: { onChange, ...field } }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.hotel_info.gallery_images")}
            </FormLabel>
            <FormDescription>
              {t("register_partner.hotel_info.gallery_images_desc")}
            </FormDescription>
            <FormControl>
              <FileUpload
                onChange={onChange}
                accept="image/*"
                multiple
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.hotel_info.amenities")}</FormLabel>
            <FormDescription>
              {t("register_partner.hotel_info.amenities_desc")}
            </FormDescription>
            <FormControl>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center space-x-2 p-3 bg-secondary/5 border border-border rounded-lg hover:bg-secondary/10 transition-colors"
                  >
                    <Checkbox
                      id={amenity.id}
                      checked={field.value.includes(amenity.id)}
                      onCheckedChange={(checked) => {
                        const currentValue = field.value || [];
                        if (checked) {
                          field.onChange([...currentValue, amenity.id]);
                        } else {
                          field.onChange(
                            currentValue.filter((id) => id !== amenity.id)
                          );
                        }
                      }}
                      className="border-primary"
                    />
                    <div className="flex items-center gap-2">
                      {getAmenityIcon(amenity.icon)}
                      <Label
                        htmlFor={amenity.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default HotelInfoSection;
