import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Search, RefreshCw, User } from "lucide-react";
import { bookingApi } from "@/api/booking/booking.api";
import { BookingListItem } from "@/api/booking/types";
import { format } from "date-fns";
import { useNavigate } from "react-router";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];
const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "failed", label: "Thanh toán thất bại" },
  { value: "refunded", label: "Đã hoàn tiền" },
];
const PAYMENT_METHOD_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "zalopay", label: "ZaloPay" },
  { value: "vnpay", label: "VNPay" },
];

export default function BookingsManagement() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-bookings",
      search,
      status,
      paymentStatus,
      paymentMethod,
      currentPage,
    ],
    queryFn: async () => {
      const res = await bookingApi.getAllBookings({
        page: currentPage,
        limit: 5,
        status: status === "all" ? undefined : status,
        paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
        paymentMethod: paymentMethod === "all" ? undefined : paymentMethod,
      });
      return res;
    },
  });

  const bookings: BookingListItem[] = data && "data" in data ? data.data : [];
  const totalPages =
    data && "pagination" in data && data.pagination?.totalPages
      ? data.pagination.totalPages
      : 1;

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setPaymentStatus("all");
    setPaymentMethod("all");
    setCurrentPage(1);
  };

  const filteredBookings = bookings.filter((b) => {
    const s = search.trim().toLowerCase();
    if (!s) return true;
    return (
      b.contactInfo?.name?.toLowerCase().includes(s) ||
      b.contactInfo?.email?.toLowerCase().includes(s) ||
      b.contactInfo?.phone?.toLowerCase().includes(s)
    );
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
                  {t("admin.bookings.title")}
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">
              Danh sách toàn bộ đơn đặt phòng trong hệ thống
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, email, số điện thoại liên hệ..."
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
                Đặt lại bộ lọc
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">
                  Trạng thái
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Trạng thái" />
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
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">
                  Thanh toán
                </label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Trạng thái thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">
                  Phương thức
                </label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Phương thức thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHOD_OPTIONS.map((opt) => (
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
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Khách sạn</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Nhận/Trả</TableHead>
                <TableHead>Thành tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead></TableHead>
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
                    Không có đơn đặt phòng nào phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>{b._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>{b.user?.name || "-"}</TableCell>
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
                    <TableCell>
                      <Badge
                        variant={
                          b.status === "completed"
                            ? "default"
                            : b.status === "pending"
                            ? "outline"
                            : b.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {b.status === "pending"
                          ? "Chờ duyệt"
                          : b.status === "confirmed"
                          ? "Đã xác nhận"
                          : b.status === "completed"
                          ? "Hoàn thành"
                          : b.status === "cancelled"
                          ? "Đã hủy"
                          : b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/bookings/${b._id}`)}
                      >
                        Xem chi tiết
                      </Button>
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
