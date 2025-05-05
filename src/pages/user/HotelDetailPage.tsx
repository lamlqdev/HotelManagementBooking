import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaExclamationTriangle } from "react-icons/fa";

import HotelHeader from "@/components/user/hotel-detail/HotelHeader";
import HotelGallery from "@/components/user/hotel-detail/HotelGallery";
import HotelTabs from "@/components/user/hotel-detail/HotelTabs";
import HotelOverview from "@/components/user/hotel-detail/HotelOverview";
import HotelRooms from "@/components/user/hotel-detail/HotelRooms";
import HotelReviews from "@/components/user/hotel-detail/HotelReviews";
import ChatSupport from "@/components/common/ChatSupport";

import { hotelApi } from "@/api/hotel/hotel.api";
import { amenitiesApi } from "@/api/amenities/amenities.api";
import { roomApi } from "@/api/room/room.api";
import { reviewApi } from "@/api/review/review.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const HotelDetailPage = () => {
  const [activeTab, setActiveTab] = useState("tổng quan");
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  // Lấy thông tin tìm kiếm từ URL
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const capacity = searchParams.get("capacity");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: hotelResponse,
    isLoading: isLoadingHotel,
    error: hotelError,
  } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => hotelApi.getHotel(id as string),
    enabled: !!id,
  });

  const { data: amenitiesResponse, isLoading: isLoadingAmenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => amenitiesApi.getAmenities(),
  });

  const { data: roomsResponse, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["rooms", id],
    queryFn: () => roomApi.getRooms(id as string, { available: true }),
    enabled: !!id,
  });

  const { data: reviewsResponse, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewApi.getHotelReviews(id as string),
    enabled: !!id,
  });

  // Xử lý trạng thái loading
  if (
    isLoadingHotel ||
    isLoadingAmenities ||
    isLoadingRooms ||
    isLoadingReviews
  ) {
    return (
      <div className="container mx-auto px-4 py-6 pt-32 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          <Skeleton className="md:col-span-4 aspect-[4/3] rounded-lg" />
          <div className="md:col-span-3 grid grid-cols-2 gap-3">
            <Skeleton className="aspect-[4/3] rounded-lg" />
            <Skeleton className="aspect-[4/3] rounded-lg" />
            <Skeleton className="aspect-[4/3] rounded-lg" />
            <Skeleton className="aspect-[4/3] rounded-lg" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // Xử lý trạng thái lỗi
  if (hotelError) {
    return (
      <div className="container mx-auto px-4 py-6 pt-32">
        <Alert variant="destructive">
          <FaExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            Không thể tải thông tin khách sạn. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Kiểm tra dữ liệu
  if (!hotelResponse || !hotelResponse.data) {
    return (
      <div className="container mx-auto px-4 py-6 pt-32">
        <Alert variant="destructive">
          <FaExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Không tìm thấy</AlertTitle>
          <AlertDescription>
            Không tìm thấy thông tin khách sạn.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hotel = hotelResponse.data;
  const amenities = amenitiesResponse?.data || [];
  const rooms = roomsResponse?.data || [];
  const reviews = reviewsResponse?.data || [];

  // Lọc các tiện ích của khách sạn
  const hotelAmenities = amenities.filter((amenity) =>
    hotel.amenities.includes(amenity._id)
  );

  // Tính toán thống kê đánh giá
  const reviewStats = {
    overall: hotel.rating || 0,
    total: reviews.length,
    distribution: [
      { stars: 5, count: reviews.filter((r) => r.rating === 5).length },
      { stars: 4, count: reviews.filter((r) => r.rating === 4).length },
      { stars: 3, count: reviews.filter((r) => r.rating === 3).length },
      { stars: 2, count: reviews.filter((r) => r.rating === 2).length },
      { stars: 1, count: reviews.filter((r) => r.rating === 1).length },
    ],
  };

  const hotelImages = [
    hotel.featuredImage?.url,
    ...(hotel.images?.map((img) => img.url) || []),
  ].filter(Boolean) as string[];

  return (
    <div className="container mx-auto px-4 py-6 pt-32">
      <HotelHeader
        id={hotel._id}
        name={hotel.name}
        rating={hotel.rating}
        totalReviews={reviews.length}
        address={hotel.address}
      />

      <HotelGallery images={hotelImages} />

      <HotelTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6 space-y-12">
        <div id="tổng quan">
          <HotelOverview
            description={hotel.description}
            amenities={hotelAmenities}
          />
        </div>

        <div id="phòng">
          <HotelRooms
            rooms={rooms}
            checkIn={checkIn || undefined}
            checkOut={checkOut || undefined}
            capacity={capacity ? parseInt(capacity) : undefined}
            hotelId={hotel._id}
          />
        </div>

        <div id="đánh giá">
          <HotelReviews reviewStats={reviewStats} reviews={reviews} />
        </div>
      </div>

      <ChatSupport />
    </div>
  );
};

export default HotelDetailPage;
