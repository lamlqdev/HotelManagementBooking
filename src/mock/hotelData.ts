export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface HotelData {
  id: string;
  name: string;
  description: string;
  address: string;
  mainImage: string;
  galleryImages: string[];
  amenities: string[]; // Array of amenity IDs
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    children: string;
    pets: string;
    smoking: string;
  };
}

// Danh sách tiện nghi có sẵn
export const availableAmenities: Amenity[] = [
  // Tiện nghi cơ bản
  { id: "wifi", name: "WiFi", icon: "wifi", category: "basic" },
  { id: "parking", name: "Bãi đỗ xe", icon: "parking", category: "basic" },
  { id: "elevator", name: "Thang máy", icon: "elevator", category: "basic" },
  {
    id: "air-conditioning",
    name: "Điều hòa",
    icon: "snowflake",
    category: "basic",
  },

  // Tiện nghi phòng
  { id: "minibar", name: "Minibar", icon: "wine", category: "room" },
  { id: "safe", name: "Két sắt", icon: "lock", category: "room" },
  { id: "balcony", name: "Ban công", icon: "sun", category: "room" },
  { id: "ocean-view", name: "View biển", icon: "waves", category: "room" },

  // Tiện nghi giải trí
  { id: "pool", name: "Bể bơi", icon: "waves", category: "entertainment" },
  {
    id: "gym",
    name: "Phòng tập gym",
    icon: "dumbbell",
    category: "entertainment",
  },
  { id: "spa", name: "Spa", icon: "heart", category: "entertainment" },
  {
    id: "tennis",
    name: "Sân tennis",
    icon: "tennis",
    category: "entertainment",
  },

  // Tiện nghi ăn uống
  { id: "restaurant", name: "Nhà hàng", icon: "utensils", category: "dining" },
  { id: "bar", name: "Quầy bar", icon: "wine", category: "dining" },
  { id: "cafe", name: "Quán cà phê", icon: "coffee", category: "dining" },
  {
    id: "room-service",
    name: "Dịch vụ phòng",
    icon: "bell",
    category: "dining",
  },

  // Tiện nghi kinh doanh
  {
    id: "meeting-room",
    name: "Phòng họp",
    icon: "users",
    category: "business",
  },
  {
    id: "business-center",
    name: "Trung tâm kinh doanh",
    icon: "briefcase",
    category: "business",
  },
  {
    id: "conference-hall",
    name: "Hội trường",
    icon: "presentation",
    category: "business",
  },
];

export const mockHotelData: HotelData = {
  id: "1",
  name: "Grand Hotel Saigon",
  description:
    "Grand Hotel Saigon là một khách sạn 5 sao sang trọng nằm ở trung tâm thành phố Hồ Chí Minh. Với thiết kế hiện đại kết hợp nét đẹp truyền thống, khách sạn mang đến trải nghiệm nghỉ dưỡng đẳng cấp cho du khách.",
  address: "8 Đồng Khởi, Quận 1, TP.HCM",
  mainImage:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
  galleryImages: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590073242678-7ee70c0b31cd?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590073242678-7ee70c0b31cd?q=80&w=1000&auto=format&fit=crop",
  ],
  amenities: [
    "wifi",
    "parking",
    "pool",
    "restaurant",
    "gym",
    "spa",
    "room-service",
    "meeting-room",
  ],
  contactInfo: {
    phone: "+84 28 3829 5517",
    email: "info@grandhotelsaigon.com",
    website: "www.grandhotelsaigon.com",
  },
  policies: {
    checkIn: "14:00",
    checkOut: "12:00",
    cancellation: "Miễn phí hủy phòng trước 24h",
    children:
      "Trẻ em dưới 12 tuổi được miễn phí khi ngủ chung giường với bố mẹ",
    pets: "Không chấp nhận thú cưng",
    smoking: "Có khu vực hút thuốc riêng",
  },
};
