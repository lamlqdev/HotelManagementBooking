import { useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Ban,
  Calendar,
  Clock,
  Dog,
  ExternalLink,
  Globe,
  Heart,
  Hotel,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  Users,
} from "lucide-react";

import { amenitiesApi } from "@/api/amenities/amenities.api";
import { bookingApi } from "@/api/booking/booking.api";
import { hotelApi } from "@/api/hotel/hotel.api";
import { reviewApi } from "@/api/review/review.api";
import { userApi } from "@/api/user/user.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Amenity } from "@/types/amenity";
import { User as UserType } from "@/types/auth";
import { Review } from "@/types/review";
import { getAmenityIcon } from "@/utils/amenityIcons";

// Thêm hàm chuyển đổi trạng thái booking
const getBookingStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "checked_in":
      return "Đã nhận phòng";
    case "checked_out":
      return "Đã trả phòng";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

// Thêm hàm chuyển đổi trạng thái thanh toán
const getPaymentStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ thanh toán";
    case "paid":
      return "Đã thanh toán";
    case "refunded":
      return "Đã hoàn tiền";
    case "failed":
      return "Thanh toán thất bại";
    default:
      return status;
  }
};

export default function HotelDetailPage() {
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const disableHotelMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Hotel ID is required");
      return hotelApi.updateHotel(id, { status: "inactive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotel", id] });
    },
  });

  // Sử dụng React Query để lấy thông tin chi tiết khách sạn
  const {
    data: hotelResponse,
    isLoading: isLoadingHotel,
    error: hotelError,
  } = useQuery({
    queryKey: ["hotel", id],
    queryFn: async () => {
      if (!id) throw new Error("Hotel ID is required");
      return await hotelApi.getHotel(id);
    },
    enabled: !!id,
  });

  // Lấy thông tin đối tác
  const { data: partnerResponse, isLoading: isLoadingPartner } = useQuery({
    queryKey: ["partner", hotelResponse?.data?.ownerId],
    queryFn: async () => {
      if (!hotelResponse?.data?.ownerId) return null;
      return await userApi.getUser(hotelResponse.data.ownerId);
    },
    enabled: !!hotelResponse?.data?.ownerId,
  });

  // Lấy danh sách đánh giá
  const { data: reviewsResponse, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      if (!id) return null;
      return await reviewApi.getHotelReviews(id);
    },
    enabled: !!id,
  });

  // Lấy danh sách tiện nghi
  const { data: amenitiesResponse } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => amenitiesApi.getAmenities(),
  });

  // Lấy danh sách booking của khách sạn
  const { data: bookingsResponse, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["hotelBookings", id],
    queryFn: () => bookingApi.getHotelBookings(id!),
    enabled: !!id,
  });
  const bookings = bookingsResponse?.data || [];

  // Xử lý lỗi
  if (hotelError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">
            {t("common.error")}
          </h2>
          <p className="text-muted-foreground">{t("common.errorMessage")}</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate("/admin/hotels");
  };

  // Hiển thị skeleton khi đang tải
  if (isLoadingHotel) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu không có dữ liệu khách sạn
  if (!hotelResponse || !hotelResponse.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {t("admin.hotels.notFound")}
          </h2>
          <p className="text-muted-foreground">
            {t("admin.hotels.notFoundMessage")}
          </p>
        </div>
      </div>
    );
  }

  const hotel = hotelResponse.data;
  const partner = partnerResponse?.data as UserType | undefined;
  const reviews = (reviewsResponse?.data || []) as Review[];

  const amenities = (amenitiesResponse?.data || []) as Amenity[];
  const selectedAmenities = amenities.filter((amenity: Amenity) =>
    hotel.amenities.includes(amenity._id)
  );

  return (
    <div className="container mx-auto px-4 pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleBack} className="mb-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
            <h1 className="text-2xl font-bold">
              {t("admin.hotels.details.title")}
            </h1>
          </div>
          <Button
            variant="destructive"
            onClick={() => disableHotelMutation.mutate()}
            disabled={
              hotel.status === "inactive" || disableHotelMutation.isPending
            }
          >
            {disableHotelMutation.isPending
              ? "Đang xử lý..."
              : hotel.status === "inactive"
              ? "Đã vô hiệu hoá"
              : "Vô hiệu hoá khách sạn"}
          </Button>
        </div>
        <div className="flex flex-col items-center gap-8 overflow-x-hidden">
          {/* Nội dung các section */}
          <div className="w-full min-w-0 max-w-full md:max-w-5xl">
            {/* Section Thông tin khách sạn */}
            <div
              id="thong-tin"
              className="min-h-[100px]"
              ref={(el) => {
                sectionRefs.current["thong-tin"] = el;
              }}
            >
              <div className="space-y-8">
                {/* Ảnh đại diện với overlay */}
                {hotel.featuredImage && (
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={hotel.featuredImage.url}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                          {hotel.name}
                        </h2>
                        <Badge
                          variant={
                            hotel.status === "active" ? "default" : "secondary"
                          }
                          className="text-xs px-3 py-1 rounded-full bg-white/80 text-primary shadow"
                        >
                          {t(`admin.hotels.status.${hotel.status}`)}
                        </Badge>
                        {/* Địa chỉ và website cùng 1 dòng */}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-2 text-white/90">
                            <MapPin className="h-4 w-4 text-white/80" />
                            <span className="text-sm font-medium">
                              {hotel.address}
                            </span>
                          </div>
                          {hotel.website && (
                            <a
                              href={hotel.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-200 hover:underline text-sm font-medium"
                            >
                              <Globe className="h-4 w-4" />
                              {hotel.website}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                        {/* Giá thấp nhất và số yêu thích cùng 1 dòng */}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 bg-primary/80 rounded-full px-4 py-1 shadow-lg">
                            <span className="text-xs text-white/80">
                              Giá từ
                            </span>
                            <span className="text-lg font-bold text-white">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(hotel.lowestPrice)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 shadow">
                            <Heart className="h-4 w-4 text-white" />
                            <span className="text-white font-semibold">
                              {hotel.favoriteCount}
                            </span>
                            <span className="text-xs text-white/80">
                              Yêu thích
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Mô tả full width */}
                <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-center h-full border border-primary/10 mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="italic text-primary font-semibold">"</span>
                    <span className="text-lg font-semibold">
                      {t("admin.hotels.details.description")}
                    </span>
                  </div>
                  <p className="text-muted-foreground italic mb-4">
                    {hotel.description}
                  </p>
                  <div className="flex flex-wrap gap-6 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Ngày tạo:{" "}
                        {format(new Date(hotel.createdAt), "dd/MM/yyyy HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Cập nhật:{" "}
                        {format(new Date(hotel.updatedAt), "dd/MM/yyyy HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Chính sách */}
                <div className="bg-white rounded-2xl shadow-md p-6 border border-primary/10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />{" "}
                    {t("admin.hotels.details.policies")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("admin.hotels.details.checkInOut")}
                        </p>
                        <p className="font-medium">
                          {hotel.policies.checkInTime} -{" "}
                          {hotel.policies.checkOutTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("admin.hotels.details.cancellationPolicy")}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {t(
                            `admin.hotels.policies.cancellation.${hotel.policies.cancellationPolicy}`
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("admin.hotels.details.childrenPolicy")}
                        </p>
                        <Badge
                          variant={
                            hotel.policies.childrenPolicy === "yes"
                              ? "default"
                              : "destructive"
                          }
                          className="mt-1"
                        >
                          {hotel.policies.childrenPolicy === "yes"
                            ? t("admin.hotels.policies.childrenAllowed")
                            : t("admin.hotels.policies.childrenNotAllowed")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                      <Dog className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("admin.hotels.details.petPolicy")}
                        </p>
                        <Badge
                          variant={
                            hotel.policies.petPolicy === "yes"
                              ? "default"
                              : "destructive"
                          }
                          className="mt-1"
                        >
                          {hotel.policies.petPolicy === "yes"
                            ? t("admin.hotels.policies.petsAllowed")
                            : t("admin.hotels.policies.petsNotAllowed")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                      <Ban className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("admin.hotels.details.smokingPolicy")}
                        </p>
                        <Badge
                          variant={
                            hotel.policies.smokingPolicy === "yes"
                              ? "default"
                              : "destructive"
                          }
                          className="mt-1"
                        >
                          {hotel.policies.smokingPolicy === "yes"
                            ? t("admin.hotels.policies.smokingAllowed")
                            : t("admin.hotels.policies.smokingNotAllowed")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Tiện ích */}
                <div className="bg-white rounded-2xl shadow-md p-6 border border-primary/10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Hotel className="h-5 w-5 text-primary" />{" "}
                    {t("admin.hotels.details.amenities")}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedAmenities.length > 0 ? (
                      selectedAmenities.map((amenity) => (
                        <span
                          key={amenity._id}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                        >
                          {getAmenityIcon(amenity.icon || "default-icon")}
                          {amenity.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground">
                        {t("admin.hotels.details.noAmenities")}
                      </span>
                    )}
                  </div>
                </div>
                {/* Thông tin bổ sung đã được chuyển lên overlay và mô tả */}
              </div>
            </div>
            {/* Section Danh sách booking */}
            <div
              id="booking"
              className="mt-4 pt-8 min-h-[100px]"
              ref={(el) => {
                sectionRefs.current["booking"] = el;
              }}
            >
              <div className="bg-white rounded-2xl shadow-md p-6 border border-primary/10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Danh sách
                  booking
                </h3>
                <div className="overflow-x-auto w-full">
                  <Table className="min-w-[900px] w-full max-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[15%]">Mã booking</TableHead>
                        <TableHead className="w-[20%]">Phòng</TableHead>
                        <TableHead className="w-[20%]">Khách hàng</TableHead>
                        <TableHead className="w-[12%]">Nhận phòng</TableHead>
                        <TableHead className="w-[12%]">Trả phòng</TableHead>
                        <TableHead className="w-[10%] min-w-[120px]">
                          Trạng thái
                        </TableHead>
                        <TableHead className="w-[10%] min-w-[120px]">
                          Thanh toán
                        </TableHead>
                        <TableHead className="w-[10%] text-right">
                          Tổng tiền
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingBookings ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            {Array.from({ length: 8 }).map((_, j) => (
                              <TableCell key={j}>
                                <Skeleton className="h-6 w-full" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : bookings.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center py-8 text-muted-foreground"
                          >
                            Không có booking nào cho khách sạn này.
                          </TableCell>
                        </TableRow>
                      ) : (
                        bookings.map((booking) => (
                          <TableRow
                            key={booking._id}
                            className="hover:bg-primary/5"
                          >
                            <TableCell className="py-4 font-medium">
                              #{booking._id}
                            </TableCell>
                            <TableCell className="py-4">
                              {booking.room?.roomType ||
                                booking.room?.roomNumber ||
                                ""}
                            </TableCell>
                            <TableCell className="py-4">
                              {booking.contactInfo?.name}
                            </TableCell>
                            <TableCell className="py-4">
                              {format(new Date(booking.checkIn), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="py-4">
                              {format(new Date(booking.checkOut), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant={
                                  booking.status === "completed"
                                    ? "default"
                                    : booking.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="whitespace-nowrap"
                              >
                                {getBookingStatusText(booking.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant={
                                  booking.paymentStatus === "paid"
                                    ? "default"
                                    : "secondary"
                                }
                                className="whitespace-nowrap"
                              >
                                {getPaymentStatusText(booking.paymentStatus)}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 text-right font-semibold text-primary">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(booking.finalPrice)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            {/* Section Thông tin đối tác */}
            <div
              id="doi-tac"
              className="mt-4 pt-8 min-h-[100px]"
              ref={(el) => {
                sectionRefs.current["doi-tac"] = el;
              }}
            >
              {isLoadingPartner ? (
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <Skeleton className="h-80 w-full rounded-lg" />
                  </div>
                </div>
              ) : partner ? (
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <Card className="rounded-2xl shadow-lg border border-primary/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-bold">
                          <User className="h-5 w-5 text-primary" /> Thông tin
                          đối tác
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6 mb-8">
                          <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
                            <AvatarImage src={partner.avatar?.url} />
                            <AvatarFallback>
                              {partner.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-2xl font-bold mb-1">
                              {partner.name}
                            </h2>
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1"
                            >
                              {partner.role === "partner"
                                ? "Đối tác"
                                : partner.role === "admin"
                                ? "Quản trị viên"
                                : partner.role}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              Số điện thoại đối tác:
                            </span>
                            <span>{partner.phone || "Chưa cập nhật"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Email đối tác:</span>
                            <span>{partner.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              Ngày tham gia hệ thống:
                            </span>
                            <span>
                              {format(
                                new Date(partner.createdAt),
                                "dd/MM/yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">
                      Không tìm thấy thông tin đối tác
                    </h2>
                    <p className="text-muted-foreground">
                      Không thể tải thông tin đối tác. Vui lòng thử lại sau.
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Section Đánh giá */}
            <div
              id="danh-gia"
              className="mt-4 pt-8 min-h-[100px]"
              ref={(el) => {
                sectionRefs.current["danh-gia"] = el;
              }}
            >
              <div className="bg-white rounded-2xl shadow-md p-6 border border-primary/10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" /> Đánh giá
                </h3>
                {isLoadingReviews ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {/* Tổng quan đánh giá */}
                    <div className="flex items-center gap-8 mb-6">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-yellow-500">
                          {hotel.rating || 0}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Điểm trung bình
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs w-6">
                              {star}{" "}
                              <Star className="inline h-3 w-3 text-yellow-400 fill-yellow-400" />
                            </span>
                            <div className="bg-primary/10 rounded h-2 w-32 overflow-hidden">
                              <div
                                className="bg-yellow-400 h-2"
                                style={{
                                  width: `${
                                    (reviews.filter((r) => r.rating === star)
                                      .length /
                                      reviews.length) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground w-6 text-right">
                              {reviews.filter((r) => r.rating === star).length}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Danh sách đánh giá */}
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b pb-6 last:border-b-0 bg-primary/5 rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={review.userId.avatar?.url} />
                            <AvatarFallback>
                              {review.userId.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">
                                  {review.userId.name}
                                </h3>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{review.rating}</span>
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <blockquote className="mt-2 border-l-4 border-primary pl-4 italic text-muted-foreground">
                              {review.comment}
                            </blockquote>
                            {review.response && (
                              <div className="mt-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                <p className="font-medium text-blue-700">
                                  Phản hồi từ khách sạn:
                                </p>
                                <p className="mt-1 text-blue-900">
                                  {review.response}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <h2 className="text-xl font-semibold">
                        Chưa có đánh giá nào
                      </h2>
                      <p className="text-muted-foreground">
                        Khách sạn này chưa nhận được đánh giá nào từ người dùng.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
