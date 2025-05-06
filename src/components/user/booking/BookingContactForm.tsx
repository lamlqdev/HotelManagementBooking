import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import type { ContactFormData } from "@/api/booking/types";
import { useAppSelector } from "@/store/hooks";

interface BookingContactFormProps {
  form: UseFormReturn<ContactFormData>;
}

export const BookingContactForm = ({ form }: BookingContactFormProps) => {
  const { t } = useTranslation();
  const [bookingFor, setBookingFor] = useState<"self" | "other">("self");
  const user = useAppSelector((state) => state.auth.user);

  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  useEffect(() => {
    if (bookingFor === "self" && user) {
      setValue("contactName", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
    }
  }, [bookingFor, user, setValue]);

  const handleBookingForChange = (value: "self" | "other") => {
    setBookingFor(value);
    setValue("bookingFor", value);

    if (value === "other") {
      setValue("contactName", "");
      setValue("email", "");
      setValue("phone", "");
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2 text-card-foreground">
        {t("booking.contactInfo.title")}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {t("booking.contactInfo.description")}
      </p>
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t("booking.contactInfo.bookingFor.label")}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={bookingFor === "self"}
                onCheckedChange={() => handleBookingForChange("self")}
                className="dark:border-2 dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground"
              />
              <span>{t("booking.contactInfo.bookingFor.self")}</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={bookingFor === "other"}
                onCheckedChange={() => handleBookingForChange("other")}
                className="dark:border-2 dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground"
              />
              <span>{t("booking.contactInfo.bookingFor.other")}</span>
            </label>
          </div>
        </div>

        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-muted-foreground" />
          <Input
            {...register("contactName")}
            placeholder={t("booking.contactInfo.contactName")}
            className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
          />
          {errors.contactName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.contactName.message}
            </p>
          )}
        </div>

        <div className="relative">
          <FaEnvelope className="absolute top-3 left-3 text-muted-foreground" />
          <Input
            {...register("email")}
            placeholder={t("booking.contactInfo.email")}
            className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <FaPhone className="absolute top-3 left-3 text-muted-foreground" />
          <Input
            {...register("phone")}
            placeholder={t("booking.contactInfo.phone")}
            className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};
