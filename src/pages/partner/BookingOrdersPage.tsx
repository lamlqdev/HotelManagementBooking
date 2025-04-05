import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  Clock,
  CreditCard,
  FileText,
  Hotel,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Định nghĩa kiểu dữ liệu cho đơn đặt phòng
interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  hotelName: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
  totalPrice: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed";
  specialRequests: string;
  createdAt: Date;
}

// Mock data - Thay thế bằng dữ liệu thực từ API
const mockBookings: Booking[] = [
  {
    id: "BK001",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@example.com",
    customerPhone: "0123456789",
    hotelName: "Grand Hotel",
    roomType: "Deluxe Double Room",
    checkIn: new Date("2023-12-15"),
    checkOut: new Date("2023-12-17"),
    guests: 2,
    rooms: 1,
    totalPrice: 2400000,
    status: "pending", // pending, approved, rejected, completed, cancelled
    paymentStatus: "paid", // paid, pending, failed
    specialRequests: "Không có yêu cầu đặc biệt",
    createdAt: new Date("2023-12-10"),
  },
  {
    id: "BK002",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@example.com",
    customerPhone: "0987654321",
    hotelName: "Grand Hotel",
    roomType: "Suite Room",
    checkIn: new Date("2023-12-20"),
    checkOut: new Date("2023-12-22"),
    guests: 3,
    rooms: 1,
    totalPrice: 3600000,
    status: "approved",
    paymentStatus: "paid",
    specialRequests: "Cần thêm giường phụ",
    createdAt: new Date("2023-12-12"),
  },
  {
    id: "BK003",
    customerName: "Lê Văn C",
    customerEmail: "levanc@example.com",
    customerPhone: "0369852147",
    hotelName: "Grand Hotel",
    roomType: "Standard Single Room",
    checkIn: new Date("2023-12-25"),
    checkOut: new Date("2023-12-26"),
    guests: 1,
    rooms: 1,
    totalPrice: 1200000,
    status: "rejected",
    paymentStatus: "pending",
    specialRequests: "Không có yêu cầu đặc biệt",
    createdAt: new Date("2023-12-14"),
  },
];

