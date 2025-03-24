import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useState } from "react";

import HeroBanner from "@/components/sections/home/HeroBanner";
import SearchBox from "@/components/common/SearchBox";
import HotelList from "@/components/sections/search/HotelList";
import FilterSection from "@/components/sections/search/FilterSection";

const mockHotels = [
  {
    id: "1",
    name: "Vinpearl Resort & Spa",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    stars: 5,
    price: 2500000,
    originalPrice: 3000000,
    location: "Nha Trang, Khánh Hòa",
    rating: 4.8,
    reviewCount: 1234,
  },
  // ... thêm các khách sạn khác
];

const SearchResultPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [filteredHotels, setFilteredHotels] = useState(mockHotels);

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
    setFilteredHotels(
      mockHotels.filter((hotel) => hotel.price >= min && hotel.price <= max)
    );
  };

  const handleStarChange = (stars: number[]) => {
    if (stars.length === 0) {
      setFilteredHotels(mockHotels);
    } else {
      setFilteredHotels(
        mockHotels.filter((hotel) => stars.includes(hotel.stars))
      );
    }
  };

  const handleAmenitiesChange = (amenities: string[]) => {
    // Trong thực tế sẽ lọc theo tiện ích
    console.log("Selected amenities:", amenities);
  };

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
              hotels={filteredHotels}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredHotels.length / 10)}
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
