import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RefreshCw,
  User,
  Eye,
  Repeat,
  CheckCircle,
  Clock,
  XCircle,
  BadgeCheck,
} from "lucide-react";
import { bookingApi } from "@/api/booking/booking.api";
import { BookingListItem } from "@/api/booking/types";
import { format } from "date-fns";
import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export default function BookingOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { currentHotel } = useAppSelector((state) => state.hotel);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null
  );

  const { data, isLoading } = useQuery({
    queryKey: ["partner-bookings", search, status, currentPage],
    queryFn: async () => {
      if (!currentHotel?._id)
        return { data: [], pagination: { totalPages: 1 } };
      const res = await bookingApi.getMyHotelBookings({
        page: currentPage,
        limit: 5,
        status: status === "all" ? undefined : status,
        hotelId: currentHotel?._id,
      });
      return res;
    },
  });

  const bookings: BookingListItem[] = useMemo(
    () => (data && "data" in data ? data.data : []),
    [data]
  );
  const totalPages =
    data && "pagination" in data && data.pagination?.totalPages
      ? data.pagination.totalPages
      : 1;

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setCurrentPage(1);
  };

  // Lọc client-side theo search (nếu backend chưa hỗ trợ)
  const filteredBookings = useMemo(
    () =>
      bookings.filter((b) => {
        const s = search.trim().toLowerCase();
        if (!s) return true;
        return (
          b.contactInfo?.name?.toLowerCase().includes(s) ||
          b.contactInfo?.email?.toLowerCase().includes(s) ||
          b.contactInfo?.phone?.toLowerCase().includes(s)
        );
      }),
    [bookings, search]
  );

  // Badge trạng thái
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            {t("partner.bookings.statusBadge_pending")}
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {t("partner.bookings.statusBadge_confirmed")}
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {t("partner.bookings.statusBadge_completed")}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            {t("partner.bookings.statusBadge_cancelled")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: "pending" | "confirmed" | "completed" | "cancelled";
    }) => {
      setUpdatingBookingId(bookingId);
      await bookingApi.updateBookingStatus(bookingId, { status });
    },
    onSuccess: () => {
      toast.success(t("partner.bookings.updateStatusSuccess"));
      queryClient.invalidateQueries({ queryKey: ["partner-bookings"] });
      setUpdatingBookingId(null);
    },
    onError: () => {
      toast.error(t("partner.bookings.updateStatusError"));
      setUpdatingBookingId(null);
    },
  });

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-6 w-6" />
                <h1 className="text-2xl font-bold">
                  {t("partner.bookings.ordersTitle")}
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">
              {t("partner.bookings.ordersDesc")}
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("partner.bookings.searchPlaceholder")}
                  className="pl-9"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Button variant="outline" onClick={handleResetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("partner.bookings.resetFilters")}
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">
                  {t("partner.bookings.status")}
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t("partner.bookings.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t("partner.bookings.table.id")}</TableHead>
                <TableHead>{t("partner.bookings.table.customer")}</TableHead>
                <TableHead>{t("partner.bookings.table.hotel")}</TableHead>
                <TableHead>{t("partner.bookings.table.room")}</TableHead>
                <TableHead>{t("partner.bookings.table.dates")}</TableHead>
                <TableHead>{t("partner.bookings.table.finalPrice")}</TableHead>
                <TableHead>{t("partner.bookings.table.status")}</TableHead>
                <TableHead>{t("partner.bookings.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {t("partner.bookings.noOrders")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>{b._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>{b.contactInfo?.name || "-"}</TableCell>
                    <TableCell>
                      {typeof b.room.hotelId === "object"
                        ? b.room.hotelId?.name
                        : "-"}
                    </TableCell>
                    <TableCell>{b.room?.roomType}</TableCell>
                    <TableCell>
                      <div>{format(new Date(b.checkIn), "dd/MM/yyyy")}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(b.checkOut), "dd/MM/yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {b.finalPrice.toLocaleString()}₫
                    </TableCell>
                    <TableCell>{getStatusBadge(b.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigate(`/partner/booking-detail/${b._id}`, {
                              state: { booking: b },
                            });
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />{" "}
                          {t("partner.bookings.viewDetail")}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={updatingBookingId === b._id}
                            >
                              <Repeat className="w-4 h-4 mr-1" />
                              {updatingBookingId
                                ? t("partner.bookings.updating")
                                : t("partner.bookings.changeStatus")}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {STATUS_OPTIONS.filter(
                              (opt) =>
                                opt.value !== "all" && opt.value !== b.status
                            ).map((opt) => {
                              let icon = null;
                              switch (opt.value) {
                                case "pending":
                                  icon = (
                                    <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                                  );
                                  break;
                                case "confirmed":
                                  icon = (
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                  );
                                  break;
                                case "completed":
                                  icon = (
                                    <BadgeCheck className="w-4 h-4 mr-2 text-blue-600" />
                                  );
                                  break;
                                case "cancelled":
                                  icon = (
                                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                  );
                                  break;
                              }
                              return (
                                <DropdownMenuItem
                                  key={opt.value}
                                  onClick={() =>
                                    updateStatus({
                                      bookingId: b._id,
                                      status: opt.value as
                                        | "pending"
                                        | "confirmed"
                                        | "completed"
                                        | "cancelled",
                                    })
                                  }
                                >
                                  {icon}
                                  {opt.label}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>
    </div>
  );
}
