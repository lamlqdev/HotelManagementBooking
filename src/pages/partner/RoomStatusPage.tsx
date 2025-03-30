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
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - sau này sẽ được thay thế bằng API call
const rooms = [
  {
    id: 1,
    roomName: "Phòng Deluxe 101",
    currentStatus: "available",
    lastStatusChange: "2024-03-20T10:00:00",
  },
  {
    id: 2,
    roomName: "Phòng Suite 102",
    currentStatus: "occupied",
    lastStatusChange: "2024-03-19T15:30:00",
  },
];

const maintenanceTasks = [
  {
    id: 1,
    roomName: "Phòng Deluxe 101",
    description: "Vệ sinh định kỳ",
    date: "2024-03-25",
    status: "scheduled",
  },
  {
    id: 2,
    roomName: "Phòng Suite 102",
    description: "Sửa chữa điều hòa",
    date: "2024-03-26",
    status: "in_progress",
  },
];

export default function RoomStatusPage() {
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý tình trạng phòng</h1>
        <Button>
          <AlertCircle className="w-4 h-4 mr-2" />
          Báo cáo vấn đề
        </Button>
      </div>

      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rooms">Danh sách phòng</TabsTrigger>
          <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms">
          {/* Bộ lọc phòng */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phòng</SelectItem>
                    <SelectItem value="101">Phòng 101</SelectItem>
                    <SelectItem value="102">Phòng 102</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="available">Trống</SelectItem>
                    <SelectItem value="occupied">Đã đặt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Danh sách phòng */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{room.roomName}</h3>
                    <Badge
                      variant={
                        room.currentStatus === "available"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {room.currentStatus === "available" ? "Trống" : "Đã đặt"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cập nhật lúc:{" "}
                    {new Date(room.lastStatusChange).toLocaleString()}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Đánh dấu trống
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <XCircle className="w-4 h-4 mr-2" />
                      Đánh dấu đã đặt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          {/* Danh sách bảo trì */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maintenanceTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{task.roomName}</h3>
                    <Badge
                      variant={
                        task.status === "scheduled"
                          ? "outline"
                          : task.status === "in_progress"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {task.status === "scheduled"
                        ? "Đã lên lịch"
                        : task.status === "in_progress"
                        ? "Đang bảo trì"
                        : "Hoàn thành"}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{task.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {task.date}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Hoàn thành
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <XCircle className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
