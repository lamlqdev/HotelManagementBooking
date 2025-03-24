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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PartnerFormData } from "@/api/partner/types";

import FileUpload from "./FileUpload";

interface HotelInfoSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

const HotelInfoSection = ({ form }: HotelInfoSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card p-6 rounded-lg space-y-6 dark:border dark:border-gray-800">
      <h2 className="text-xl font-semibold">
        {t("register_partner.hotel_info.title")}
      </h2>

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
        name="starRating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.hotel_info.star_rating")}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="dark:border-gray-700 focus:dark:border-primary">
                  <SelectValue
                    placeholder={t(
                      "register_partner.hotel_info.star_rating_placeholder"
                    )}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">
                  {t("register_partner.hotel_info.star_rating_1")}
                </SelectItem>
                <SelectItem value="2">
                  {t("register_partner.hotel_info.star_rating_2")}
                </SelectItem>
                <SelectItem value="3">
                  {t("register_partner.hotel_info.star_rating_3")}
                </SelectItem>
                <SelectItem value="4">
                  {t("register_partner.hotel_info.star_rating_4")}
                </SelectItem>
                <SelectItem value="5">
                  {t("register_partner.hotel_info.star_rating_5")}
                </SelectItem>
                <SelectItem value="unrated">
                  {t("register_partner.hotel_info.star_rating_unrated")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="roomCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.hotel_info.room_count")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t(
                  "register_partner.hotel_info.room_count_placeholder"
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
        name="hotelAmenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.hotel_info.amenities")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t(
                  "register_partner.hotel_info.amenities_placeholder"
                )}
                className="min-h-[100px] dark:border-gray-700 focus:dark:border-primary"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hotelImages"
        render={({ field: { onChange, ...field } }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.hotel_info.hotel_images")}
            </FormLabel>
            <FormDescription>
              {t("register_partner.hotel_info.hotel_images_desc")}
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
        name="businessType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.hotel_info.business_type")}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="dark:border-gray-700 focus:dark:border-primary">
                  <SelectValue
                    placeholder={t(
                      "register_partner.hotel_info.business_type_placeholder"
                    )}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="corporation">Công ty cổ phần</SelectItem>
                <SelectItem value="limited">
                  {t("register_partner.hotel_info.business_type_limited")}
                </SelectItem>
                <SelectItem value="private">
                  {t("register_partner.hotel_info.business_type_private")}
                </SelectItem>
                <SelectItem value="other">
                  {t("register_partner.hotel_info.business_type_other")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="taxId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.hotel_info.tax_id")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(
                  "register_partner.hotel_info.tax_id_placeholder"
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
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.hotel_info.website")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(
                  "register_partner.hotel_info.website_placeholder"
                )}
                className="dark:border-gray-700 focus:dark:border-primary"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default HotelInfoSection;
