import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { roomApi } from "@/api/room/room.api";
import { CreateRoomFormData } from "@/api/room/types";
import { useAppSelector } from "@/store/hooks";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";

import { AddRoomDialog } from "@/components/partner/room-management/dialog/AddRoomDialog";

import {
  Search,
  SlidersHorizontal,
  Building2,
  ArrowUp,
  ArrowDown,
  Eye,
  Loader2,
  AlertCircle,
  Hotel,
} from "lucide-react";

type SortField = "name" | "price";
type SortOrder = "asc" | "desc";

export default function RoomManagementPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomType, setRoomType] = useState<string>("all");
  const [floor, setFloor] = useState<string>("all");

  // Lấy thông tin hotel từ Redux
  const { currentHotel } = useAppSelector((state) => state.hotel);

  // Xử lý sắp xếp
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Lấy danh sách phòng từ API
  const {
    data: roomsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["rooms", currentHotel?._id],
    queryFn: () => roomApi.getRooms(currentHotel?._id || ""),
    enabled: !!currentHotel?._id,
  });

  // Mutation để thêm phòng mới
  const addRoomMutation = useMutation({
    mutationFn: (data: CreateRoomFormData) => {
      return roomApi.createRoom(currentHotel?._id || "", data);
    },
    onSuccess: () => {
      // Cập nhật lại danh sách phòng
      queryClient.invalidateQueries({ queryKey: ["rooms", currentHotel?._id] });
      toast.success(t("room.dialog.add.success"));
    },
    onError: (error) => {
      console.error("Error adding room:", error);
      toast.error(t("room.dialog.add.error"));
    },
  });

  // Xử lý thêm phòng mới
  const handleAddRoom = (newRoom: CreateRoomFormData) => {
    if (!currentHotel?._id) {
      toast.error(t("info.noHotelSelected"));
      return;
    }

    addRoomMutation.mutate(newRoom);
  };

  // Lọc và sắp xếp phòng
  const filteredRooms =
    roomsData?.data.filter((room) => {
      // Lọc theo tên phòng
      if (
        searchTerm &&
        !room.roomName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Lọc theo loại phòng
      if (roomType !== "all" && room.roomType !== roomType) {
        return false;
      }

      // Lọc theo tầng
      if (floor !== "all" && room.floor.toString() !== floor) {
        return false;
      }

      // Lọc theo khoảng giá
      if (room.price < priceRange[0] || room.price > priceRange[1]) {
        return false;
      }

      return true;
    }) || [];

  // Sắp xếp phòng
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortField === "name") {
      return sortOrder === "asc"
        ? a.roomName.localeCompare(b.roomName)
        : b.roomName.localeCompare(a.roomName);
    } else {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    }
  });

  // Nếu đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
        <Skeleton className="h-[100px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Nếu có lỗi
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("room.management.title")}</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error.title")}</AlertTitle>
          <AlertDescription>{t("error.loadRoomsFailed")}</AlertDescription>
        </Alert>
        <Button onClick={() => refetch()}>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  // Nếu không có khách sạn
  if (!currentHotel) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("room.management.title")}</h1>
        </div>
        <Alert>
          <Hotel className="h-4 w-4" />
          <AlertTitle>{t("info.title")}</AlertTitle>
          <AlertDescription>{t("info.noHotelSelected")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Nếu không có phòng nào
  if (roomsData?.data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("room.management.title")}</h1>
          <div className="flex gap-2">
            <AddRoomDialog
              onAdd={handleAddRoom}
              isLoading={addRoomMutation.isPending}
            />
          </div>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("info.title")}</AlertTitle>
          <AlertDescription>{t("info.noRoomsFound")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Nếu không có phòng nào sau khi lọc
  if (sortedRooms.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("room.management.title")}</h1>
          <div className="flex gap-2">
            <AddRoomDialog
              onAdd={handleAddRoom}
              isLoading={addRoomMutation.isPending}
            />
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("room.management.room_type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("room.management.all")}
                    </SelectItem>
                    <SelectItem value="Standard">
                      {t("room.management.standard")}
                    </SelectItem>
                    <SelectItem value="Superior">
                      {t("room.management.superior")}
                    </SelectItem>
                    <SelectItem value="Deluxe">
                      {t("room.management.deluxe")}
                    </SelectItem>
                    <SelectItem value="Suite">
                      {t("room.management.suite")}
                    </SelectItem>
                    <SelectItem value="Family">
                      {t("room.management.family")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={floor} onValueChange={setFloor}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("room.management.floor")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("room.management.all")}
                    </SelectItem>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {t("room.management.floor_number", { number: i })}
                      </SelectItem>
                    ))}
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

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("info.title")}</AlertTitle>
          <AlertDescription>{t("info.noRoomsMatchFilter")}</AlertDescription>
        </Alert>
        <Button
          onClick={() => {
            setSearchTerm("");
            setRoomType("all");
            setFloor("all");
            setPriceRange([0, 5000000]);
          }}
        >
          {t("common.clearFilters")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("room.management.title")}</h1>
        <div className="flex gap-2">
          <AddRoomDialog
            onAdd={handleAddRoom}
            isLoading={addRoomMutation.isPending}
          />
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("room.management.room_type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("room.management.all")}
                  </SelectItem>
                  <SelectItem value="Standard">
                    {t("room.management.standard")}
                  </SelectItem>
                  <SelectItem value="Superior">
                    {t("room.management.superior")}
                  </SelectItem>
                  <SelectItem value="Deluxe">
                    {t("room.management.deluxe")}
                  </SelectItem>
                  <SelectItem value="Suite">
                    {t("room.management.suite")}
                  </SelectItem>
                  <SelectItem value="Family">
                    {t("room.management.family")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={floor} onValueChange={setFloor}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("room.management.floor")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("room.management.all")}
                  </SelectItem>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {t("room.management.floor_number", { number: i })}
                    </SelectItem>
                  ))}
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
        {sortedRooms.map((room) => (
          <Card key={room._id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={
                  room.images && room.images.length > 0
                    ? room.images[0].url
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={room.roomName}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{room.roomName}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {room.roomType}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 mr-1" />
                  {t("room.management.floor")} {room.floor}
                </div>
                <div className="font-semibold">
                  {room.price.toLocaleString()}đ
                </div>
              </div>
              <Link to={`/partner/hotels/rooms/${room._id}`}>
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
