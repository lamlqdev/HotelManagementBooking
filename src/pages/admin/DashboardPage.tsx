import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminStatisticsApi } from "@/api/admin-statistics/admin-statistics.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Home,
  Users,
  Hotel,
  Ticket,
  TrendingUp,
  BarChart2,
  PieChart,
} from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const BOOKING_COLORS = {
  completed: "#22c55e",
  confirmed: "#3b82f6",
  cancelled: "#ef4444",
  pending: "#eab308",
};
const HOTEL_COLORS = {
  active: "#22c55e",
  inactive: "#ef4444",
  pending: "#eab308",
};

export default function DashboardPage() {
  // Filter state
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [from, setFrom] = useState<string>(firstDay.toISOString().slice(0, 10));
  const [to, setTo] = useState<string>(lastDay.toISOString().slice(0, 10));
  const [groupBy, setGroupBy] = useState<"day" | "month">("day");
  const [limit, setLimit] = useState<number>(5);
  const [filterKey, setFilterKey] = useState(0);

  // API calls
  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ["admin-statistics", "overview"],
    queryFn: () => adminStatisticsApi.getSystemOverview(),
  });
  const { data: bookingStatus, isLoading: loadingBookingStatus } = useQuery({
    queryKey: ["admin-statistics", "booking-status"],
    queryFn: () => adminStatisticsApi.getBookingStatus(),
  });
  const { data: hotelStatus, isLoading: loadingHotelStatus } = useQuery({
    queryKey: ["admin-statistics", "hotel-status"],
    queryFn: () => adminStatisticsApi.getHotelStatus(),
  });
  const { data: chartData, isLoading: loadingChart } = useQuery({
    queryKey: [
      "admin-statistics",
      "chart-data",
      { from, to, groupBy, filterKey },
    ],
    queryFn: () => adminStatisticsApi.getChartData({ from, to, groupBy }),
    enabled: !!from && !!to,
  });
  const { data: topHotels, isLoading: loadingTopHotels } = useQuery({
    queryKey: [
      "admin-statistics",
      "top-hotels",
      { limit, from, to, filterKey },
    ],
    queryFn: () =>
      adminStatisticsApi.getTopHotelsByBookings({ limit, from, to }),
    enabled: !!from && !!to,
  });
  const { data: topUsers, isLoading: loadingTopUsers } = useQuery({
    queryKey: ["admin-statistics", "top-users", { limit, from, to, filterKey }],
    queryFn: () =>
      adminStatisticsApi.getTopUsersByBookings({ limit, from, to }),
    enabled: !!from && !!to,
  });

  // Pie data
  const bookingPieData = bookingStatus?.data
    ? [
        {
          name: "Hoàn thành",
          value: bookingStatus.data.completed,
          color: BOOKING_COLORS.completed,
        },
        {
          name: "Đã xác nhận",
          value: bookingStatus.data.confirmed,
          color: BOOKING_COLORS.confirmed,
        },
        {
          name: "Đã huỷ",
          value: bookingStatus.data.cancelled,
          color: BOOKING_COLORS.cancelled,
        },
        {
          name: "Chờ xử lý",
          value: bookingStatus.data.pending,
          color: BOOKING_COLORS.pending,
        },
      ]
    : [];
  const hotelPieData = hotelStatus?.data
    ? [
        {
          name: "Hoạt động",
          value: hotelStatus.data.active,
          color: HOTEL_COLORS.active,
        },
        {
          name: "Chờ duyệt",
          value: hotelStatus.data.pending,
          color: HOTEL_COLORS.pending,
        },
        {
          name: "Ngừng hoạt động",
          value: hotelStatus.data.inactive,
          color: HOTEL_COLORS.inactive,
        },
      ]
    : [];

  // Handler filter
  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterKey((k) => k + 1);
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">
        Dashboard quản trị
      </h1>

      {/* Bộ lọc */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart2 className="w-5 h-5 text-primary" /> Bộ lọc thống kê
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col md:flex-row gap-4 items-end justify-center"
            onSubmit={handleApplyFilter}
          >
            <div className="flex flex-col gap-1 w-full max-w-[160px]">
              <Label htmlFor="from">Từ ngày</Label>
              <input
                type="date"
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="border rounded px-2 py-1"
                max={to}
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[160px]">
              <Label htmlFor="to">Đến ngày</Label>
              <input
                type="date"
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border rounded px-2 py-1"
                min={from}
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[120px]">
              <Label>Nhóm theo</Label>
              <Select
                value={groupBy}
                onValueChange={(v) => setGroupBy(v as "day" | "month")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nhóm theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Ngày</SelectItem>
                  <SelectItem value="month">Tháng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[120px]">
              <Label>Số lượng top</Label>
              <Select
                value={limit.toString()}
                onValueChange={(v) => setLimit(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Top" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 10].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      Top {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="h-10 px-6 mt-2 md:mt-0">
              Áp dụng
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {loadingOverview ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))
        ) : overview?.data ? (
          <>
            <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
              <Home className="h-7 w-7 text-blue-600 mb-2" />
              <span className="text-3xl font-bold text-blue-600">
                {overview.data.totalPartners}
              </span>
              <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                Đối tác
              </span>
            </Card>
            <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
              <Users className="h-7 w-7 text-green-600 mb-2" />
              <span className="text-3xl font-bold text-green-600">
                {overview.data.totalUsers}
              </span>
              <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                Người dùng
              </span>
            </Card>
            <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
              <Hotel className="h-7 w-7 text-yellow-600 mb-2" />
              <span className="text-3xl font-bold text-yellow-600">
                {overview.data.totalHotels}
              </span>
              <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                Khách sạn
              </span>
            </Card>
            <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
              <Ticket className="h-7 w-7 text-purple-600 mb-2" />
              <span className="text-3xl font-bold text-purple-600">
                {overview.data.totalBookings}
              </span>
              <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                Booking
              </span>
            </Card>
            <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
              <TrendingUp className="h-7 w-7 text-pink-600 mb-2" />
              <span className="text-3xl font-bold text-pink-600">
                {overview.data.totalRevenue.toLocaleString("vi-VN")}₫
              </span>
              <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                Tổng doanh thu
              </span>
            </Card>
          </>
        ) : null}
      </div>

      {/* Biểu đồ tổng quan */}
      <Card>
        <CardHeader>
          <CardTitle>
            Biểu đồ tổng quan theo {groupBy === "day" ? "ngày" : "tháng"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingChart ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : chartData?.data && chartData.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <ReLineChart
                data={chartData.data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <YAxis yAxisId="1" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newBookings"
                  stroke="#3b82f6"
                  name="Booking mới"
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#22c55e"
                  name="User mới"
                />
                <Line
                  type="monotone"
                  dataKey="newHotels"
                  stroke="#eab308"
                  name="Khách sạn mới"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  name="Doanh thu"
                  yAxisId="1"
                />
              </ReLineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hai PieChart trạng thái */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" /> Trạng thái booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBookingStatus ? (
              <Skeleton className="h-48 w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={bookingPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {bookingPieData.map((entry, idx) => (
                      <Cell key={`cell-booking-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" /> Trạng thái khách sạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHotelStatus ? (
              <Skeleton className="h-48 w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={hotelPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {hotelPieData.map((entry, idx) => (
                      <Cell key={`cell-hotel-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top khách sạn */}
      <Card>
        <CardHeader>
          <CardTitle>Top khách sạn có nhiều booking nhất</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTopHotels ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : topHotels?.data && topHotels.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tên khách sạn</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topHotels.data.map((hotel, idx) => (
                  <TableRow key={hotel.hotelName}>
                    <TableCell>
                      <Badge variant="secondary">Top {idx + 1}</Badge>
                    </TableCell>
                    <TableCell>{hotel.hotelName}</TableCell>
                    <TableCell>{hotel.bookingCount}</TableCell>
                    <TableCell>
                      {hotel.totalRevenue.toLocaleString("vi-VN")}₫
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top người dùng */}
      <Card>
        <CardHeader>
          <CardTitle>Top người dùng có nhiều booking nhất</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTopUsers ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : topUsers?.data && topUsers.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tên người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Chi tiêu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUsers.data.map((user, idx) => (
                  <TableRow key={user.userEmail}>
                    <TableCell>
                      <Badge variant="secondary">Top {idx + 1}</Badge>
                    </TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.userEmail}</TableCell>
                    <TableCell>{user.bookingCount}</TableCell>
                    <TableCell>
                      {user.totalSpent.toLocaleString("vi-VN")}₫
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
