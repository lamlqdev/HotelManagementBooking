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
    <div className="space-y-6">
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

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.contact_info.website")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t(
                  "register_partner.contact_info.website_placeholder"
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

export default ContactSection;
