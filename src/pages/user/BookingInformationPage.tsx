import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BookingContactForm } from "@/components/user/booking/BookingContactForm";
import { BookingSpecialRequests } from "@/components/user/booking/BookingSpecialRequests";
import { BookingSummary } from "@/components/user/booking/BookingSummary";
import { bookingApi } from "@/api/booking/booking.api";
import type { ContactFormData, SpecialRequestsData } from "@/api/booking/types";
import { contactFormSchema, specialRequestsSchema } from "@/api/booking/types";
import { Skeleton } from "@/components/ui/skeleton";

const BookingInformationPage = () => {
  const { t } = useTranslation();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      bookingFor: "self",
    },
  });

  const specialRequestsForm = useForm<SpecialRequestsData>({
    resolver: zodResolver(specialRequestsSchema),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      const contactData = contactForm.getValues();
      const specialRequestsData = specialRequestsForm.getValues();

      if (!contactData) {
        throw new Error(t("booking.contactRequired"));
      }

      const bookingData = {
        roomId: roomId!,
        checkIn: searchParams.get("checkIn") || "",
        checkOut: searchParams.get("checkOut") || "",
        voucherId: searchParams.get("voucherId") || undefined,
        paymentMethod: "zalopay" as const,
        bookingFor: contactData.bookingFor,
        contactInfo: {
          name: contactData.contactName,
          email: contactData.email,
          phone: contactData.phone,
        },
        guestInfo:
          contactData.bookingFor === "other"
            ? {
                name: contactData.guestName || "",
                phone: contactData.phone,
              }
            : undefined,
        specialRequests: specialRequestsData
          ? {
              earlyCheckIn: specialRequestsData.earlyCheckIn,
              lateCheckOut: specialRequestsData.lateCheckOut,
              additionalRequests: specialRequestsData.additionalRequests,
            }
          : undefined,
      };

      return bookingApi.createBooking(bookingData);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(t("booking.success"));
        // Chuyển đến trang thanh toán
        window.location.href = response.paymentUrl.payUrl;
      } else {
        toast.error(t("booking.error"));
      }
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      toast.error(t("booking.error"));
    },
  });

  const handleBookingSubmit = async () => {
    // Validate contact form
    const contactResult = await contactForm.trigger();
    if (!contactResult) {
      toast.error(t("booking.contactRequired"));
      return;
    }

    // Validate special requests form if it has been touched
    if (specialRequestsForm.formState.isDirty) {
      const specialRequestsResult = await specialRequestsForm.trigger();
      if (!specialRequestsResult) {
        return;
      }
    }

    createBookingMutation.mutate();
  };

  if (createBookingMutation.isPending) {
    return (
      <div className="container mx-auto px-4 py-8 pt-32">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (createBookingMutation.isError) {
    return (
      <div className="container mx-auto px-4 py-8 pt-32 text-center">
        <h1 className="text-2xl font-bold mb-6 text-red-500">
          {t("booking.error")}
        </h1>
        <p className="text-muted-foreground">{t("booking.errorDescription")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <h1 className="text-2xl font-bold mb-6">{t("booking.pageTitle")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form điền thông tin */}
        <div className="lg:col-span-2 space-y-6">
          <BookingContactForm form={contactForm} />
          <BookingSpecialRequests form={specialRequestsForm} />
        </div>

        {/* Thông tin đặt phòng */}
        <div className="lg:col-span-1">
          <BookingSummary
            roomId={roomId!}
            searchParams={{
              hotelId: searchParams.get("hotelId") || "",
              checkIn: searchParams.get("checkIn") || "",
              checkOut: searchParams.get("checkOut") || "",
              capacity: parseInt(searchParams.get("capacity") || "1"),
            }}
            onSubmit={handleBookingSubmit}
            isSubmitting={createBookingMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingInformationPage;
