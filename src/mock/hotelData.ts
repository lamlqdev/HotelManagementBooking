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
export const availableAmenities = [
  { id: "wifi", name: "WiFi", icon: "wifi" },
  { id: "parking", name: "Bãi đỗ xe", icon: "parking" },
  { id: "elevator", name: "Thang máy", icon: "elevator" },
  { id: "air-conditioning", name: "Điều hòa", icon: "air-conditioning" },
  { id: "minibar", name: "Mini bar", icon: "minibar" },
  { id: "safe", name: "Két sắt", icon: "safe" },
  { id: "balcony", name: "Ban công", icon: "balcony" },
  { id: "ocean-view", name: "View biển", icon: "ocean-view" },
  { id: "pool", name: "Bể bơi", icon: "pool" },
  { id: "gym", name: "Phòng gym", icon: "gym" },
  { id: "spa", name: "Spa", icon: "spa" },
  { id: "tennis", name: "Sân tennis", icon: "tennis" },
  { id: "restaurant", name: "Nhà hàng", icon: "restaurant" },
  { id: "bar", name: "Bar", icon: "bar" },
  { id: "cafe", name: "Café", icon: "cafe" },
  { id: "room-service", name: "Dịch vụ phòng", icon: "room-service" },
  { id: "meeting-room", name: "Phòng họp", icon: "meeting-room" },
  {
    id: "business-center",
    name: "Trung tâm kinh doanh",
    icon: "business-center",
  },
  { id: "conference-hall", name: "Hội trường", icon: "conference-hall" },
];

export const mockHotelData = {
  id: "1",
  name: "Grand Hotel",
  address: "123 Beach Road, Nha Trang",
  description: "Khách sạn 5 sao với view biển tuyệt đẹp",
  mainImage:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  galleryImages: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
  ],
  amenities: [
    "wifi",
    "parking",
    "elevator",
    "air-conditioning",
    "pool",
    "restaurant",
    "bar",
    "room-service",
  ],
  contactInfo: {
    representativeName: "Nguyễn Văn A",
    phone: "+84 123 456 789",
    email: "info@grandhotel.com",
    website: "www.grandhotel.com",
  },
  policies: {
    checkIn: "14:00",
    checkOut: "12:00",
    cancellation: "Miễn phí hủy phòng trong vòng 24h trước khi check-in",
    children:
      "Trẻ em dưới 12 tuổi được miễn phí khi ngủ chung giường với bố mẹ",
    pets: "Không chấp nhận thú cưng",
    smoking: "Cấm hút thuốc trong toàn bộ khách sạn",
  },
};
