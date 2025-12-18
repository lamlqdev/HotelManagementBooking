import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import SearchBox from "@/components/common/SearchBox";
import HeroBanner from "@/components/common/HeroBanner";
import PopularDestinations from "@/components/user/home/PopularDestinations";
import HotelDeals from "@/components/user/home/HotelDeals";
import FavouriteHotels from "@/components/user/home/FavouriteHotels";
import TravelInspiration from "@/components/user/home/TravelInspiration";
import ChatBot from "@/components/common/ChatBot";
//import GeminiChatBot from "@/components/common/GeminiChatBot";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = (searchParams: {
    locationName: string;
    checkIn: string;
    checkOut: string;
    capacity: number;
  }) => {
    // Tạo URL search params
    const params = new URLSearchParams();
    params.append("locationName", searchParams.locationName);
    params.append("checkIn", searchParams.checkIn);
    params.append("checkOut", searchParams.checkOut);
    params.append("capacity", searchParams.capacity.toString());

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
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-3 sm:px-4 md:px-6 lg:px-8 z-20">
          <div className="container mx-auto max-w-6xl">
            <SearchBox onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto md:mt-24 mt-56">
        {/* Các section khác của trang chủ */}
        <PopularDestinations />
        <HotelDeals />
        <FavouriteHotels />
        <TravelInspiration />
      </div>

      {/* ChatBots */}
      <ChatBot />
      {/* <GeminiChatBot /> */}
    </>
  );
};

export default HomePage;
