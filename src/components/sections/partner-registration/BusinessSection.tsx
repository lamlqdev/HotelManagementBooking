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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PartnerFormData } from "@/api/partner/types";

interface BusinessSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

const BusinessSection = ({ form }: BusinessSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card p-6 rounded-lg space-y-6 dark:border dark:border-gray-800">
      <h2 className="text-xl font-semibold">
        {t("register_partner.business_info.title")}
      </h2>

      <FormField
        control={form.control}
        name="priceRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.business_info.price_range")}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="dark:border-gray-700 focus:dark:border-primary">
                  <SelectValue
                    placeholder={t(
                      "register_partner.business_info.price_range_placeholder"
                    )}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="budget">
                  {t("register_partner.business_info.price_ranges.budget")}
                </SelectItem>
                <SelectItem value="economic">
                  {t("register_partner.business_info.price_ranges.economic")}
                </SelectItem>
                <SelectItem value="mid_range">
                  {t("register_partner.business_info.price_ranges.mid_range")}
                </SelectItem>
                <SelectItem value="luxury">
                  {t("register_partner.business_info.price_ranges.luxury")}
                </SelectItem>
                <SelectItem value="ultra_luxury">
                  {t(
                    "register_partner.business_info.price_ranges.ultra_luxury"
                  )}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="targetGuests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.business_info.target_guests")}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="dark:border-gray-700 focus:dark:border-primary">
                  <SelectValue
                    placeholder={t(
                      "register_partner.business_info.target_guests_placeholder"
                    )}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="business">
                  {t("register_partner.business_info.guest_types.business")}
                </SelectItem>
                <SelectItem value="family">
                  {t("register_partner.business_info.guest_types.family")}
                </SelectItem>
                <SelectItem value="couples">
                  {t("register_partner.business_info.guest_types.couples")}
                </SelectItem>
                <SelectItem value="backpackers">
                  {t("register_partner.business_info.guest_types.backpackers")}
                </SelectItem>
                <SelectItem value="groups">
                  {t("register_partner.business_info.guest_types.groups")}
                </SelectItem>
                <SelectItem value="all">
                  {t("register_partner.business_info.guest_types.all")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="businessDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.business_info.description")}
            </FormLabel>
            <FormDescription>
              {t("register_partner.business_info.description_desc")}
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder={t(
                  "register_partner.business_info.description_placeholder"
                )}
                className="min-h-[150px] dark:border-gray-700 focus:dark:border-primary"
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

export default BusinessSection;
