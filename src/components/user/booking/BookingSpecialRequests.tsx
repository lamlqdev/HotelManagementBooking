import { useState } from "react";
import { FaClock } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import type { SpecialRequestsData } from "@/api/booking/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingSpecialRequestsProps {
  form: UseFormReturn<SpecialRequestsData>;
}

export const BookingSpecialRequests = ({
  form,
}: BookingSpecialRequestsProps) => {
  const { t } = useTranslation();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const {
    register,
    formState: { errors },
  } = form;

  // Tạo mảng các thời gian từ 00:00 đến 23:45, mỗi 15 phút
  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4)
      .toString()
      .padStart(2, "0");
    const minute = ((i % 4) * 15).toString().padStart(2, "0");
    return `${hour}:${minute}`;
  });

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
                    checked={showCheckIn}
                    onCheckedChange={(checked) => {
                      setShowCheckIn(checked === true);
                      if (!checked) setCheckInTime("");
                    }}
                    className="dark:border-2 dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground"
                  />
                  <span>
                    {t("booking.specialRequests.checkInOut.checkIn.label")}
                  </span>
                </label>
                {showCheckIn && (
                  <div className="relative">
                    <FaClock className="absolute top-3 left-3 text-muted-foreground" />
                    <Select
                      value={checkInTime}
                      onValueChange={(value) => {
                        setCheckInTime(value);
                        register("checkInTime").onChange({ target: { value } });
                      }}
                    >
                      <SelectTrigger className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground">
                        <SelectValue
                          placeholder={t(
                            "booking.specialRequests.checkInOut.checkIn.placeholder"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.checkInTime && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.checkInTime.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={showCheckOut}
                    onCheckedChange={(checked) => {
                      setShowCheckOut(checked === true);
                      if (!checked) setCheckOutTime("");
                    }}
                    className="dark:border-2 dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground"
                  />
                  <span>
                    {t("booking.specialRequests.checkInOut.checkOut.label")}
                  </span>
                </label>
                {showCheckOut && (
                  <div className="relative">
                    <FaClock className="absolute top-3 left-3 text-muted-foreground" />
                    <Select
                      value={checkOutTime}
                      onValueChange={(value) => {
                        setCheckOutTime(value);
                        register("checkOutTime").onChange({
                          target: { value },
                        });
                      }}
                    >
                      <SelectTrigger className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground">
                        <SelectValue
                          placeholder={t(
                            "booking.specialRequests.checkInOut.checkOut.placeholder"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.checkOutTime && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.checkOutTime.message}
                      </p>
                    )}
                  </div>
                )}
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
