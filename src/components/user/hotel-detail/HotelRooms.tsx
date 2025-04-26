import { useNavigate } from "react-router";
import { FaBed, FaUserFriends, FaRulerCombined } from "react-icons/fa";

import { Room } from "@/types/room";
import { getAmenityIcon } from "@/utils/amenityIcons";

interface HotelRoomsProps {
  rooms: Room[];
}

const HotelRooms = ({ rooms }: HotelRoomsProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleBookRoom = (roomId: string) => {
    navigate(`/booking-information?roomId=${roomId}`);
  };

  return (
    <section id="phòng">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Danh sách phòng
      </h2>
      <div className="space-y-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-card rounded-lg shadow-md overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Room Image */}
              <div className="relative h-[200px] md:h-full">
                <img
                  src={
                    room.images && room.images.length > 0
                      ? room.images[0].url
                      : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"
                  }
                  alt={room.roomName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Room Details */}
              <div className="p-6 md:col-span-2">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                          {room.roomName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <FaBed />
                            <span>{room.bedType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaUserFriends />
                            <span>{room.capacity} khách</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaRulerCombined />
                            <span>{room.squareMeters}m²</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground line-through text-sm">
                          {formatPrice(room.price)}
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(
                            room.price * (1 - room.discountPercent / 100)
                          )}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          /phòng/đêm
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-4">
                        {room.amenities.map((amenity, index) => {
                          const IconComponent = getAmenityIcon(
                            amenity.icon || "wifi"
                          );
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-1 text-muted-foreground"
                            >
                              {IconComponent}
                              <span className="text-sm">{amenity.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="space-y-1 mb-4">
                      {room.cancellationPolicy === "flexible" && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                          Hủy phòng miễn phí
                        </div>
                      )}
                      {room.cancellationPolicy === "moderate" && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                          Hủy phòng với phí phạt
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        Không cần thanh toán trước
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleBookRoom(room._id)}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HotelRooms;
