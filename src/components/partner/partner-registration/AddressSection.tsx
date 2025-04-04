import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { PartnerFormData } from "@/api/partner/types";

interface AddressSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

const AddressSection = ({ form }: AddressSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="hotelAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.address.address")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("register_partner.address.address_placeholder")}
                className="dark:border-gray-700 focus:dark:border-primary"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="hotelLocationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("register_partner.address.tourist_spot")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    "register_partner.address.tourist_spot_placeholder"
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

      <FormField
        control={form.control}
        name="hotelLocationDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.address.location_desc")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t(
                  "register_partner.address.location_desc_placeholder"
                )}
                className="min-h-[100px] dark:border-gray-700 focus:dark:border-primary"
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

export default AddressSection;
