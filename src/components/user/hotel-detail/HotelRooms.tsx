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
          selectedAmenities.some((amenityId) =>
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
      <div className="text-center py-8 sm:py-12">
        <img
          src={NoData}
          alt="No rooms available"
          className="mx-auto h-32 w-32 sm:h-48 sm:w-48 mb-4"
        />
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          {selectedAmenities.length > 0
            ? t("hotel.rooms.no_rooms_with_amenities")
            : t("hotel.rooms.no_rooms_available")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-6">
        {filteredRooms.map((room) => (
          <Card
            key={room._id}
            className="flex flex-col sm:flex-row items-stretch sm:items-center bg-background rounded-xl border border-border shadow-sm overflow-hidden"
          >
            {/* Room Image */}
            <div className="w-full sm:w-[35%] sm:min-w-[160px] h-48 sm:h-40 md:h-48 flex-shrink-0">
              <img
                src={room.images?.[0]?.url || "/placeholder-room.jpg"}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Room Information */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-background px-4 sm:px-6 py-4 gap-4">
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold mb-2">
                  {room.name}
                </h4>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-2 text-muted-foreground">
                  <div className="flex items-center gap-1 text-sm sm:text-base">
                    <FaBed /> <span>{room.bedType}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm sm:text-base">
                    <FaUserFriends /> <span>{room.capacity} người</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm sm:text-base">
                    <FaRulerCombined /> <span>{room.squareMeters}m²</span>
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
              {/* Price and Book Button */}
              <div className="flex flex-col items-start sm:items-end sm:min-w-[140px] sm:ml-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                <div className="text-left sm:text-right mb-2 w-full sm:w-auto">
                  {room.discountPercent > 0 ? (
                    <>
                      <p className="text-xl sm:text-2xl font-bold text-primary mb-1">
                        {formatPrice(
                          room.price * (1 - room.discountPercent / 100)
                        )}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground line-through">
                        {formatPrice(room.price)}
                      </p>
                      <Badge variant="destructive" className="text-xs mt-1">
                        -{room.discountPercent}%
                      </Badge>
                    </>
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold text-primary mb-1">
                      {formatPrice(room.price)}
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3 sm:mb-2">
                  {t("hotel.rooms.per_night")}
                </p>
                <Button
                  onClick={() => handleBookRoom(room._id)}
                  className="w-full sm:w-auto"
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
