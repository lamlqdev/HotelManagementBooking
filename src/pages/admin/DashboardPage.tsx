import { useState, useEffect } from "react";
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
  CalendarDays,
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";

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
  // State cho phần tổng quan (không cần filter)

  // State cho filter biểu đồ tổng quan
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [chartFrom, setChartFrom] = useState<string>(
    firstDay.toISOString().slice(0, 10)
  );
  const [chartTo, setChartTo] = useState<string>(
    lastDay.toISOString().slice(0, 10)
  );
  const [groupBy, setGroupBy] = useState<"day" | "month">("day");
  const [chartFilterKey, setChartFilterKey] = useState(0);

  // State cho filter top khách sạn và người dùng
  const [rankingFrom, setRankingFrom] = useState<string>(
    firstDay.toISOString().slice(0, 10)
  );
  const [rankingTo, setRankingTo] = useState<string>(
    lastDay.toISOString().slice(0, 10)
  );
  const [rankingLimit, setRankingLimit] = useState<number>(5);
  const [rankingFilterKey, setRankingFilterKey] = useState(0);

  // Tự động fetch khi thay đổi filter tổng quan
  useEffect(() => {
    setChartFilterKey((k) => k + 1);
    // eslint-disable-next-line
  }, [chartFrom, chartTo, groupBy]);

  // Tự động fetch khi thay đổi filter ranking
  useEffect(() => {
    setRankingFilterKey((k) => k + 1);
  }, [rankingFrom, rankingTo, rankingLimit]);

  // API calls cho phần tổng quan
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

  // API call cho biểu đồ tổng quan
  const { data: chartData, isLoading: loadingChart } = useQuery({
    queryKey: [
      "admin-statistics",
      "chart-data",
      { chartFrom, chartTo, groupBy, chartFilterKey },
    ],
    queryFn: () =>
      adminStatisticsApi.getChartData({
        from: chartFrom,
        to: chartTo,
        groupBy,
      }),
    enabled: !!chartFrom && !!chartTo,
  });

  // API call cho top khách sạn
  const { data: topHotels, isLoading: loadingTopHotels } = useQuery({
    queryKey: [
      "admin-statistics",
      "top-hotels",
      { rankingLimit, rankingFrom, rankingTo, rankingFilterKey },
    ],
    queryFn: () =>
      adminStatisticsApi.getTopHotelsByBookings({
        limit: rankingLimit,
        from: rankingFrom,
        to: rankingTo,
      }),
    enabled: !!rankingFrom && !!rankingTo,
  });

  // API call cho top người dùng
  const { data: topUsers, isLoading: loadingTopUsers } = useQuery({
    queryKey: [
      "admin-statistics",
      "top-users",
      { rankingLimit, rankingFrom, rankingTo, rankingFilterKey },
    ],
    queryFn: () =>
      adminStatisticsApi.getTopUsersByBookings({
        limit: rankingLimit,
        from: rankingFrom,
        to: rankingTo,
      }),
    enabled: !!rankingFrom && !!rankingTo,
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

  // Tổng booking và tổng khách sạn cho PieChart
  const totalBooking = bookingStatus?.data
    ? bookingStatus.data.completed +
      bookingStatus.data.confirmed +
      bookingStatus.data.cancelled +
      bookingStatus.data.pending
    : 0;
  const totalHotel = hotelStatus?.data
    ? hotelStatus.data.active +
      hotelStatus.data.pending +
      hotelStatus.data.inactive
    : 0;

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">
        Dashboard quản trị
      </h1>

      {/* Tổng quan */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {loadingOverview ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))
          ) : overview?.data ? (
            <>
              <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
                <Home className="h-7 w-7 text-primary mb-2" />
                <span className="text-3xl font-bold text-primary">
                  {overview.data.totalPartners}
                </span>
                <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                  Đối tác
                </span>
              </Card>
              <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
                <Users className="h-7 w-7 text-primary mb-2" />
                <span className="text-3xl font-bold text-primary">
                  {overview.data.totalUsers}
                </span>
                <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                  Người dùng
                </span>
              </Card>
              <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
                <Hotel className="h-7 w-7 text-primary mb-2" />
                <span className="text-3xl font-bold text-primary">
                  {overview.data.totalHotels}
                </span>
                <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                  Khách sạn
                </span>
              </Card>
              <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
                <Ticket className="h-7 w-7 text-primary mb-2" />
                <span className="text-3xl font-bold text-primary">
                  {overview.data.totalBookings}
                </span>
                <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                  Booking
                </span>
              </Card>
              <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
                <TrendingUp className="h-7 w-7 text-primary mb-2" />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-primary">
                    {(
                      (overview.data.totalBookings / overview.data.totalUsers) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                  <span className="mt-1 text-base text-gray-600 dark:text-gray-300">
                    Tỷ lệ booking/người dùng
                  </span>
                </div>
              </Card>
            </>
          ) : null}
        </div>
      </div>

      {/* Hai PieChart trạng thái */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trạng thái booking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" /> Trạng thái booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBookingStatus ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-full max-w-md h-80 flex flex-col items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={bookingPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={70}
                        labelLine={false}
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {bookingPieData.map((entry, idx) => (
                          <Cell
                            key={`cell-booking-${idx}`}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ fontSize: 15 }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  {/* Tổng booking ở giữa PieChart */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-xs text-muted-foreground font-medium leading-tight mb-1">
                      Tổng booking
                    </span>
                    <span className="text-xl font-bold text-primary leading-tight">
                      {totalBooking}
                    </span>
                  </div>
                </div>
                {/* Thống kê từng trạng thái booking */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  <div className="flex items-center gap-3 bg-white dark:bg-muted rounded-xl shadow p-3">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ background: BOOKING_COLORS.completed }}
                    />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Hoàn thành
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {bookingStatus?.data?.completed}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-muted rounded-xl shadow p-3">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ background: BOOKING_COLORS.confirmed }}
                    />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Đã xác nhận
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {bookingStatus?.data?.confirmed}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-muted rounded-xl shadow p-3">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ background: BOOKING_COLORS.cancelled }}
                    />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Đã huỷ
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {bookingStatus?.data?.cancelled}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-muted rounded-xl shadow p-3">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ background: BOOKING_COLORS.pending }}
                    />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Chờ xử lý
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {bookingStatus?.data?.pending}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Trạng thái khách sạn */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" /> Trạng thái khách sạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHotelStatus ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-full max-w-md h-80 flex flex-col items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={hotelPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={70}
                        labelLine={false}
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {hotelPieData.map((entry, idx) => (
                          <Cell key={`cell-hotel-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ fontSize: 15 }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  {/* Tổng khách sạn ở giữa PieChart */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-xs text-muted-foreground font-medium leading-tight mb-1">
                      Tổng khách sạn
                    </span>
                    <span className="text-xl font-bold text-primary leading-tight">
                      {totalHotel}
                    </span>
                  </div>
                </div>
                {/* Thống kê từng trạng thái khách sạn */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  <div className="flex items-center gap-3 bg-white dark:bg-muted rounded-xl shadow p-3">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ background: HOTEL_COLORS.active }}
                    />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Hoạt động
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {hotelStatus?.data?.active}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-muted rounded-xl shadow p-3">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ background: HOTEL_COLORS.pending }}
                    />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Chờ duyệt
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {hotelStatus?.data?.pending}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-muted rounded-xl shadow p-3">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ background: HOTEL_COLORS.inactive }}
                    />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Ngừng hoạt động
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {hotelStatus?.data?.inactive}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc + Biểu đồ tổng quan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart2 className="w-5 h-5 text-primary" /> Bộ lọc biểu đồ tổng
            quan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end justify-center py-2">
            <div className="flex flex-col gap-1 w-full max-w-[180px]">
              <Label htmlFor="chart-from" className="text-xs font-medium mb-1">
                Từ ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="border rounded-lg px-3 py-2 pr-10 w-full flex items-center text-sm shadow-sm focus:outline-primary bg-white hover:bg-muted transition group"
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                    {chartFrom ? (
                      new Date(chartFrom).toLocaleDateString("vi-VN")
                    ) : (
                      <span className="text-muted-foreground group-hover:text-primary">
                        Chọn ngày bắt đầu
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={chartFrom ? new Date(chartFrom) : undefined}
                    onSelect={(date) => {
                      if (date instanceof Date)
                        setChartFrom(date.toISOString().slice(0, 10));
                    }}
                    initialFocus
                    locale={vi}
                    disabled={(date) => date > new Date(chartTo)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[180px]">
              <Label htmlFor="chart-to" className="text-xs font-medium mb-1">
                Đến ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="border rounded-lg px-3 py-2 pr-10 w-full flex items-center text-sm shadow-sm focus:outline-primary bg-white hover:bg-muted transition group"
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                    {chartTo ? (
                      new Date(chartTo).toLocaleDateString("vi-VN")
                    ) : (
                      <span className="text-muted-foreground group-hover:text-primary">
                        Chọn ngày kết thúc
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={chartTo ? new Date(chartTo) : undefined}
                    onSelect={(date) => {
                      if (date instanceof Date)
                        setChartTo(date.toISOString().slice(0, 10));
                    }}
                    initialFocus
                    locale={vi}
                    disabled={(date) => date < new Date(chartFrom)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[140px]">
              <Label className="text-xs font-medium mb-1">Nhóm theo</Label>
              <Select
                value={groupBy}
                onValueChange={(v) => setGroupBy(v as "day" | "month")}
              >
                <SelectTrigger className="rounded-lg px-3 py-2 text-sm shadow-sm">
                  <SelectValue placeholder="Nhóm theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Ngày</SelectItem>
                  <SelectItem value="month">Tháng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
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

      {/* Bộ lọc chung cho top khách sạn và người dùng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart2 className="w-5 h-5 text-primary" /> Bộ lọc xếp hạng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end justify-center py-2">
            <div className="flex flex-col gap-1 w-full max-w-[180px]">
              <Label
                htmlFor="ranking-from"
                className="text-xs font-medium mb-1"
              >
                Từ ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="border rounded-lg px-3 py-2 pr-10 w-full flex items-center text-sm shadow-sm focus:outline-primary bg-white hover:bg-muted transition group"
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                    {rankingFrom ? (
                      new Date(rankingFrom).toLocaleDateString("vi-VN")
                    ) : (
                      <span className="text-muted-foreground group-hover:text-primary">
                        Chọn ngày bắt đầu
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={rankingFrom ? new Date(rankingFrom) : undefined}
                    onSelect={(date) => {
                      if (date instanceof Date)
                        setRankingFrom(date.toISOString().slice(0, 10));
                    }}
                    initialFocus
                    locale={vi}
                    disabled={(date) => date > new Date(rankingTo)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[180px]">
              <Label htmlFor="ranking-to" className="text-xs font-medium mb-1">
                Đến ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="border rounded-lg px-3 py-2 pr-10 w-full flex items-center text-sm shadow-sm focus:outline-primary bg-white hover:bg-muted transition group"
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                    {rankingTo ? (
                      new Date(rankingTo).toLocaleDateString("vi-VN")
                    ) : (
                      <span className="text-muted-foreground group-hover:text-primary">
                        Chọn ngày kết thúc
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={rankingTo ? new Date(rankingTo) : undefined}
                    onSelect={(date) => {
                      if (date instanceof Date)
                        setRankingTo(date.toISOString().slice(0, 10));
                    }}
                    initialFocus
                    locale={vi}
                    disabled={(date) => date < new Date(rankingFrom)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[140px]">
              <Label className="text-xs font-medium mb-1">Số lượng top</Label>
              <Select
                value={rankingLimit.toString()}
                onValueChange={(v) => setRankingLimit(Number(v))}
              >
                <SelectTrigger className="rounded-lg px-3 py-2 text-sm shadow-sm">
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
          </div>
        </CardContent>
      </Card>

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
