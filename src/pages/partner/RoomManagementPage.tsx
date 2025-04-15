import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  Building2,
  ArrowUp,
  ArrowDown,
  Eye,
  Activity,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Link } from "react-router";
import { AddRoomDialog } from "@/components/partner/room-management/dialog/AddRoomDialog";
import { useTranslation } from "react-i18next";

interface Room {
  name: string;
  type: string;
  description: string;
  floor: number;
  bedType: string;
  capacity: number;
  size: string;
  price: number;
  images: string[];
  amenities: string[];
}

// Mock data - sau này sẽ được thay thế bằng API call
const rooms = [
  {
    id: 1,
    name: "Phòng Deluxe",
    type: "Deluxe",
    price: 1500000,
    floor: 2,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Phòng Suite",
    type: "Suite",
    price: 2500000,
    floor: 3,
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1974&auto=format&fit=crop",
  },
  // Thêm các phòng khác ở đây
];

type SortField = "name" | "price";
type SortOrder = "asc" | "desc";

export default function RoomManagementPage() {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [priceRange, setPriceRange] = useState([0, 5000000]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAddRoom = (room: Room) => {
    // TODO: Implement API call to add new room
    console.log("Adding new room:", room);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("room.management.title")}</h1>
        <div className="flex gap-2">
          <Link to="/partner/room-status">
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              {t("room.management.status")}
            </Button>
          </Link>
          <AddRoomDialog onAdd={handleAddRoom} />
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("room.management.search_placeholder")}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("room.management.room_type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("room.management.all")}
                  </SelectItem>
                  <SelectItem value="deluxe">
                    {t("room.management.deluxe")}
                  </SelectItem>
                  <SelectItem value="suite">
                    {t("room.management.suite")}
                  </SelectItem>
                  <SelectItem value="standard">
                    {t("room.management.standard")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("room.management.floor")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("room.management.all")}
                  </SelectItem>
                  <SelectItem value="1">
                    {t("room.management.floor_1")}
                  </SelectItem>
                  <SelectItem value="2">
                    {t("room.management.floor_2")}
                  </SelectItem>
                  <SelectItem value="3">
                    {t("room.management.floor_3")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    {t("room.management.filter")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {t("room.management.advanced_filter")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>{t("room.management.price_range")}</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={5000000}
                        step={100000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{priceRange[0].toLocaleString()}đ</span>
                        <span>{priceRange[1].toLocaleString()}đ</span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thanh sắp xếp */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {t("room.management.sort_by")}:
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort("name")}
            className="flex items-center gap-1"
          >
            {t("room.management.name")}
            {sortField === "name" &&
              (sortOrder === "asc" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              ))}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort("price")}
            className="flex items-center gap-1"
          >
            {t("room.management.price")}
            {sortField === "price" &&
              (sortOrder === "asc" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              ))}
          </Button>
        </div>
      </div>

      {/* Grid phòng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{room.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{room.type}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 mr-1" />
                  {t("room.management.floor")} {room.floor}
                </div>
                <div className="font-semibold">
                  {room.price.toLocaleString()}đ
                </div>
              </div>
              <Link to={`/partner/hotels/rooms/${room.id}`}>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  {t("room.management.view_details")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
