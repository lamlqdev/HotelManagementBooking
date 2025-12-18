import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import HeroBanner from "@/components/common/HeroBanner";
import SearchBox from "@/components/common/SearchBox";
import HotelList from "@/components/user/search-hotel/HotelList";
import FilterSection from "@/components/user/search-hotel/FilterSection";
import { hotelApi } from "@/api/hotel/hotel.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SearchResultPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get search params from URL
  const locationName = searchParams.get("locationName") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const capacity = Number(searchParams.get("capacity")) || 1;
  const currentPage = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort") || "price";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const roomType = searchParams.get("roomType")?.split(",") || [];
  const roomAmenities =
    searchParams.get("roomAmenities")?.split(",").filter(Boolean) || [];
  const hotelAmenities =
    searchParams.get("hotelAmenities")?.split(",").filter(Boolean) || [];
  const minRating = searchParams.get("minRating");
  const maxRating = searchParams.get("maxRating");

  const finalCheckIn = checkIn;
  const finalCheckOut = checkOut;

  const [currentPageState, setCurrentPageState] = useState(currentPage);

  // Sử dụng React Query để lấy danh sách khách sạn/phòng
  const {
    data: hotelsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "hotels",
      locationName,
      finalCheckIn,
      finalCheckOut,
      capacity,
      currentPage,
      sortBy,
      minPrice,
      maxPrice,
      roomType,
      roomAmenities,
      hotelAmenities,
      minRating,
      maxRating,
    ],
    queryFn: async () => {
      try {
        let backendSort = sortBy;
        if (sortBy === "lowestDiscountedPrice") backendSort = "price";
        else if (sortBy === "-lowestDiscountedPrice") backendSort = "-price";
        else if (sortBy === "highestDiscountPercent")
          backendSort = "highestDiscountPercent";
        else if (sortBy === "-highestDiscountPercent")
          backendSort = "-highestDiscountPercent";
        else if (sortBy === "rating") backendSort = "rating";
        else if (sortBy === "-rating") backendSort = "-rating";

        const response = await hotelApi.searchHotelsWithAvailableRooms({
          locationName,
          checkIn: finalCheckIn,
          checkOut: finalCheckOut,
          capacity,
          hotelName: searchParams.get("hotelName") || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          roomType: roomType.length > 0 ? roomType : undefined,
          roomAmenities:
            roomAmenities.length > 0 ? roomAmenities.join(",") : undefined,
          hotelAmenities:
            hotelAmenities.length > 0 ? hotelAmenities.join(",") : undefined,
          minRating: minRating ? Number(minRating) : undefined,
          maxRating: maxRating ? Number(maxRating) : undefined,
          sort: backendSort || "price",
          page: currentPage,
          limit: 10,
        });
        return response;
      } catch (error) {
        // Nếu là lỗi 404 (không tìm thấy kết quả), trả về danh sách rỗng với message từ server
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosError?.response?.status === 404) {
          return {
            success: true,
            data: [],
            pagination: { totalPages: 0, currentPage: 1 },
            count: 0,
            total: 0,
            message:
              axiosError.response?.data?.message ||
              t("search.no_results_description"),
          };
        }
        // Nếu là lỗi khác, throw error để React Query xử lý
        throw error;
      }
    },
    enabled: !!locationName && !!checkIn && !!checkOut,
  });

  const handleSearch = (searchParams: {
    locationName: string;
    checkIn: string;
    checkOut: string;
    capacity: number;
  }) => {
    const params = new URLSearchParams();
    params.append("locationName", searchParams.locationName);
    params.append("checkIn", searchParams.checkIn);
    params.append("checkOut", searchParams.checkOut);
    params.append("capacity", searchParams.capacity.toString());

    navigate(`/search?${params.toString()}`);
  };

  // Handlers for filters
  const handlePriceChange = (range: [number, number]) => {
    const [min, max] = range;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("minPrice", min.toString());
    newParams.set("maxPrice", max.toString());
    setSearchParams(newParams);
  };

  const handleRatingChange = (range: [number, number]) => {
    const [min, max] = range;
    const newParams = new URLSearchParams(searchParams);
    if (min > 0) {
      newParams.set("minRating", min.toString());
    } else {
      newParams.delete("minRating");
    }
    if (max < 5) {
      newParams.set("maxRating", max.toString());
    } else {
      newParams.delete("maxRating");
    }
    setSearchParams(newParams);
  };

  const handleRoomTypeChange = (roomTypes: string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (roomTypes.length > 0) {
      newParams.set("roomType", roomTypes.join(","));
    } else {
      newParams.delete("roomType");
    }
    setSearchParams(newParams);
  };

  const handleRoomAmenitiesChange = (amenities: string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (amenities.length > 0) {
      newParams.set("roomAmenities", amenities.join(","));
    } else {
      newParams.delete("roomAmenities");
    }
    setSearchParams(newParams);
  };

  const handleHotelAmenitiesChange = (amenities: string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (amenities.length > 0) {
      newParams.set("hotelAmenities", amenities.join(","));
    } else {
      newParams.delete("hotelAmenities");
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("sort", value);
    } else {
      newParams.delete("sort");
    }
    setSearchParams(newParams);
  };

  const handleHotelClick = (hotelId: string) => {
    const params = new URLSearchParams();
    params.append("checkIn", finalCheckIn);
    params.append("checkOut", finalCheckOut);
    params.append("capacity", capacity.toString());

    // Pass all filter parameters
    if (minPrice) {
      params.append("minPrice", minPrice);
    }
    if (maxPrice) {
      params.append("maxPrice", maxPrice);
    }
    if (minRating) {
      params.append("minRating", minRating);
    }
    if (maxRating) {
      params.append("maxRating", maxRating);
    }
    if (roomType.length > 0) {
      params.append("roomType", roomType.join(","));
    }
    if (roomAmenities.length > 0) {
      params.append("roomAmenities", roomAmenities.join(","));
    }
    if (hotelAmenities.length > 0) {
      params.append("hotelAmenities", hotelAmenities.join(","));
    }
    navigate(`/hoteldetail/${hotelId}?${params.toString()}`);
  };

  const totalPages = hotelsData?.pagination?.totalPages || 1;
  const total = hotelsData?.total || 0;

  const handlePageChange = (newPage: number) => {
    setCurrentPageState(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  // Xử lý trạng thái loading
  if (isLoading) {
    return (
      <div>
        <div className="relative mb-16 sm:mb-20 md:mb-24">
          <HeroBanner
            imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title={t("banner.home.title")}
            description={t("banner.home.description")}
          />

          <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-3 sm:px-4 md:px-6 lg:px-8 z-20">
            <div className="container mx-auto max-w-6xl">
              <SearchBox
                onSearch={handleSearch}
                defaultValues={{
                  locationName: locationName || undefined,
                  checkIn: finalCheckIn,
                  checkOut: finalCheckOut,
                  capacity: capacity,
                }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Filter Section */}
            <div className="lg:col-span-3">
              <FilterSection
                onPriceChange={handlePriceChange}
                onRoomTypeChange={handleRoomTypeChange}
                onRoomAmenitiesChange={handleRoomAmenitiesChange}
                onHotelAmenitiesChange={handleHotelAmenitiesChange}
                onRatingChange={handleRatingChange}
                initialSelectedRoomAmenities={roomAmenities}
                initialSelectedHotelAmenities={hotelAmenities}
                initialSelectedRoomTypes={roomType}
                initialRatingRange={[
                  minRating ? Number(minRating) : 0,
                  maxRating ? Number(maxRating) : 5,
                ]}
              />
            </div>

            {/* Hotel List Section */}
            <div className="lg:col-span-9">
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex gap-4">
                      <Skeleton className="w-48 h-32 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-5 w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Xử lý trạng thái error
  if (isError) {
    return (
      <div>
        <div className="relative mb-16 sm:mb-20 md:mb-24">
          <HeroBanner
            imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title={t("banner.home.title")}
            description={t("banner.home.description")}
          />

          <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-3 sm:px-4 md:px-6 lg:px-8 z-20">
            <div className="container mx-auto max-w-6xl">
              <SearchBox
                onSearch={handleSearch}
                defaultValues={{
                  locationName: locationName || undefined,
                  checkIn: finalCheckIn,
                  checkOut: finalCheckOut,
                  capacity: capacity,
                }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : t("common.error_loading_data")}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const hotels = (hotelsData?.data || []).map(
    (item: {
      _id: string;
      name: string;
      address: string;
      rating: number;
      reviewCount: number;
      featuredImage: { url: string; publicId: string; filename: string };
      images: Array<{ url: string; publicId: string; filename: string }>;
      policies: {
        checkInTime: string;
        checkOutTime: string;
        cancellationPolicy: "24h-full-refund" | "24h-half-refund" | "no-refund";
        childrenPolicy: "yes" | "no";
        petPolicy: "yes" | "no";
        smokingPolicy: "yes" | "no";
      };
      lowestPrice: number;
      lowestDiscountedPrice: number;
      highestDiscountPercent: number;
    }) => ({
      _id: item._id,
      name: item.name,
      address: item.address,
      locationId: { _id: "", name: locationName || "" }, // Không có locationId từ API search, gán tạm
      locationDescription: "",
      rating: item.rating,
      reviewCount: item.reviewCount,
      description: "",
      ownerId: "",
      website: "",
      featuredImage: item.featuredImage,
      images: item.images,
      amenities: [],
      policies: item.policies,
      favoriteCount: 0,
      lowestPrice: item.lowestPrice,
      lowestDiscountedPrice: item.lowestDiscountedPrice,
      highestDiscountPercent: item.highestDiscountPercent,
      status: "active" as const,
      createdAt: "",
      updatedAt: "",
    })
  );

  return (
    <div>
      <div className="relative mb-16 sm:mb-20 md:mb-24">
        <HeroBanner
          imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title={t("banner.home.title")}
          description={t("banner.home.description")}
        />

        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-3 sm:px-4 md:px-6 lg:px-8 z-20">
          <div className="container mx-auto max-w-6xl">
            <SearchBox
              onSearch={handleSearch}
              defaultValues={{
                locationName: locationName || undefined,
                checkIn: finalCheckIn,
                checkOut: finalCheckOut,
                capacity: capacity,
              }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 md:mt-24 mt-64">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Filter Section */}
          <div className="lg:col-span-3">
            <FilterSection
              onPriceChange={handlePriceChange}
              onRoomTypeChange={handleRoomTypeChange}
              onRoomAmenitiesChange={handleRoomAmenitiesChange}
              onHotelAmenitiesChange={handleHotelAmenitiesChange}
              onRatingChange={handleRatingChange}
              initialSelectedRoomAmenities={roomAmenities}
              initialSelectedHotelAmenities={hotelAmenities}
              initialSelectedRoomTypes={roomType}
              initialRatingRange={[
                minRating ? Number(minRating) : 0,
                maxRating ? Number(maxRating) : 5,
              ]}
            />
          </div>

          {/* Hotel List Section */}
          <div className="lg:col-span-9">
            <HotelList
              hotels={hotels}
              currentPage={currentPageState}
              totalPages={totalPages}
              total={total}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              onHotelClick={handleHotelClick}
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
