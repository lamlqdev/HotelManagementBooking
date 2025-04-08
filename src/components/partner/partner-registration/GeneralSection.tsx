import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

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

import { PartnerFormData } from "@/api/partner/types";

import FileUpload from "./FileUpload";
import AddressSection from "./AddressSection";
import AmenitiesSection from "./AmenitiesSection";

interface GeneralSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

const GeneralSection = ({ form }: GeneralSectionProps) => {
  const { t } = useTranslation();

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
        name="hotelDescription"
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
        name="featuredImage"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>{t("register_partner.hotel_info.main_image")}</FormLabel>
            <FormDescription>
              {t("register_partner.hotel_info.main_image_desc")}
            </FormDescription>
            <FormControl>
              <FileUpload
                onChange={(files) => onChange(files as File)}
                accept="image/*"
                multiple={false}
                value={value}
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
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.hotel_info.gallery_images")}
            </FormLabel>
            <FormDescription>
              {t("register_partner.hotel_info.gallery_images_desc")}
            </FormDescription>
            <FormControl>
              <FileUpload
                onChange={(files) => onChange(files as File[])}
                accept="image/*"
                multiple
                value={value}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hotelAmenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.hotel_info.amenities")}</FormLabel>
            <FormDescription>
              {t("register_partner.hotel_info.amenities_desc")}
            </FormDescription>
            <FormControl>
              <AmenitiesSection
                selectedAmenities={field.value}
                onAmenitiesChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default GeneralSection;
