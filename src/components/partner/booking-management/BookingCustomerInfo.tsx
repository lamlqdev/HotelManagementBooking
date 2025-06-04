import { useTranslation } from "react-i18next";
import { Mail, Phone, User } from "lucide-react";
import type { Booking } from "@/types/booking";

interface BookingCustomerInfoProps {
  booking: Booking;
}

export function BookingCustomerInfo({ booking }: BookingCustomerInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center gap-3 p-3 bg-background rounded-md shadow-sm">
        <div className="bg-primary/10 p-2 rounded-full">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">
            {t("partner.bookings.customerName")}
          </div>
          <div className="font-medium">{booking.contactInfo.name}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-background rounded-md shadow-sm">
        <div className="bg-primary/10 p-2 rounded-full">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">
            {t("partner.bookings.customerEmail")}
          </div>
          <div className="font-medium">{booking.contactInfo.email}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-background rounded-md shadow-sm">
        <div className="bg-primary/10 p-2 rounded-full">
          <Phone className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">
            {t("partner.bookings.customerPhone")}
          </div>
          <div className="font-medium">{booking.contactInfo.phone}</div>
        </div>
      </div>
    </div>
  );
}