export default function BookingOrdersPage() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalNote, setApprovalNote] = useState("");

  // Hàm xử lý khi chọn một đơn đặt phòng
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  // Hàm xử lý khi duyệt đơn đặt phòng
  const handleApproveBooking = () => {
    if (selectedBooking) {
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, status: "approved" as const }
          : booking
      );
      setBookings(updatedBookings);
      setIsDialogOpen(false);
      // Gửi thông báo cho user
      // API call để cập nhật trạng thái và gửi thông báo
    }
  };

  // Hàm xử lý khi từ chối đơn đặt phòng
  const handleRejectBooking = () => {
    if (selectedBooking && rejectionReason) {
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, status: "rejected" as const }
          : booking
      );
      setBookings(updatedBookings);
      setIsDialogOpen(false);
      // Gửi thông báo cho user với lý do từ chối
      // API call để cập nhật trạng thái và gửi thông báo
    }
  };

  // Hàm định dạng trạng thái đơn đặt phòng
  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            {t("partner.bookings.statusTypes.pending")}
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {t("partner.bookings.statusTypes.approved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            {t("partner.bookings.statusTypes.rejected")}
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {t("partner.bookings.statusTypes.completed")}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {t("partner.bookings.statusTypes.cancelled")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t("partner.bookings.statusTypes.unknown")}
          </Badge>
        );
    }
  };

  // Hàm định dạng trạng thái thanh toán
  const getPaymentStatusBadge = (status: Booking["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {t("partner.bookings.paymentTypes.paid")}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            {t("partner.bookings.paymentTypes.pending")}
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            {t("partner.bookings.paymentTypes.failed")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t("partner.bookings.paymentTypes.unknown")}
          </Badge>
        );
    }
  };

  // Hàm định dạng giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{t("partner.bookings.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("partner.bookings.listTitle")}</CardTitle>
          <CardDescription>
            {t("partner.bookings.listDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("partner.bookings.id")}</TableHead>
                <TableHead>{t("partner.bookings.customer")}</TableHead>
                <TableHead>{t("partner.bookings.roomType")}</TableHead>
                <TableHead>{t("partner.bookings.dates")}</TableHead>
                <TableHead>{t("partner.bookings.guests")}</TableHead>
                <TableHead>{t("partner.bookings.totalPrice")}</TableHead>
                <TableHead>{t("partner.bookings.status")}</TableHead>
                <TableHead>{t("partner.bookings.payment")}</TableHead>
                <TableHead>{t("partner.bookings.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{booking.roomType}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {format(booking.checkIn, "dd/MM/yyyy", { locale: vi })}
                      </span>
                      <span className="text-sm">
                        {format(booking.checkOut, "dd/MM/yyyy", { locale: vi })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>{formatPrice(booking.totalPrice)}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectBooking(booking)}
                    >
                      {t("partner.bookings.viewDetails")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog hiển thị chi tiết đơn đặt phòng */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl sm:!max-w-6xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {t("partner.bookings.detailsTitle", {
                    id: selectedBooking.id,
                  })}
                </DialogTitle>
                <DialogDescription>
                  {t("partner.bookings.detailsDescription")}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/30 p-1 rounded-lg">
                  <TabsTrigger
                    value="info"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {t("partner.bookings.tabs.general")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="customer"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t("partner.bookings.tabs.customer")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="actions"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t("partner.bookings.tabs.actions")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Hotel className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t("partner.bookings.hotel")}:
                        </span>
                        <span>{selectedBooking.hotelName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t("partner.bookings.roomType")}:
                        </span>
                        <span>{selectedBooking.roomType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t("partner.bookings.checkIn")}:
                        </span>
                        <span>
                          {format(selectedBooking.checkIn, "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t("partner.bookings.checkOut")}:
                        </span>
                        <span>
                          {format(selectedBooking.checkOut, "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t("partner.bookings.guests")}:
                        </span>
                        <span>{selectedBooking.guests}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t("partner.bookings.rooms")}:
                        </span>
                        <span>{selectedBooking.rooms}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t("partner.bookings.totalPrice")}:
                        </span>
                        <span>{formatPrice(selectedBooking.totalPrice)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t("partner.bookings.createdAt")}:
                        </span>
                        <span>
                          {format(selectedBooking.createdAt, "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">
                      {t("partner.bookings.specialRequests")}:
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.specialRequests ||
                        t("partner.bookings.noSpecialRequests")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="font-medium">
                        {t("partner.bookings.status")}:
                      </div>
                      {getStatusBadge(selectedBooking.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">
                        {t("partner.bookings.payment")}:
                      </div>
                      {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="customer" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-background rounded-md shadow-sm">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {t("partner.bookings.customerName")}
                        </div>
                        <div className="font-medium">
                          {selectedBooking.customerName}
                        </div>
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
                        <div className="font-medium">
                          {selectedBooking.customerEmail}
                        </div>
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
                        <div className="font-medium">
                          {selectedBooking.customerPhone}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-6">
                  {selectedBooking.status === "pending" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-background p-4 rounded-lg shadow-sm">
                        <Label
                          htmlFor="approve"
                          className="text-base font-medium text-green-700 mb-2 block"
                        >
                          {t("partner.bookings.approveBooking")}
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          {t("partner.bookings.approveDescription")}
                        </p>
                        <div className="flex flex-col gap-2">
                          <Textarea
                            id="approve"
                            placeholder={t(
                              "partner.bookings.approveNotePlaceholder"
                            )}
                            value={approvalNote}
                            onChange={(e) => setApprovalNote(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <Button
                            id="approve"
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={handleApproveBooking}
                          >
                            {t("partner.bookings.approve")}
                          </Button>
                        </div>
                      </div>
                      <div className="bg-background p-4 rounded-lg shadow-sm">
                        <Label
                          htmlFor="reject"
                          className="text-base font-medium text-red-700 mb-2 block"
                        >
                          {t("partner.bookings.rejectBooking")}
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          {t("partner.bookings.rejectDescription")}
                        </p>
                        <div className="flex flex-col gap-2">
                          <Textarea
                            id="reject"
                            placeholder={t(
                              "partner.bookings.rejectReasonPlaceholder"
                            )}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={handleRejectBooking}
                            disabled={!rejectionReason}
                          >
                            {t("partner.bookings.reject")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
