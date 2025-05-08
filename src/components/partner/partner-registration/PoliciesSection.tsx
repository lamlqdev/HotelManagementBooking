import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { PartnerFormData } from "@/api/partner/types";
import {
  generateTimeOptions,
  formatTimeDisplay,
  getTimeSelectPlaceholder,
} from "@/utils/timeUtils";

interface PoliciesSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

interface PolicyRadioGroupProps {
  label: string;
  name: keyof PartnerFormData;
  options: { value: string; label: string }[];
  form: UseFormReturn<PartnerFormData>;
}

const PolicyRadioGroup = ({
  label,
  name,
  options,
  form,
}: PolicyRadioGroupProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value?.toString() || ""}
              className="flex flex-col space-y-2 mt-2"
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const PoliciesSection = ({ form }: PoliciesSectionProps) => {
  const { t } = useTranslation();
  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Chính sách khách sạn</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="checkInTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("register_partner.policies.check_in_time")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="dark:border-gray-700 focus:dark:border-primary">
                      <SelectValue
                        placeholder={getTimeSelectPlaceholder("check-in")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTimeDisplay(time)}
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
            name="checkOutTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("register_partner.policies.check_out_time")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="dark:border-gray-700 focus:dark:border-primary">
                      <SelectValue
                        placeholder={getTimeSelectPlaceholder("check-out")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTimeDisplay(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <FormLabel>
                {t("register_partner.policies.cancellation")}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="dark:border-gray-700 focus:dark:border-primary">
                    <SelectValue placeholder="Chọn chính sách hủy phòng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="24h-full-refund">
                    Hoàn tiền 100% nếu hủy trước 24h
                  </SelectItem>
                  <SelectItem value="24h-half-refund">
                    Hoàn tiền 50% nếu hủy trước 24h
                  </SelectItem>
                  <SelectItem value="no-refund">
                    Không hoàn tiền khi hủy
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <PolicyRadioGroup
          label={t("register_partner.policies.children")}
          name="childrenPolicy"
          options={[
            { value: "yes", label: "Cho phép trẻ em" },
            { value: "no", label: "Không cho phép trẻ em" },
          ]}
          form={form}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PolicyRadioGroup
            label={t("register_partner.policies.pets")}
            name="petPolicy"
            options={[
              { value: "yes", label: "Cho phép mang thú cưng" },
              { value: "no", label: "Không cho phép mang thú cưng" },
            ]}
            form={form}
          />

          <PolicyRadioGroup
            label={t("register_partner.policies.smoking")}
            name="smokingPolicy"
            options={[
              { value: "yes", label: "Cho phép hút thuốc" },
              { value: "no", label: "Không cho phép hút thuốc" },
            ]}
            form={form}
          />
        </div>
      </div>
    </div>
  );
};

export default PoliciesSection;
