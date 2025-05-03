import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { roomApi } from "@/api/room/room.api";
import { useAppSelector } from "@/store/hooks";
import { Room } from "@/types/room";
import { formatDate } from "@/utils/timeUtils";

import { Eye } from "lucide-react";

export default function RoomStatusPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<Room | null>(
    null
  );

  // Lấy thông tin hotel từ Redux
  const { currentHotel } = useAppSelector((state) => state.hotel);

  // Lấy danh sách phòng từ API
  const { data: roomsData, isLoading } = useQuery({
    queryKey: ["rooms", currentHotel?._id, currentPage],
    queryFn: () =>
      roomApi.getRooms(currentHotel?._id || "", {
        page: currentPage,
        limit: 10,
      }),
    enabled: !!currentHotel?._id,
  });

  const handleViewDetails = (room: Room) => {
    setSelectedRoomDetails(room);
    setShowDetails(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="secondary" className="bg-[#e8f1f8] text-[#1167b1]">
            Trống
          </Badge>
        );
      case "booked":
        return (
          <Badge variant="default" className="bg-[#1167b1] text-white">
            Đã đặt
          </Badge>
        );
      case "maintenance":
        return <Badge variant="destructive">Đang bảo trì</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStatusDot = (status: string) => {
    const baseClass = "w-2 h-2 rounded-full";
    switch (status) {
      case "available":
        return `${baseClass} bg-[#1167b1]/30`;
      case "booked":
        return `${baseClass} bg-[#1167b1]`;
      case "maintenance":
        return `${baseClass} bg-destructive`;
      default:
        return `${baseClass} bg-muted`;
    }
  };

  const totalPages = roomsData?.pagination?.totalPages || 1;
  const allRooms = roomsData?.data || [];

  // Lấy danh sách tầng duy nhất từ danh sách phòng
  const uniqueFloors = Array.from(
    new Set(allRooms.map((room: Room) => room.floor))
  ).sort((a, b) => a - b);

  // Lọc phòng theo tầng và trạng thái
  const rooms = allRooms.filter((room: Room) => {
    const matchesFloor =
      selectedFloor === "all" || room.floor === parseInt(selectedFloor);
    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;
    return matchesFloor && matchesStatus;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Quản lý tình trạng phòng</h1>
            <p className="text-muted-foreground mt-2">
              Xem và quản lý tình trạng các phòng trong khách sạn
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Chọn tầng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tầng</SelectItem>
                {uniqueFloors.map((floor) => (
                  <SelectItem key={floor} value={floor.toString()}>
                    Tầng {floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="available">Trống</SelectItem>
                <SelectItem value="booked">Đã đặt</SelectItem>
                <SelectItem value="maintenance">Đang bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[25%]">Phòng</TableHead>
                <TableHead className="w-[20%]">Loại phòng</TableHead>
                <TableHead className="w-[15%]">Tầng</TableHead>
                <TableHead className="w-[20%]">Trạng thái</TableHead>
                <TableHead className="w-[10%]">Cập nhật lúc</TableHead>
                <TableHead className="w-[10%] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Hiển thị skeleton khi đang loading
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : rooms.length > 0 ? (
                rooms.map((room) => (
                  <TableRow
                    key={room._id}
                    className="hover:bg-muted/5 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground py-4">
                      {room.roomName}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      {room.roomType}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      Tầng {room.floor}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={getStatusDot(room.status)} />
                        {getStatusBadge(room.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      {formatDate(room.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => handleViewDetails(room)}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors border-primary/20"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Không có phòng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {rooms.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground text-center mb-4">
                Hiển thị {(currentPage - 1) * 10 + 1}-
                {Math.min(currentPage * 10, roomsData?.count || 0)} trong tổng
                số {roomsData?.total || 0} kết quả
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-[700px] bg-card p-8 rounded-lg">
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl text-foreground">
              {selectedRoomDetails?.roomName}
              {selectedRoomDetails && (
                <div className="flex items-center gap-3">
                  <div className={getStatusDot(selectedRoomDetails.status)} />
                  {getStatusBadge(selectedRoomDetails.status)}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {selectedRoomDetails?.status === "booked" && (
              <div className="space-y-6">
                <h3 className="font-semibold text-xl text-foreground">
                  Thông tin đặt phòng
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tên phòng</p>
                    <p className="text-foreground text-lg">
                      {selectedRoomDetails.roomName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Loại phòng</p>
                    <p className="text-foreground text-lg">
                      {selectedRoomDetails.roomType}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Loại giường</p>
                    <p className="text-foreground text-lg">
                      {selectedRoomDetails.bedType}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Sức chứa</p>
                    <p className="text-foreground text-lg">
                      {selectedRoomDetails.capacity} người
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedRoomDetails?.status === "maintenance" && (
              <div className="space-y-6">
                <h3 className="font-semibold text-xl text-foreground">
                  Thông tin bảo trì
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <p className="text-sm text-muted-foreground">Tên phòng</p>
                    <p className="text-foreground text-lg">
                      {selectedRoomDetails.roomName}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <p className="text-sm text-muted-foreground">Mô tả phòng</p>
                    <p className="text-foreground text-lg">
                      {selectedRoomDetails.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tầng</p>
                    <p className="text-foreground text-lg">
                      {selectedRoomDetails.floor}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Diện tích</p>
                    <p className="text-foreground text-lg">
                      {selectedRoomDetails.squareMeters}m²
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
