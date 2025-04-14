import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { PartnerFormData } from "@/api/partner/types";
import { locationApi } from "@/api/location/location.api";
import { Location } from "@/api/location/type";

interface AddressSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

const AddressSection = ({ form }: AddressSectionProps) => {
  const { t } = useTranslation();

  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await locationApi.getLocations();
        if (response.success) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách địa điểm:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="locationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("register_partner.address.location")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoadingLocations}
            >
              <FormControl>
                <SelectTrigger className="dark:border-gray-700 focus:dark:border-primary">
                  <SelectValue
                    placeholder={t(
                      "register_partner.address.location_placeholder"
                    )}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location._id} value={location._id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
