import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "@/api/booking/booking.api";
import { format } from "date-fns";
import type { MyBookingItem } from "@/api/booking/types";
import { Calendar, CreditCard, Hotel } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingDetailModal } from "@/components/user/booking/BookingDetailModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const MyBookingPage = () => {
  const [selectedBooking, setSelectedBooking] = useState<MyBookingItem | null>(
    null
  );
  const { t } = useTranslation();

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: () => bookingApi.getMyBookings(),
  });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">
            {t("booking.myBookingPage.errorTitle")}
          </h2>
          <p className="text-muted-foreground">
            {t("booking.myBookingPage.errorDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Hotel className="h-6 w-6" />
              <h1 className="text-2xl font-bold">
                {t("booking.myBookingPage.title")}
              </h1>
            </div>
            <p className="text-muted-foreground mt-2">
              {t("booking.myBookingPage.description")}
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[15%]">
                  {t("booking.myBookingPage.columns.id")}
                </TableHead>
                <TableHead className="w-[20%]">
                  {t("booking.myBookingPage.columns.room")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("booking.myBookingPage.columns.checkIn")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("booking.myBookingPage.columns.checkOut")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("booking.myBookingPage.columns.status")}
                </TableHead>
                <TableHead className="w-[10%]">
                  {t("booking.myBookingPage.columns.payment")}
                </TableHead>
                <TableHead className="w-[10%] text-right">
                  {t("booking.myBookingPage.columns.total")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !bookings?.data || bookings.data.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("booking.myBookingPage.noBooking")}
                  </TableCell>
                </TableRow>
              ) : (
                bookings.data.map((booking) => (
                  <TableRow
                    key={booking._id}
                    className="hover:bg-transparent cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <TableCell className="py-4">
                      <span className="font-medium">#{booking._id}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        <Hotel className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          {t("booking.myBookingPage.columns.room")}{" "}
                          {booking.room.roomName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span>{format(booking.checkIn, "dd/MM/yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span>{format(booking.checkOut, "dd/MM/yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                            ? "secondary"
                            : booking.status === "cancelled"
                            ? "destructive"
                            : "outline"
                        }
                        className={`whitespace-nowrap
                          ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : ""
                          }
                          ${
                            booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : ""
                          }
                          ${
                            booking.status === "cancelled"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : ""
                          }
                          ${
                            booking.status === "completed"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : ""
                          }
                        `}
                      >
                        {t(`booking.myBookingPage.status.${booking.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          booking.paymentStatus === "paid"
                            ? "default"
                            : booking.paymentStatus === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="whitespace-nowrap"
                      >
                        {t(
                          `booking.myBookingPage.paymentStatus.${booking.paymentStatus}`
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <CreditCard className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(booking.finalPrice)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default MyBookingPage;
