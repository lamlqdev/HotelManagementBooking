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

import { PartnerFormData } from "@/api/partner/types";

interface ContactSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

const ContactSection = ({ form }: ContactSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card p-6 rounded-lg space-y-6 dark:border dark:border-gray-800">
      <h2 className="text-xl font-semibold">
        {t("register_partner.contact_info.title")}
      </h2>

      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.contact_info.name")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(
                  "register_partner.contact_info.name_placeholder"
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
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.contact_info.position")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(
                  "register_partner.contact_info.position_placeholder"
                )}
                className="dark:border-gray-700 focus:dark:border-primary"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("register_partner.contact_info.email")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    "register_partner.contact_info.email_placeholder"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("register_partner.contact_info.phone")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    "register_partner.contact_info.phone_placeholder"
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
    </div>
  );
};

export default ContactSection;
