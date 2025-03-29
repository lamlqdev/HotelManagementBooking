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

interface PoliciesSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

const PoliciesSection = ({ form }: PoliciesSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="checkInTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("register_partner.policies.check_in_time")}
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
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
          name="checkOutTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("register_partner.policies.check_out_time")}
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
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
        name="cancellationPolicy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.policies.cancellation")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t(
                  "register_partner.policies.cancellation_placeholder"
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
        name="childrenPolicy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.policies.children")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t(
                  "register_partner.policies.children_placeholder"
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
        name="petPolicy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.policies.pets")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("register_partner.policies.pets_placeholder")}
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
        name="smokingPolicy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.policies.smoking")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("register_partner.policies.smoking_placeholder")}
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

export default PoliciesSection;
