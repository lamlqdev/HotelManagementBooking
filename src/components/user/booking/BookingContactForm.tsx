import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

interface BookingContactFormData {
  bookingFor: "self" | "other";
  guestName?: string;
  contactName: string;
  email: string;
  phone: string;
}

export const BookingContactForm = () => {
  const { t } = useTranslation();
  const [bookingFor, setBookingFor] = useState<"self" | "other">("self");
  const { register, handleSubmit } = useForm<BookingContactFormData>();

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
                onCheckedChange={() => setBookingFor("self")}
                className="dark:border-2 dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground"
              />
              <span>{t("booking.contactInfo.bookingFor.self")}</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={bookingFor === "other"}
                onCheckedChange={() => setBookingFor("other")}
                className="dark:border-2 dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground"
              />
              <span>{t("booking.contactInfo.bookingFor.other")}</span>
            </label>
          </div>
        </div>

        {bookingFor === "other" && (
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-muted-foreground" />
            <Input
              {...register("guestName", { required: true })}
              placeholder={t("booking.contactInfo.guestName")}
              className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
            />
          </div>
        )}

        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-muted-foreground" />
          <Input
            {...register("contactName", { required: true })}
            placeholder={t("booking.contactInfo.contactName")}
            className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
          />
        </div>

        <div className="relative">
          <FaEnvelope className="absolute top-3 left-3 text-muted-foreground" />
          <Input
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+$/i,
            })}
            placeholder={t("booking.contactInfo.email")}
            className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
          />
        </div>

        <div className="relative">
          <FaPhone className="absolute top-3 left-3 text-muted-foreground" />
          <Input
            {...register("phone", { required: true })}
            placeholder={t("booking.contactInfo.phone")}
            className="pl-10 dark:border-2 dark:border-primary/30 dark:hover:border-primary/50 dark:focus:border-primary dark:focus:ring-2 dark:focus:ring-primary/20 dark:text-foreground dark:placeholder:text-muted-foreground"
          />
        </div>
      </form>
    </div>
  );
};
