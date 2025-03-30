import { useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  BedDouble,
  Users,
  Wifi,
  Tv,
  Coffee,
  Dumbbell,
  ArrowLeft,
  Calendar,
  Clock,
  Shield,
  Ruler,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { EditRoomDialog } from "@/components/partner/room-management/dialog/EditRoomDialog";
import { DeleteRoomDialog } from "@/components/partner/room-management/dialog/DeleteRoomDialog";
import { UpdatePriceDialog } from "@/components/partner/room-management/dialog/UpdatePriceDialog";
import { AddPromotionDialog } from "@/components/partner/room-management/dialog/AddPromotionDialog";
import { Room } from "@/types/room";

// Mock data - sau này sẽ được thay thế bằng API call
const roomDetail: Room = {
  id: 1,
  name: "Phòng Deluxe",
  type: "Deluxe",
  price: 1500000,
  floor: 2,
  images: [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1974&auto=format&fit=crop",
  ],
  description:
    "Phòng Deluxe rộng rãi với tầm nhìn đẹp ra thành phố, được trang bị đầy đủ tiện nghi hiện đại. Phòng có diện tích 35m² với giường đôi rộng rãi, phòng tắm riêng và ban công thoáng mát.",
  amenities: [
    { name: "WiFi miễn phí", icon: Wifi, selected: true },
    { name: "TV màn hình phẳng", icon: Tv, selected: true },
    { name: "Máy pha cà phê", icon: Coffee, selected: true },
    { name: "Phòng tập gym", icon: Dumbbell, selected: true },
  ],
  capacity: 2,
  bedType: "Giường đôi",
  size: "35m²",
  checkIn: "14:00",
  checkOut: "12:00",
  cancelPolicy: "Miễn phí hủy trong vòng 24h trước khi nhận phòng",
  promotions: [
    {
      id: 1,
      name: "Giảm 20% cho đặt phòng trước 7 ngày",
      discount: 20,
      validUntil: "2024-12-31",
      code: "EARLY20",
    },
    {
      id: 2,
      name: "Tặng 1 đêm miễn phí cho đặt 3 đêm",
      discount: 100,
      validUntil: "2024-12-31",
      code: "STAY3GET1",
    },
  ],
};

export default function RoomDetailPage() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoom, setEditedRoom] = useState<Room>(roomDetail);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = (updatedRoom: Room) => {
    setEditedRoom(updatedRoom);
    setIsEditing(false);
  };

  const handleUpdatePrice = (price: number) => {
    setEditedRoom({ ...editedRoom, price });
    setIsUpdatingPrice(false);
  };

  const handleDelete = () => {
    // TODO: Implement API call to delete room
    setIsDeleting(false);
  };

  const handleAddPromotion = (promotion: {
    name: string;
    code: string;
    discount: number;
    validUntil: string;
  }) => {
    // TODO: Implement API call to add promotion
    console.log("Adding promotion:", promotion);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/partner/hotels/rooms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Chi tiết phòng
          </h1>
        </div>
        <div className="flex gap-3">
          <EditRoomDialog
            room={editedRoom}
            isOpen={isEditing}
            onOpenChange={setIsEditing}
            onSave={handleSave}
          />
          <DeleteRoomDialog
            roomName={editedRoom.name}
            isOpen={isDeleting}
            onOpenChange={setIsDeleting}
            onDelete={handleDelete}
            onConfirmNameChange={(name) =>
              setEditedRoom({ ...editedRoom, name })
            }
          />
        </div>
      </div>

      {/* Image Gallery */}
      <Card className="overflow-hidden border border-border/50 shadow-sm">
        <div className="relative h-[600px]">
          <img
            src={roomDetail.images[currentImageIndex]}
            alt={`${roomDetail.name} - Hình ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-4xl font-bold text-white mb-2">
                {roomDetail.name}
              </h2>
              <p className="text-xl text-white/90">{roomDetail.type}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            onClick={() =>
              setCurrentImageIndex(
                (prev) =>
                  (prev - 1 + roomDetail.images.length) %
                  roomDetail.images.length
              )
            }
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            onClick={() =>
              setCurrentImageIndex(
                (prev) => (prev + 1) % roomDetail.images.length
              )
            }
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full text-white">
            <ImageIcon className="w-4 h-4" />
            <span>
              {currentImageIndex + 1}/{roomDetail.images.length}
            </span>
          </div>
        </div>
        <div className="p-4 flex gap-2 overflow-x-auto">
          {roomDetail.images.map((image, index) => (
            <div
              key={index}
              className={`relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 ${
                currentImageIndex === index ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Room Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Thông tin cơ bản
                  </h3>
                  <p className="text-muted-foreground">
                    {roomDetail.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tầng</p>
                      <p className="font-medium">{roomDetail.floor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <BedDouble className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Loại giường
                      </p>
                      <p className="font-medium">{roomDetail.bedType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sức chứa</p>
                      <p className="font-medium">{roomDetail.capacity} người</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Ruler className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Diện tích</p>
                      <p className="font-medium">{roomDetail.size}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Tiện nghi
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {roomDetail.amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <span>{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Cài đặt phòng
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Thời gian check-in/out</h4>
                    <p className="text-muted-foreground">
                      Check-in: {roomDetail.checkIn} - Check-out:{" "}
                      {roomDetail.checkOut}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Chính sách hủy</h4>
                    <p className="text-muted-foreground">
                      {roomDetail.cancelPolicy}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Tình trạng đặt phòng</h4>
                    <p className="text-muted-foreground">Đang có sẵn</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Pricing & Promotions */}
        <div className="space-y-6">
          {/* Price */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Giá phòng
              </h3>
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary">
                  {editedRoom.price.toLocaleString()}đ
                </p>
                <p className="text-muted-foreground">/ đêm</p>
              </div>
              <UpdatePriceDialog
                price={editedRoom.price}
                isOpen={isUpdatingPrice}
                onOpenChange={setIsUpdatingPrice}
                onUpdate={handleUpdatePrice}
              />
            </CardContent>
          </Card>

          {/* Promotions */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Khuyến mãi
                </h3>
                <AddPromotionDialog onAdd={handleAddPromotion} />
              </div>
              <div className="space-y-4">
                {roomDetail.promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                  >
                    <div>
                      <h4 className="font-medium">{promo.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Mã: {promo.code} | HSD: {promo.validUntil}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">
                        -{promo.discount}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
