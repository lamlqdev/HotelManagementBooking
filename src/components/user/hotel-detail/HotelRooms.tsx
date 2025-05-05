import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { FaBed, FaUserFriends, FaRulerCombined } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Room } from "@/types/room";
import { getAmenityIcon } from "@/utils/amenityIcons";

interface HotelRoomsProps {
  rooms: Room[];
  checkIn?: string;
  checkOut?: string;
  capacity?: number;
  hotelId?: string;
}

const HotelRooms = ({
  rooms,
  checkIn,
  checkOut,
  capacity,
  hotelId,
}: HotelRoomsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const handleBookRoom = (roomId: string) => {
    const params = new URLSearchParams();
    if (hotelId) params.append("hotelId", hotelId);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (capacity) params.append("capacity", capacity.toString());

    navigate(`/booking-information/${roomId}?${params.toString()}`);
  };

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <img
          src="/no-data.svg"
          alt="No rooms available"
          className="mx-auto h-48 w-48 mb-4"
        />
        <p className="text-muted-foreground">
          {t("hotel.rooms.no_rooms_available")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">{t("hotel.rooms.title")}</h3>
      {checkIn && checkOut && capacity && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-100 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">
                {t("hotel.rooms.search_info", {
                  checkIn: formatDate(checkIn),
                  checkOut: formatDate(checkOut),
                  capacity,
                })}
              </p>
            </div>
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {rooms.map((room) => (
          <Card
            key={room._id}
            className="flex flex-row items-center rounded-xl shadow-sm overflow-hidden"
          >
            {/* Hình ảnh */}
            <div className="w-[35%] min-w-[160px] h-40 md:h-48 flex-shrink-0">
              <img
                src={room.images?.[0]?.url || "/placeholder-room.jpg"}
                alt={room.roomName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thông tin phòng */}
            <div className="flex-1 flex flex-row items-center justify-between px-6 py-4 bg-white">
              <div>
                <h4 className="text-lg font-semibold mb-2">{room.roomName}</h4>
                <div className="flex items-center gap-4 mb-2 text-muted-foreground">
                  <div className="flex items-center gap-1 text-base">
                    <FaBed /> {room.bedType}
                  </div>
                  <div className="flex items-center gap-1 text-base">
                    <FaUserFriends /> {room.capacity} người
                  </div>
                  <div className="flex items-center gap-1 text-base">
                    <FaRulerCombined /> {room.squareMeters}m²
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-primary border-none"
                    >
                      {getAmenityIcon(amenity.icon || "")}
                      <span>{amenity.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Giá và nút đặt phòng */}
              <div className="flex flex-col items-end min-w-[140px] ml-6">
                <p className="text-2xl font-bold text-primary mb-1">
                  {formatPrice(room.price)}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {t("hotel.rooms.per_night")}
                </p>
                <Button
                  onClick={() => handleBookRoom(room._id)}
                  className="w-full"
                >
                  {t("hotel.rooms.book_now")}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HotelRooms;
