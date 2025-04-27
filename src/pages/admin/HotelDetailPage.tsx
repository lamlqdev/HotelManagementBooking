import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { hotelApi } from "@/api/hotel/hotel.api";
import { userApi } from "@/api/user/user.api";
import { reviewApi } from "@/api/review/review.api";
import { amenitiesApi } from "@/api/amenities/amenities.api";
import { Amenity } from "@/types/amenity";
import { getAmenityIcon } from "@/utils/amenityIcons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Ban,
  Building2,
  Calendar,
  Clock,
  Globe,
  Heart,
  Hotel,
  MapPin,
  Phone,
  Star,
  User,
  Users,
  MessageCircle,
  ExternalLink,
  Dog,
  Mail,
  Eye,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { User as UserType } from "@/types/auth";
import { Review } from "@/types/review";

export default function HotelDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Button variant="outline" onClick={handleBack} className="mb-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{hotel.name}</h1>
            <Badge
              variant={hotel.status === "active" ? "default" : "secondary"}
              className="text-sm"
            >
              {t(`admin.hotels.status.${hotel.status}`)}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="inline-flex w-full h-12 items-center justify-center rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-1 mb-6">
            <TabsTrigger
              value="info"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <Hotel className="h-4 w-4 mr-2" />
              {t("admin.hotels.details.basicInfo")}
            </TabsTrigger>
            <TabsTrigger
              value="partner"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <User className="h-4 w-4 mr-2" />
              {t("admin.hotels.details.partnerInfo")}
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t("admin.hotels.details.reviews")} ({reviews.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab Thông tin khách sạn */}
          <TabsContent value="info">
            <div className="space-y-6">
              {/* Thông tin chính */}
              <Card className="border-none shadow-md">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {t("admin.hotels.details.basicInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Hình ảnh đại diện */}
                    {hotel.featuredImage && (
                      <div className="mb-6">
                        <img
                          src={hotel.featuredImage.url}
                          alt={hotel.name}
                          className="w-full h-80 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    )}

                    {/* Thông tin cơ bản */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("admin.hotels.details.address")}
                          </p>
                          <p className="font-medium">{hotel.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("admin.hotels.details.rating")}
                          </p>
                          <p className="font-medium">{hotel.rating || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                        <Globe className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("admin.hotels.details.website")}
                          </p>
                          {hotel.website ? (
                            <a
                              href={hotel.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-500 hover:underline"
                            >
                              {hotel.website}
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </a>
                          ) : (
                            <p className="text-muted-foreground">
                              {t("admin.hotels.details.noWebsite")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("admin.hotels.details.ownerId")}
                          </p>
                          <p className="font-medium">{hotel.ownerId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        {t("admin.hotels.details.description")}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {hotel.description}
                      </p>
                    </div>

                    {/* Chính sách */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {t("admin.hotels.details.policies")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
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
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.cancellationPolicy")}
                            </p>
                            <p className="font-medium">
                              {t(
                                `admin.hotels.policies.cancellation.${hotel.policies.cancellationPolicy}`
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.childrenPolicy")}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {hotel.policies.childrenPolicy === "yes"
                                ? t("admin.hotels.policies.childrenAllowed")
                                : t("admin.hotels.policies.childrenNotAllowed")}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <Dog className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.petPolicy")}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {hotel.policies.petPolicy === "yes"
                                ? t("admin.hotels.policies.petsAllowed")
                                : t("admin.hotels.policies.petsNotAllowed")}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <Ban className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.smokingPolicy")}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {hotel.policies.smokingPolicy === "yes"
                                ? t("admin.hotels.policies.smokingAllowed")
                                : t("admin.hotels.policies.smokingNotAllowed")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin giá */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {t("admin.hotels.details.pricing")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.lowestPrice")}
                            </p>
                            <p className="text-lg font-semibold text-primary">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(hotel.lowestPrice)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.lowestDiscountedPrice")}
                            </p>
                            <p className="text-lg font-semibold text-primary">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(hotel.lowestDiscountedPrice)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.highestDiscountPercent")}
                            </p>
                            <p className="text-lg font-semibold text-primary">
                              {hotel.highestDiscountPercent}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tiện ích */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {t("admin.hotels.details.amenities")}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {selectedAmenities.length > 0 ? (
                          selectedAmenities.map((amenity) => (
                            <div
                              key={amenity._id}
                              className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors"
                            >
                              {getAmenityIcon(amenity.icon || "default-icon")}
                              <span className="text-sm font-medium">
                                {amenity.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            {t("admin.hotels.details.noAmenities")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Thông tin bổ sung */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {t("admin.hotels.details.additionalInfo")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <Heart className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.favoriteCount")}
                            </p>
                            <p className="font-medium">{hotel.favoriteCount}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.createdAt")}
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(hotel.createdAt),
                                "dd/MM/yyyy HH:mm"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.hotels.details.updatedAt")}
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(hotel.updatedAt),
                                "dd/MM/yyyy HH:mm"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Thông tin đối tác */}
          <TabsContent value="partner">
            {isLoadingPartner ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Skeleton className="h-80 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-80 w-full rounded-lg" />
                </div>
              </div>
            ) : partner ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin đối tác</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={partner.avatar?.[0]?.url} />
                          <AvatarFallback>
                            {partner.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-bold">{partner.name}</h2>
                          <p className="text-muted-foreground">
                            {partner.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Số điện thoại:</span>
                          <span>{partner.phone || "Chưa cập nhật"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Email:</span>
                          <span>{partner.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Vai trò:</span>
                          <Badge variant="outline">
                            {partner.role === "partner"
                              ? "Đối tác"
                              : partner.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Ngày tham gia:</span>
                          <span>
                            {format(new Date(partner.createdAt), "dd/MM/yyyy")}
                          </span>
                        </div>
                      </div>

                      {partner.partnerInfo?.documents && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">
                            Tài liệu
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {partner.partnerInfo.documents.map((doc, index) => (
                              <a
                                key={index}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-500 hover:underline"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>{doc.filename}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Thống kê</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Hotel className="h-4 w-4 text-muted-foreground" />
                            <span>Số khách sạn</span>
                          </div>
                          <Badge variant="outline">1</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>Lượt xem</span>
                          </div>
                          <Badge variant="outline">0</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <span>Lượt yêu thích</span>
                          </div>
                          <Badge variant="outline">
                            {partner.favoriteHotels?.length || 0}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span>Lượt đánh giá</span>
                          </div>
                          <Badge variant="outline">0</Badge>
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
          </TabsContent>

          {/* Tab Đánh giá */}
          <TabsContent value="reviews">
            {isLoadingReviews ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b pb-6 last:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.userId.avatar?.[0]?.url} />
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
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                        {review.response && (
                          <div className="mt-4 bg-muted p-4 rounded-lg">
                            <p className="font-medium">
                              Phản hồi từ khách sạn:
                            </p>
                            <p className="mt-1">{review.response}</p>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
