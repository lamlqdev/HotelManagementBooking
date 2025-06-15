import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { FaBed, FaUserFriends, FaRulerCombined } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Room } from "@/types/room";
import { getAmenityIcon } from "@/utils/amenityIcons";
import NoData from "@/assets/illustration/NoData.svg";

interface HotelRoomsProps {
  rooms: Room[];
  checkIn?: string;
  checkOut?: string;
  capacity?: number;
  hotelId?: string;
  selectedAmenities?: string[];
}

const HotelRooms = ({
  rooms,
  checkIn,
  checkOut,
  capacity,
  hotelId,
  selectedAmenities = [],
}: HotelRoomsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Filter rooms based on selected amenities if any
  const filteredRooms =
    selectedAmenities.length > 0
      ? rooms.filter((room) =>
          selectedAmenities.every((amenityId) =>
            room.amenities.some((amenity) => amenity._id === amenityId)
          )
        )
      : rooms;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBookRoom = (roomId: string) => {
    const params = new URLSearchParams();
    if (hotelId) params.append("hotelId", hotelId);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (capacity) params.append("capacity", capacity.toString());

    if (selectedAmenities.length > 0) {
      params.append("amenities", selectedAmenities.join(","));
    }
    navigate(`/booking-information/${roomId}?${params.toString()}`);
  };

  if (filteredRooms.length === 0) {
    return (
      <div className="text-center py-12">
        <img
          src={NoData}
          alt="No rooms available"
          className="mx-auto h-48 w-48 mb-4"
        />
        <p className="text-muted-foreground">
          {selectedAmenities.length > 0
            ? t("hotel.rooms.no_rooms_with_amenities")
            : t("hotel.rooms.no_rooms_available")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {filteredRooms.map((room) => (
          <Card
            key={room._id}
            className="flex flex-row items-center rounded-xl shadow-sm overflow-hidden"
          >
            {/* Hình ảnh */}
            <div className="w-[35%] min-w-[160px] h-40 md:h-48 flex-shrink-0">
              <img
                src={room.images?.[0]?.url || "/placeholder-room.jpg"}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thông tin phòng */}
            <div className="flex-1 flex flex-row items-center justify-between px-6 py-4 bg-white">
              <div>
                <h4 className="text-lg font-semibold mb-2">{room.name}</h4>
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
