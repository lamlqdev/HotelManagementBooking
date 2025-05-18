import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "@/api/statistics/statistics.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Hotel,
  ArrowDownUp,
  Filter,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";

const BOOKING_COLORS = {
  completed: "#22c55e", // xanh lá
  confirmed: "#3b82f6", // xanh dương
  cancelled: "#ef4444", // đỏ
  pending: "#eab308", // vàng
};

export default function RevenuePage() {
  // State cho filter
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [from, setFrom] = useState<string>(firstDay.toISOString().slice(0, 10));
  const [to, setTo] = useState<string>(lastDay.toISOString().slice(0, 10));
  const [groupBy, setGroupBy] = useState<"day" | "month">("day");
  const [limit, setLimit] = useState<number>(5);
  const [filterKey, setFilterKey] = useState(0); // để trigger refetch thủ công

  // Tổng quan doanh thu
  const { data: revenueSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["statistics", "summary"],
    queryFn: () => statisticsApi.getRevenueSummary("month"),
  });

  // Biểu đồ doanh thu
  const { data: revenueChart, isLoading: isLoadingChart } = useQuery({
    queryKey: ["statistics", "chart", { from, to, groupBy, filterKey }],
    queryFn: () =>
      statisticsApi.getRevenueChart({
        from,
        to,
        groupBy,
      }),
    enabled: !!from && !!to,
  });

  // Top phòng doanh thu cao nhất
  const { data: topRooms, isLoading: isLoadingTopRooms } = useQuery({
    queryKey: ["statistics", "top-rooms", { limit, from, to, filterKey }],
    queryFn: () =>
      statisticsApi.getTopRooms({
        limit,
        from,
        to,
      }),
    enabled: !!from && !!to,
  });

  // Thống kê booking
  const { data: bookingStats, isLoading: isLoadingBookingStats } = useQuery({
    queryKey: ["statistics", "booking", filterKey],
    queryFn: () => statisticsApi.getBookingStatistics(),
  });

  // Dữ liệu PieChart booking (4 trạng thái)
  const confirmedBookings = bookingStats?.data
    ? bookingStats.data.totalBookings -
      bookingStats.data.successfulBookings -
      bookingStats.data.cancelledBookings -
      bookingStats.data.pendingBookings
    : 0;
  const bookingPieData = bookingStats?.data
    ? [
        {
          name: "Hoàn thành",
          value: bookingStats.data.successfulBookings,
          color: BOOKING_COLORS.completed,
        },
        {
          name: "Đã xác nhận",
          value: confirmedBookings,
          color: BOOKING_COLORS.confirmed,
        },
        {
          name: "Đã huỷ",
          value: bookingStats.data.cancelledBookings,
          color: BOOKING_COLORS.cancelled,
        },
        {
          name: "Chờ xử lý",
          value: bookingStats.data.pendingBookings,
          color: BOOKING_COLORS.pending,
        },
      ]
    : [];

  // Handler áp dụng filter
  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center mb-2">Quản lý doanh thu</h1>

      {/* Bộ lọc mới */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-5 h-5 text-primary" /> Bộ lọc thống kê
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col md:flex-row gap-4 items-end justify-center"
            onSubmit={handleApplyFilter}
          >
            <div className="flex flex-col gap-1 w-full max-w-[160px]">
              <Label htmlFor="from" className="text-xs">
                Từ ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal hover:text-white group"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {from ? (
                      new Date(from).toLocaleDateString("vi-VN")
                    ) : (
                      <span className="text-muted-foreground group-hover:text-white">
                        Chọn ngày bắt đầu
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={from ? new Date(from) : undefined}
                    onSelect={(date) => {
                      if (date instanceof Date)
                        setFrom(date.toISOString().slice(0, 10));
                    }}
                    initialFocus
                    locale={vi}
                    disabled={(date) => date > new Date(to)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[160px]">
              <Label htmlFor="to" className="text-xs">
                Đến ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal hover:text-white group"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {to ? (
                      new Date(to).toLocaleDateString("vi-VN")
                    ) : (
                      <span className="text-muted-foreground group-hover:text-white">
                        Chọn ngày kết thúc
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={to ? new Date(to) : undefined}
                    onSelect={(date) => {
                      if (date instanceof Date)
                        setTo(date.toISOString().slice(0, 10));
                    }}
                    initialFocus
                    locale={vi}
                    disabled={(date) => date < new Date(from)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[120px]">
              <Label htmlFor="groupBy" className="text-xs">
                Nhóm theo
              </Label>
              <Select
                value={groupBy}
                onValueChange={(v) => setGroupBy(v as "day" | "month")}
              >
                <SelectTrigger id="groupBy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Ngày</SelectItem>
                  <SelectItem value="month">Tháng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[120px]">
              <Label htmlFor="limit" className="text-xs">
                Số phòng top
              </Label>
              <Input
                id="limit"
                type="number"
                min={1}
                max={20}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              />
            </div>
            <Button type="submit" className="h-10 px-6 mt-2 md:mt-0">
              Áp dụng
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tổng quan doanh thu dạng grid card nhỏ */}
      {isLoadingSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : revenueSummary?.data ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
            <TrendingUp className="text-primary mb-2" />
            <div className="text-lg font-bold text-primary">
              {revenueSummary.data.totalRevenue.toLocaleString()} đ
            </div>
            <div className="text-xs text-muted-foreground">Tổng doanh thu</div>
          </Card>
          <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
            <Users className="text-blue-500 mb-2" />
            <div className="text-lg font-bold">
              {revenueSummary.data.totalBookings}
            </div>
            <div className="text-xs text-muted-foreground">Tổng booking</div>
          </Card>
          <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
            <Hotel className="text-green-500 mb-2" />
            <div className="text-lg font-bold">
              {revenueSummary.data.successfulBookings}
            </div>
            <div className="text-xs text-muted-foreground">
              Booking thành công
            </div>
          </Card>
          <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
            <ArrowDownUp className="mb-2 text-yellow-500" />
            <span
              className={`text-lg font-bold ${
                Number(revenueSummary.data.revenueChange) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {revenueSummary.data.revenueChange}%
            </span>
            <div className="text-xs text-muted-foreground">
              Tăng trưởng doanh thu
            </div>
          </Card>
        </div>
      ) : null}

      {/* Biểu đồ doanh thu */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ doanh thu</CardTitle>
          <div className="text-xs text-muted-foreground">
            Theo {groupBy === "day" ? "ngày" : "tháng"} ({from} - {to})
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingChart ? (
            <Skeleton className="h-48 w-full" />
          ) : revenueChart?.data && revenueChart.data.length > 0 ? (
            <div className="w-full h-80 bg-muted rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueChart.data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString() + " đ"}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    name="Doanh thu"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#82ca9d"
                    name="Số booking"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </CardContent>
      </Card>

      {/* Top phòng doanh thu cao nhất */}
      <Card>
        <CardHeader>
          <CardTitle>Top phòng doanh thu cao nhất</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTopRooms ? (
            <Skeleton className="h-24 w-full" />
          ) : topRooms?.data && topRooms.data.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Phòng</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                    <TableHead className="text-right">Số booking</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topRooms.data.map((room, idx) => (
                    <TableRow key={room._id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="secondary">Top {idx + 1}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/partner/hotels/rooms/${room._id}`}
                          className="text-primary underline hover:text-primary/80"
                        >
                          {room._id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        {room.totalRevenue.toLocaleString()} đ
                      </TableCell>
                      <TableCell className="text-right">
                        {room.bookingCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </CardContent>
      </Card>

      {/* Thống kê booking PieChart */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê booking</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingBookingStats ? (
            <Skeleton className="h-48 w-full" />
          ) : bookingStats?.data ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-full max-w-xs h-72 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={60}
                      labelLine={false}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {bookingPieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} booking`,
                        name,
                      ]}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 text-center font-semibold text-base">
                  Tổng booking:{" "}
                  <span className="text-primary">
                    {bookingStats.data.totalBookings}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: BOOKING_COLORS.completed }}
                  />
                  <span>
                    Hoàn thành: <b>{bookingStats.data.successfulBookings}</b>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: BOOKING_COLORS.confirmed }}
                  />
                  <span>
                    Đã xác nhận: <b>{confirmedBookings}</b>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: BOOKING_COLORS.cancelled }}
                  />
                  <span>
                    Đã huỷ: <b>{bookingStats.data.cancelledBookings}</b>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: BOOKING_COLORS.pending }}
                  />
                  <span>
                    Chờ xử lý: <b>{bookingStats.data.pendingBookings}</b>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
