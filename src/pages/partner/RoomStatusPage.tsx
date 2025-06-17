import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfDay } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { roomApi } from "@/api/room/room.api";
import { Room } from "@/types/room";
import { formatDate } from "@/utils/timeUtils";
import { RoomsResponse } from "@/api/room/types";

import { CalendarIcon, Wrench, RotateCcw } from "lucide-react";

export default function RoomStatusPage() {
  const { i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [isBooked, setIsBooked] = useState<string>("true");
  const [hasDiscount, setHasDiscount] = useState<string>("all");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const handleResetFilters = () => {
    setSelectedFloor("all");
    setIsBooked("true");
    setHasDiscount("all");
    setCheckIn(undefined);
    setCheckOut(undefined);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Lấy danh sách phòng từ API
  const { data: roomsData, isLoading } = useQuery<RoomsResponse>({
    queryKey: [
      "partnerRooms",
      currentPage,
      isBooked,
      hasDiscount,
      checkIn,
      checkOut,
    ],
    queryFn: () =>
      roomApi.getPartnerRooms({
        page: currentPage,
        limit: 10,
        isBooked:
          isBooked === "true" ? true : isBooked === "false" ? false : undefined,
        hasDiscount:
          hasDiscount === "true"
            ? true
            : hasDiscount === "false"
            ? false
            : undefined,
        checkIn:
          checkIn && checkOut ? format(checkIn, "yyyy-MM-dd") : undefined,
        checkOut:
          checkIn && checkOut ? format(checkOut, "yyyy-MM-dd") : undefined,
      }),
    enabled: checkIn ? Boolean(checkOut) : true,
  });

  // Thêm mutation để cập nhật trạng thái phòng
  const updateRoomStatusMutation = useMutation({
    mutationFn: async ({
      roomId,
      status,
    }: {
      roomId: string;
      status: string;
    }) => {
      const formData = new FormData();
      formData.append("status", status);
      return roomApi.updateRoom(roomId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partnerRooms", currentPage],
      });
    },
  });

  const totalPages = roomsData?.pagination?.totalPages ?? 1;
  const allRooms = roomsData?.data ?? [];

  // Lấy danh sách tầng duy nhất từ danh sách phòng
  const uniqueFloors = Array.from(
    new Set(allRooms.map((room: Room) => room.floor))
  ).sort((a, b) => Number(a) - Number(b)) as number[];

  // Lọc phòng theo tầng và tên phòng
  const rooms = allRooms.filter((room: Room) => {
    const matchesFloor =
      selectedFloor === "all" || room.floor === parseInt(selectedFloor);
    const matchesName = room.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFloor && matchesName;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateToMaintenance = (roomId: string) => {
    updateRoomStatusMutation.mutate({ roomId, status: "maintenance" });
  };

  const handleUpdateToAvailable = (roomId: string) => {
    updateRoomStatusMutation.mutate({ roomId, status: "available" });
  };

  const formatDateDisplay = (date: Date) => {
    return format(date, "dd/MM/yyyy", {
      locale: i18n.language === "vi" ? vi : enUS,
    });
  };

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckIn(date);
    // Nếu ngày check-in mới lớn hơn ngày check-out hiện tại, reset check-out
    if (date && checkOut && date >= checkOut) {
      setCheckOut(undefined);
    }
  };

  const handleCheckOutChange = (date: Date | undefined) => {
    setCheckOut(date);
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

          {/* Thanh tìm kiếm và nút đặt lại bộ lọc */}
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Tìm kiếm theo tên phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-none h-10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại bộ lọc
            </Button>
          </div>

          {/* Các bộ lọc khác */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Tầng</label>
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn tầng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tầng</SelectItem>
                  {uniqueFloors.map((floor: number) => (
                    <SelectItem key={floor} value={floor.toString()}>
                      Tầng {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Trạng thái đặt phòng
              </label>
              <Select value={isBooked} onValueChange={setIsBooked}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái đặt phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Đã đặt</SelectItem>
                  <SelectItem value="false">Chưa đặt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Khuyến mãi</label>
              <Select value={hasDiscount} onValueChange={setHasDiscount}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái khuyến mãi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="true">Có khuyến mãi</SelectItem>
                  <SelectItem value="false">Không có khuyến mãi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Check-in */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Ngày nhận phòng</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-start text-left font-normal hover:text-white group"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {checkIn ? (
                        formatDateDisplay(checkIn)
                      ) : (
                        <span className="text-muted-foreground group-hover:text-white">
                          Chọn ngày
                        </span>
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={handleCheckInChange}
                    initialFocus
                    locale={i18n.language === "vi" ? vi : enUS}
                    disabled={(date) =>
                      startOfDay(date) < startOfDay(new Date())
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Ngày trả phòng</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-start text-left font-normal hover:text-white group"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {checkOut ? (
                        formatDateDisplay(checkOut)
                      ) : (
                        <span className="text-muted-foreground group-hover:text-white">
                          Chọn ngày
                        </span>
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={handleCheckOutChange}
                    initialFocus
                    locale={i18n.language === "vi" ? vi : enUS}
                    disabled={(date) =>
                      startOfDay(date) < startOfDay(new Date()) ||
                      (checkIn
                        ? startOfDay(date) <= startOfDay(checkIn)
                        : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30%]">Phòng</TableHead>
                <TableHead className="w-[25%]">Loại phòng</TableHead>
                <TableHead className="w-[20%]">Tầng</TableHead>
                <TableHead className="w-[15%]">Cập nhật lúc</TableHead>
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
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : rooms.length > 0 ? (
                rooms.map((room: Room) => (
                  <TableRow
                    key={room._id}
                    className="hover:bg-muted/5 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground py-4">
                      {room.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      {room.roomType}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      Tầng {room.floor}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      {formatDate(room.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex items-center justify-end gap-2">
                        {room.status === "available" && (
                          <Button
                            variant="outline"
                            size="default"
                            onClick={() => handleUpdateToMaintenance(room._id)}
                            className="hover:bg-accent hover:text-accent-foreground border-accent text-accent min-w-[170px] justify-center"
                          >
                            <Wrench className="w-4 h-4 mr-2" />
                            Chuyển sang bảo trì
                          </Button>
                        )}
                        {room.status === "maintenance" && (
                          <Button
                            variant="outline"
                            size="default"
                            onClick={() => handleUpdateToAvailable(room._id)}
                            className="hover:bg-[#1167b1] hover:text-white border-[#1167b1] text-[#1167b1] min-w-[170px] justify-center"
                          >
                            <Wrench className="w-4 h-4 mr-2" />
                            Kết thúc bảo trì
                          </Button>
                        )}
                      </div>
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
                {Math.min(currentPage * 10, roomsData?.count ?? 0)} trong tổng
                số {roomsData?.total ?? 0} kết quả
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
    </div>
  );
}
