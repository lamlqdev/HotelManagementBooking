import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import SearchBox from "../components/common/SearchBox";
import HeroBanner from "../components/sections/home/HeroBanner";
import PopularDestinations from "../components/sections/home/PopularDestinations";
import HotelDeals from "../components/sections/home/HotelDeals";
import FavoriteHotels from "../components/sections/home/FavoriteHotels";
import TravelInspiration from "../components/sections/home/TravelInspiration";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = (searchParams: {
    destination: string;
    checkIn: Date | undefined;
    checkOut: Date | undefined;
    adults: number;
    children: number;
  }) => {
    // Tạo URL search params
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

    // Chuyển hướng đến trang kết quả tìm kiếm
    navigate(`/search?${params.toString()}`);
  };

  return (
    <>
      <div className="relative">
        <HeroBanner
          imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title={t("banner.home.title")}
          description={t("banner.home.description")}
        />

        {/* SearchBox Container */}
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-4">
          <div className="container mx-auto max-w-6xl">
            <SearchBox onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto mt-24">
        {/* Các section khác của trang chủ */}
        <PopularDestinations />
        <HotelDeals />
        <FavoriteHotels />
        <TravelInspiration />
      </div>
    </>
  );
};

export default HomePage;
