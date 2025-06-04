import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingGeneralInfo } from "./BookingGeneralInfo";
import { BookingCustomerInfo } from "./BookingCustomerInfo";
import { BookingActions } from "./BookingActions";
import type { Booking } from "@/types/booking";

interface BookingDetailsProps {
  booking: Booking;
  onApprove: (bookingId: string, note: string) => void;
  onReject: (bookingId: string, note: string) => void;
  onCancel: (bookingId: string, note: string) => void;
}

export function BookingDetails({
  booking,
  onApprove,
  onReject,
  onCancel,
}: BookingDetailsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <BookingGeneralInfo booking={booking} />

      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customer">
            {t("partner.bookings.customerInfo")}
          </TabsTrigger>
          <TabsTrigger value="actions">
            {t("partner.bookings.actions")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="mt-4">
          <BookingCustomerInfo booking={booking} />
        </TabsContent>

        <TabsContent value="actions" className="mt-4">
          <BookingActions
            bookingId={booking.id}
            status={booking.status}
            onApprove={onApprove}
            onReject={onReject}
            onCancel={onCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
