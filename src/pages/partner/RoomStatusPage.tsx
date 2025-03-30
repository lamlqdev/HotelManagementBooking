import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Building2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router";

interface GuestInfo {
  name: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  paymentStatus: string;
}

interface MaintenanceInfo {
  issue: string;
  description: string;
  startDate: string;
  expectedEndDate: string;
  status: string;
  contractor: string;
  cost: string;
}

interface Room {
  id: number;
  roomName: string;
  currentStatus: string;
  lastStatusChange: string;
  guestInfo: GuestInfo | null;
  maintenanceInfo: MaintenanceInfo | null;
}

// Mock data - sau này sẽ được thay thế bằng API call
const rooms: Room[] = [
  {
    id: 1,
    roomName: "Phòng Deluxe 101",
    currentStatus: "available",
    lastStatusChange: "2024-03-20T10:00:00",
    guestInfo: null,
    maintenanceInfo: null,
  },
  {
    id: 2,
    roomName: "Phòng Suite 102",
    currentStatus: "occupied",
    lastStatusChange: "2024-03-19T15:30:00",
    guestInfo: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
      checkIn: "2024-03-19T15:30:00",
      checkOut: "2024-03-22T12:00:00",
      numberOfGuests: 2,
      paymentStatus: "Đã thanh toán",
    },
    maintenanceInfo: null,
  },
  {
    id: 3,
    roomName: "Phòng Standard 103",
    currentStatus: "maintenance",
    lastStatusChange: "2024-03-21T08:00:00",
    guestInfo: null,
    maintenanceInfo: {
      issue: "Sửa điều hòa",
      description: "Điều hòa không làm lạnh, cần thay gas và vệ sinh dàn lạnh",
      startDate: "2024-03-21T08:00:00",
      expectedEndDate: "2024-03-22T17:00:00",
      status: "in_progress",
      contractor: "Công ty ABC",
      cost: "2,500,000 VNĐ",
    },
  },
];

export default function RoomStatusPage() {
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<Room | null>(
    null
  );

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
      case "occupied":
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
      case "occupied":
        return `${baseClass} bg-[#1167b1]`;
      case "maintenance":
        return `${baseClass} bg-destructive`;
      default:
        return `${baseClass} bg-muted`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">
          Quản lý tình trạng phòng
        </h1>
        <div className="flex gap-2">
          <Link to="/partner/rooms">
            <Button variant="outline">
              <Building2 className="w-4 h-4 mr-2" />
              Quản lý phòng
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-6 mb-8">
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="w-[250px] h-11 bg-card border-input rounded-md">
                <SelectValue placeholder="Chọn phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id.toString()}>
                    {room.roomName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[250px] h-11 bg-card border-input rounded-md">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="available">Trống</SelectItem>
                <SelectItem value="occupied">Đã đặt</SelectItem>
                <SelectItem value="maintenance">Đang bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border shadow-sm overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 hover:bg-muted/10">
                  <TableHead className="font-semibold text-muted-foreground py-4 text-base">
                    Phòng
                  </TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 text-base">
                    Trạng thái
                  </TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 text-base">
                    Cập nhật lúc
                  </TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground py-4 text-base w-[250px]">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow
                    key={room.id}
                    className="hover:bg-muted/5 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground py-4 text-base">
                      {room.roomName}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={getStatusDot(room.currentStatus)} />
                        {getStatusBadge(room.currentStatus)}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4 text-base">
                      {new Date(room.lastStatusChange).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => handleViewDetails(room)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors border-primary/20"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Chi tiết
                        </Button>
                        <Button
                          variant="outline"
                          size="default"
                          className="hover:bg-primary hover:text-primary-foreground transition-colors border-primary/20"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Cập nhật
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-[700px] bg-card p-8 rounded-lg">
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl text-foreground">
              {selectedRoomDetails?.roomName}
              {selectedRoomDetails && (
                <div className="flex items-center gap-3">
                  <div
                    className={getStatusDot(selectedRoomDetails.currentStatus)}
                  />
                  {getStatusBadge(selectedRoomDetails.currentStatus)}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {selectedRoomDetails?.currentStatus === "occupied" &&
              selectedRoomDetails?.guestInfo && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-xl text-foreground">
                    Thông tin đặt phòng
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Tên khách hàng
                      </p>
                      <p className="text-foreground text-lg">
                        {selectedRoomDetails.guestInfo.name}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Số điện thoại
                      </p>
                      <p className="text-foreground text-lg">
                        {selectedRoomDetails.guestInfo.phone}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Check-in</p>
                      <p className="text-foreground text-lg">
                        {new Date(
                          selectedRoomDetails.guestInfo.checkIn
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Check-out</p>
                      <p className="text-foreground text-lg">
                        {new Date(
                          selectedRoomDetails.guestInfo.checkOut
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Số lượng khách
                      </p>
                      <p className="text-foreground text-lg">
                        {selectedRoomDetails.guestInfo.numberOfGuests} người
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Trạng thái thanh toán
                      </p>
                      <p className="text-foreground text-lg">
                        {selectedRoomDetails.guestInfo.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {selectedRoomDetails?.currentStatus === "maintenance" &&
              selectedRoomDetails?.maintenanceInfo && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-xl text-foreground">
                    Thông tin bảo trì
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <p className="text-sm text-muted-foreground">Vấn đề</p>
                      <p className="text-foreground text-lg">
                        {selectedRoomDetails.maintenanceInfo.issue}
                      </p>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Mô tả chi tiết
                      </p>
                      <p className="text-foreground text-lg">
                        {selectedRoomDetails.maintenanceInfo.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Bắt đầu</p>
                      <p className="text-foreground text-lg">
                        {new Date(
                          selectedRoomDetails.maintenanceInfo.startDate
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Dự kiến hoàn thành
                      </p>
                      <p className="text-foreground text-lg">
                        {new Date(
                          selectedRoomDetails.maintenanceInfo.expectedEndDate
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Đơn vị thực hiện
                      </p>
                      <p className="text-foreground text-lg">
                        {selectedRoomDetails.maintenanceInfo.contractor}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Chi phí dự kiến
                      </p>
                      <p className="text-foreground text-lg">
                        {selectedRoomDetails.maintenanceInfo.cost}
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
