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

interface LicenseSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

const LicenseSection = ({ form }: LicenseSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card p-6 rounded-lg space-y-6 dark:border dark:border-gray-800">
      <h2 className="text-xl font-semibold">
        {t("register_partner.license.title")}
      </h2>

      <FormField
        control={form.control}
        name="businessLicense"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.license.business_license")}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t(
                  "register_partner.license.business_license_placeholder"
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
        name="certifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.license.certifications")}
            </FormLabel>
            <FormDescription>
              {t("register_partner.license.certifications_desc")}
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder={t(
                  "register_partner.license.certifications_placeholder"
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
        name="certificateImages"
        render={({ field: { onChange, ...field } }) => (
          <FormItem>
            <FormLabel>
              {t("register_partner.license.certificate_images")}
            </FormLabel>
            <FormDescription>
              {t("register_partner.license.certificate_images_desc")}
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
    </div>
  );
};

export default LicenseSection;
