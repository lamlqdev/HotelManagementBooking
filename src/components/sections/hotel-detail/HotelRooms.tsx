import { FaBed, FaUserFriends } from "react-icons/fa";
import { IconType } from "react-icons";

interface RoomAmenity {
  icon: IconType;
  name: string;
}

interface RoomType {
  id: number;
  name: string;
  size: string;
  maxGuests: number;
  bedType: string;
  price: number;
  originalPrice: number;
  amenities: RoomAmenity[];
  image: string;
  perks: string[];
}

interface HotelRoomsProps {
  rooms: RoomType[];
}

const HotelRooms = ({ rooms }: HotelRoomsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section id="phòng">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Danh sách phòng
      </h2>
      <div className="space-y-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-card rounded-lg shadow-md overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Room Image */}
              <div className="relative h-[200px] md:h-full">
                <img
                  src={room.image}
                  alt={room.name}
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
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <FaBed />
                            <span>{room.bedType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaUserFriends />
                            <span>{room.maxGuests} khách</span>
                          </div>
                          <span>{room.size}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground line-through text-sm">
                          {formatPrice(room.originalPrice)}
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(room.price)}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          /phòng/đêm
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-4">
                        {room.amenities.map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 text-muted-foreground"
                          >
                            <amenity.icon className="text-primary" />
                            <span className="text-sm">{amenity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="space-y-1 mb-4">
                      {room.perks.map((perk, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-green-600"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                          {perk}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Book Button */}
                  <button className="w-full md:w-auto md:self-end bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Đặt ngay
                  </button>
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
