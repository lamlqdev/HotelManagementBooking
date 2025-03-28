import { useState } from "react";
import { BiWifi, BiSwim } from "react-icons/bi";
import { MdBusinessCenter, MdLocalParking, MdAcUnit } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { FaWifi, FaCoffee, FaSmokingBan } from "react-icons/fa";
import { BsWindow } from "react-icons/bs";

import HotelHeader from "@/components/user/hotel-detail/HotelHeader";
import HotelGallery from "@/components/user/hotel-detail/HotelGallery";
import HotelTabs from "@/components/user/hotel-detail/HotelTabs";
import HotelOverview from "@/components/user/hotel-detail/HotelOverview";
import HotelRooms from "@/components/user/hotel-detail/HotelRooms";
import HotelReviews from "@/components/user/hotel-detail/HotelReviews";
import ChatSupport from "@/components/common/ChatSupport";

const HotelDetailPage = () => {
  const [activeTab, setActiveTab] = useState("tổng quan");

  // Mảng hình ảnh từ Unsplash
  const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
  ];

  const nearbyPlaces = [
    { name: "Hotel Penselvenyia", distance: "2 min drive" },
    { name: "Travis Bakery store house", distance: "10 min drive" },
    { name: "Olivia Johnson Garden", distance: "15 min drive" },
    { name: "Norman Opera Circus", distance: "18 min drive" },
    { name: "Rockdeset hotel", distance: "32 min drive" },
  ];

  const amenities = [
    { icon: BiWifi, name: "Free wifi" },
    { icon: MdBusinessCenter, name: "Business Services" },
    { icon: MdLocalParking, name: "Parking available" },
    { icon: BiSwim, name: "Swimming pool" },
    { icon: AiFillLike, name: "Top rated in area" },
  ];

  const roomTypes = [
    {
      id: 1,
      name: "Deluxe Double Room",
      size: "30m²",
      maxGuests: 2,
      bedType: "1 giường đôi lớn",
      price: 1200000,
      originalPrice: 1500000,
      amenities: [
        { icon: FaWifi, name: "WiFi miễn phí" },
        { icon: MdAcUnit, name: "Điều hòa" },
        { icon: FaCoffee, name: "Bữa sáng miễn phí" },
        { icon: BsWindow, name: "View thành phố" },
        { icon: FaSmokingBan, name: "Không hút thuốc" },
      ],
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      perks: ["Hủy phòng miễn phí", "Không cần thanh toán trước"],
    },
    {
      id: 2,
      name: "Premium Twin Room",
      size: "35m²",
      maxGuests: 3,
      bedType: "2 giường đơn",
      price: 1400000,
      originalPrice: 1800000,
      amenities: [
        { icon: FaWifi, name: "WiFi miễn phí" },
        { icon: MdAcUnit, name: "Điều hòa" },
        { icon: FaCoffee, name: "Bữa sáng miễn phí" },
        { icon: BsWindow, name: "View biển" },
        { icon: FaSmokingBan, name: "Không hút thuốc" },
      ],
      image:
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
      perks: ["Hủy phòng miễn phí", "Không cần thanh toán trước"],
    },
  ];

  const reviewStats = {
    overall: 4.5,
    total: 1200,
    distribution: [
      { stars: 5, count: 800 },
      { stars: 4, count: 250 },
      { stars: 3, count: 100 },
      { stars: 2, count: 30 },
      { stars: 1, count: 20 },
    ],
  };

  const reviews = [
    {
      id: 1,
      user: {
        name: "Nguyễn Văn A",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        country: "Việt Nam",
      },
      rating: 5,
      date: "2024-03-15",
      title: "Trải nghiệm tuyệt vời",
      comment:
        "Khách sạn rất sạch sẽ và thoải mái. Nhân viên thân thiện và nhiệt tình. View phòng đẹp, đặc biệt là vào buổi sáng. Sẽ quay lại lần sau.",
      stay: "2 đêm - Phòng Deluxe Double",
      likes: 24,
      photos: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300",
      ],
    },
    {
      id: 2,
      user: {
        name: "Trần Thị B",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        country: "Việt Nam",
      },
      rating: 4,
      date: "2024-03-10",
      title: "Dịch vụ tốt, giá cả hợp lý",
      comment:
        "Vị trí thuận tiện, gần các điểm tham quan. Phòng ốc thoáng mát, sạch sẽ. Bữa sáng đa dạng. Chỉ có điều hơi ồn một chút vào buổi tối.",
      stay: "3 đêm - Phòng Premium Twin",
      likes: 15,
      photos: [],
    },
  ];

  const description = [
    "Featuring free WiFi throughout the property, Lakeside Motel Waterfront offers accommodations in Lakes Entrance, 19 mi from Bairnsdale. Free private parking is available on site.",
    "Each room at this motel is air conditioned and comes with a flat-screen TV. You will find a kettle, toaster and a microwave in the room. Each room is fitted with a private bathroom. Guests have access to barbecue facilities and a lovely large lawn area. Metung is 6.8 mi from Lakeside Motel Waterfront, while Paynesville is 14 mi from the property.",
    "Couples in particular like the location – they rated it 9.2 for a two-person trip.",
  ];

  return (
    <div className="container mx-auto px-4 py-6 pt-32">
      <HotelHeader
        name="Lakeside Motel Warefront"
        rating={4.5}
        totalReviews={1200}
        address="Lorem ipsum road, Tantruim-2322, Melbourne, Australia"
      />

      <HotelGallery images={hotelImages} />

      <HotelTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6 space-y-12">
        <HotelOverview
          description={description}
          amenities={amenities}
          nearbyPlaces={nearbyPlaces}
        />

        <HotelRooms rooms={roomTypes} />

        <HotelReviews reviewStats={reviewStats} reviews={reviews} />
      </div>

      <ChatSupport />
    </div>
  );
};

export default HotelDetailPage;
