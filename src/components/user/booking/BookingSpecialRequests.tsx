import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import type { SpecialRequestsData } from "@/api/booking/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

interface BookingSpecialRequestsProps {
  form: UseFormReturn<SpecialRequestsData>;
}

export const BookingSpecialRequests = ({
  form,
}: BookingSpecialRequestsProps) => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  useEffect(() => {
    setValue("earlyCheckIn", false);
    setValue("lateCheckOut", false);
  }, [setValue]);

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2 text-card-foreground">
        {t("booking.specialRequests.title")}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {t("booking.specialRequests.description")}
      </p>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("booking.specialRequests.checkInOut.title")}
          </label>
          <div className="space-y-4">
            <div className="flex gap-8">
              <div className="flex-1 space-y-2">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    onCheckedChange={(checked) => {
                      setValue("earlyCheckIn", checked === true);
                    }}
                    className="dark:border-2 dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground"
                  />
                  <span>
                    {t("booking.specialRequests.checkInOut.earlyCheckIn")}
                  </span>
                </label>
              </div>

              <div className="flex-1 space-y-2">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    onCheckedChange={(checked) => {
                      setValue("lateCheckOut", checked === true);
                    }}
                    className="dark:border-2 dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground"
                  />
                  <span>
                    {t("booking.specialRequests.checkInOut.lateCheckOut")}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("booking.specialRequests.other.label")}
          </label>
          <Textarea
            {...register("additionalRequests")}
            placeholder={t("booking.specialRequests.other.placeholder")}
            rows={4}
            className="dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
          />
          {errors.additionalRequests && (
            <p className="text-sm text-red-500 mt-1">
              {errors.additionalRequests.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
