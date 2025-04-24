import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
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

  // Lấy các tham số từ URL
  const locationId = searchParams.get("locationId");
  // Các tham số khác có thể được sử dụng trong tương lai
  // const checkIn = searchParams.get("checkIn");
  // const checkOut = searchParams.get("checkOut");
  // const adults = searchParams.get("adults");
  // const children = searchParams.get("children");

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");

  // Sử dụng React Query để lấy danh sách khách sạn
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["hotels", locationId, currentPage, sortBy],
    queryFn: () => {
      if (locationId) {
        return hotelApi.getHotelsByLocation(locationId);
      } else {
        // Nếu không có locationId, trả về danh sách khách sạn mặc định
        return hotelApi.getHotels({
          page: currentPage,
          limit: 10,
          sort: sortBy,
        });
      }
    },
    enabled: !!locationId || currentPage > 0,
  });

  const handleSearch = (searchParams: {
    destination: string;
    checkIn: Date | undefined;
    checkOut: Date | undefined;
    adults: number;
    children: number;
  }) => {
    const params = new URLSearchParams();
    params.append("destination", searchParams.destination);
    if (searchParams.checkIn) {
      params.append("checkIn", searchParams.checkIn.toISOString());
    }
    if (searchParams.checkOut) {
      params.append("checkOut", searchParams.checkOut.toISOString());
    }
    params.append("adults", searchParams.adults.toString());
    params.append("children", searchParams.children.toString());

    navigate(`/search?${params.toString()}`);
  };

  // Handlers for filters
  const handlePriceChange = (range: [number, number]) => {
    const [min, max] = range;
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("minPrice", min.toString());
      newParams.set("maxPrice", max.toString());
      return newParams;
    });
  };

  const handleStarChange = (stars: number[]) => {
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev);
      if (stars.length > 0) {
        newParams.set("stars", stars.join(","));
      } else {
        newParams.delete("stars");
      }
      return newParams;
    });
  };

  const handleAmenitiesChange = (amenities: string[]) => {
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev);
      if (amenities.length > 0) {
        newParams.set("amenities", amenities.join(","));
      } else {
        newParams.delete("amenities");
      }
      return newParams;
    });
  };

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
              <SearchBox onSearch={handleSearch} />
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
              <SearchBox onSearch={handleSearch} />
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

  const hotels = data?.data || [];
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
            <SearchBox onSearch={handleSearch} />
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
