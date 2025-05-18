import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

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

  // Lấy các tham số từ URL
  const locationName = searchParams.get("locationName");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const capacity = searchParams.get("capacity");

  // Nếu chỉ có locationName, tự động điền các thông tin còn lại
  const defaultCheckIn = new Date();
  const defaultCheckOut = new Date();
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 1);

  const finalCheckIn = checkIn || format(defaultCheckIn, "yyyy-MM-dd");
  const finalCheckOut = checkOut || format(defaultCheckOut, "yyyy-MM-dd");
  const finalCapacity = capacity || "1";

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");

  // Sử dụng React Query để lấy danh sách khách sạn/phòng
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "hotels",
      locationName,
      finalCheckIn,
      finalCheckOut,
      finalCapacity,
      currentPage,
      sortBy,
    ],
    queryFn: async () => {
      try {
        // Nếu có locationName -> gọi API searchHotelsWithAvailableRooms với thông tin mặc định
        if (locationName) {
          const response = await hotelApi.searchHotelsWithAvailableRooms({
            locationName,
            checkIn: finalCheckIn,
            checkOut: finalCheckOut,
            capacity: parseInt(finalCapacity),
            page: currentPage,
            limit: 10,
            sort: sortBy || undefined,
          });
          return response;
        }

        // Nếu không có đủ thông tin -> trả về danh sách rỗng
        return { success: true, data: [], pagination: { totalPages: 0 } };
      } catch (error) {
        // Nếu là lỗi 404 (không tìm thấy kết quả), trả về danh sách rỗng với message từ server
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosError?.response?.status === 404) {
          return {
            success: true,
            data: [],
            pagination: { totalPages: 0 },
            message:
              axiosError.response?.data?.message ||
              t("search.no_results_description"),
          };
        }
        // Nếu là lỗi khác, throw error để React Query xử lý
        throw error;
      }
    },
    enabled: !!locationName,
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

  const handleStarChange = (stars: number[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (stars.length > 0) {
      newParams.set("stars", stars.join(","));
    } else {
      newParams.delete("stars");
    }
    setSearchParams(newParams);
  };

  const handleAmenitiesChange = (amenities: string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (amenities.length > 0) {
      newParams.set("amenities", amenities.join(","));
    } else {
      newParams.delete("amenities");
    }
    setSearchParams(newParams);
  };

  const handleHotelClick = (hotelId: string) => {
    const params = new URLSearchParams();
    params.append("checkIn", finalCheckIn);
    params.append("checkOut", finalCheckOut);
    params.append("capacity", finalCapacity);
    navigate(`/hoteldetail/${hotelId}?${params.toString()}`);
  };

  // Xử lý trạng thái không có kết quả
  if (!isLoading && !isError && data?.data.length === 0) {
    return (
      <div>
        <div className="relative mb-24">
          <HeroBanner
            imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title={t("banner.home.title")}
            description={t("banner.home.description")}
          />

          <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-4">
            <div className="container mx-auto max-w-6xl">
              <SearchBox
                onSearch={handleSearch}
                defaultValues={{
                  locationName: locationName || undefined,
                  checkIn: finalCheckIn,
                  checkOut: finalCheckOut,
                  capacity: parseInt(finalCapacity),
                }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("search.no_results")}</AlertTitle>
            <AlertDescription>
              {"message" in (data || {})
                ? (data as { message: string }).message
                : t("search.no_results_description")}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Xử lý trạng thái loading
  if (isLoading) {
    return (
      <div>
        <div className="relative mb-24">
          <HeroBanner
            imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title={t("banner.home.title")}
            description={t("banner.home.description")}
          />

          <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-4">
            <div className="container mx-auto max-w-6xl">
              <SearchBox
                onSearch={handleSearch}
                defaultValues={{
                  locationName: locationName || undefined,
                  checkIn: finalCheckIn,
                  checkOut: finalCheckOut,
                  capacity: parseInt(finalCapacity),
                }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Filter Section */}
            <div className="col-span-3">
              <FilterSection
                onPriceChange={handlePriceChange}
                onStarChange={handleStarChange}
                onAmenitiesChange={handleAmenitiesChange}
              />
            </div>

            {/* Hotel List Section */}
            <div className="col-span-9">
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
        <div className="relative mb-24">
          <HeroBanner
            imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title={t("banner.home.title")}
            description={t("banner.home.description")}
          />

          <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-4">
            <div className="container mx-auto max-w-6xl">
              <SearchBox
                onSearch={handleSearch}
                defaultValues={{
                  locationName: locationName || undefined,
                  checkIn: finalCheckIn,
                  checkOut: finalCheckOut,
                  capacity: parseInt(finalCapacity),
                }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-8">
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

  const hotels = (data?.data || []).map(
    (item: {
      _id: string;
      name: string;
      address: string;
      rating: number;
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
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div>
      <div className="relative mb-24">
        <HeroBanner
          imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title={t("banner.home.title")}
          description={t("banner.home.description")}
        />

        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-4">
          <div className="container mx-auto max-w-6xl">
            <SearchBox
              onSearch={handleSearch}
              defaultValues={{
                locationName: locationName || undefined,
                checkIn: finalCheckIn,
                checkOut: finalCheckOut,
                capacity: parseInt(finalCapacity),
              }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Filter Section */}
          <div className="col-span-3">
            <FilterSection
              onPriceChange={handlePriceChange}
              onStarChange={handleStarChange}
              onAmenitiesChange={handleAmenitiesChange}
            />
          </div>

          {/* Hotel List Section */}
          <div className="col-span-9">
            <HotelList
              hotels={hotels}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onSortChange={setSortBy}
              onHotelClick={handleHotelClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
