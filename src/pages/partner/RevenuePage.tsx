import { useState, useEffect } from "react";
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
  CalendarDays,
} from "lucide-react";
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

  // State cho period tổng quan
  const [summaryPeriod, setSummaryPeriod] = useState<
    "day" | "week" | "month" | "year"
  >("month");
  const [summaryFilterKey, setSummaryFilterKey] = useState(0);

  // State cho filter biểu đồ doanh thu
  const [chartFrom, setChartFrom] = useState<string>(
    firstDay.toISOString().slice(0, 10)
  );
  const [chartTo, setChartTo] = useState<string>(
    lastDay.toISOString().slice(0, 10)
  );
  const [groupBy, setGroupBy] = useState<"day" | "month">("day");
  const [chartFilterKey, setChartFilterKey] = useState(0);

  // State cho filter top phòng
  const [topFrom, setTopFrom] = useState<string>(
    firstDay.toISOString().slice(0, 10)
  );
  const [topTo, setTopTo] = useState<string>(
    lastDay.toISOString().slice(0, 10)
  );
  const [limit, setLimit] = useState<number>(5);
  const [topFilterKey, setTopFilterKey] = useState(0);

  // Tự động fetch khi thay đổi period tổng quan
  useEffect(() => {
    setSummaryFilterKey((k) => k + 1);
  }, [summaryPeriod]);

  // Tự động fetch khi thay đổi filter biểu đồ
  useEffect(() => {
    setChartFilterKey((k) => k + 1);
    // eslint-disable-next-line
  }, [chartFrom, chartTo, groupBy]);

  // Tự động fetch khi thay đổi filter top phòng
  useEffect(() => {
    setTopFilterKey((k) => k + 1);
    // eslint-disable-next-line
  }, [topFrom, topTo, limit]);

  // Tổng quan doanh thu
  const { data: revenueSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["statistics", "summary", summaryPeriod, summaryFilterKey],
    queryFn: () => statisticsApi.getRevenueSummary(summaryPeriod),
  });

  // Biểu đồ doanh thu
  const { data: revenueChart, isLoading: isLoadingChart } = useQuery({
    queryKey: [
      "statistics",
      "chart",
      { chartFrom, chartTo, groupBy, chartFilterKey },
    ],
    queryFn: () =>
      statisticsApi.getRevenueChart({
        from: chartFrom,
        to: chartTo,
        groupBy,
      }),
    enabled: !!chartFrom && !!chartTo,
  });

  // Top phòng doanh thu cao nhất
  const { data: topRooms, isLoading: isLoadingTopRooms } = useQuery({
    queryKey: [
      "statistics",
      "top-rooms",
      { limit, topFrom, topTo, topFilterKey },
    ],
    queryFn: () =>
      statisticsApi.getTopRooms({
        limit,
        from: topFrom,
        to: topTo,
      }),
    enabled: !!topFrom && !!topTo,
  });

  // Thống kê booking
  const { data: bookingStats, isLoading: isLoadingBookingStats } = useQuery({
    queryKey: ["statistics", "booking", chartFilterKey],
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center mb-2">Quản lý doanh thu</h1>

      {/* Tổng quan doanh thu dạng grid card nhỏ */}
      {isLoadingSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : revenueSummary?.data ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Select
              value={summaryPeriod}
              onValueChange={(v) =>
                setSummaryPeriod(v as "day" | "week" | "month" | "year")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="year">Năm nay</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
              <TrendingUp className="text-primary mb-2" />
              <div className="text-lg font-bold text-primary">
                {revenueSummary.data.totalRevenue.toLocaleString()} đ
              </div>
              <div className="text-xs text-muted-foreground">
                Tổng doanh thu
              </div>
            </Card>
            <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
              <Users className="text-primary mb-2" />
              <div className="text-lg font-bold text-primary">
                {revenueSummary.data.totalBookings}
              </div>
              <div className="text-xs text-muted-foreground">Tổng booking</div>
            </Card>
            <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
              <Hotel className="text-primary mb-2" />
              <div className="text-lg font-bold text-primary">
                {revenueSummary.data.successfulBookings}
              </div>
              <div className="text-xs text-muted-foreground">
                Booking thành công
              </div>
            </Card>
            <Card className="flex flex-col items-center py-4 shadow-md border border-gray-100">
              <ArrowDownUp className="mb-2 text-primary" />
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
        </div>
      ) : null}

      {/* Bộ lọc + Biểu đồ doanh thu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-5 h-5 text-primary" /> Bộ lọc biểu đồ doanh thu
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
          <CardTitle>Biểu đồ doanh thu</CardTitle>
          <div className="text-xs text-muted-foreground">
            Theo {groupBy === "day" ? "ngày" : "tháng"} ({chartFrom} - {chartTo}
            )
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingChart ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : revenueChart?.data && revenueChart.data.length > 0 ? (
            <div className="w-full h-[420px] bg-white dark:bg-muted rounded-2xl p-4 shadow-sm border border-gray-100">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueChart.data}
                  margin={{ top: 32, right: 32, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, fontSize: 14 }}
                    labelStyle={{ fontWeight: 600 }}
                    formatter={(value: number, name: string) =>
                      name === "Doanh thu"
                        ? [value.toLocaleString() + " đ", "Doanh thu"]
                        : [value.toLocaleString(), "Số booking"]
                    }
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 14, marginBottom: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    name="Doanh thu"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      stroke: "#2563eb",
                      strokeWidth: 2,
                      fill: "#fff",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#2563eb",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#22c55e"
                    name="Số booking"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      stroke: "#22c55e",
                      strokeWidth: 2,
                      fill: "#fff",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#22c55e",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </CardContent>
      </Card>

      {/* Bộ lọc + Top phòng doanh thu cao nhất */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-5 h-5 text-primary" /> Bộ lọc top phòng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end justify-center py-2">
            <div className="flex flex-col gap-1 w-full max-w-[180px]">
              <Label htmlFor="top-from" className="text-xs font-medium mb-1">
                Từ ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="border rounded-lg px-3 py-2 pr-10 w-full flex items-center text-sm shadow-sm focus:outline-primary bg-white hover:bg-muted transition group"
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                    {topFrom ? (
                      new Date(topFrom).toLocaleDateString("vi-VN")
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
                    selected={topFrom ? new Date(topFrom) : undefined}
                    onSelect={(date) => {
                      if (date instanceof Date)
                        setTopFrom(date.toISOString().slice(0, 10));
                    }}
                    initialFocus
                    locale={vi}
                    disabled={(date) => date > new Date(topTo)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[180px]">
              <Label htmlFor="top-to" className="text-xs font-medium mb-1">
                Đến ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="border rounded-lg px-3 py-2 pr-10 w-full flex items-center text-sm shadow-sm focus:outline-primary bg-white hover:bg-muted transition group"
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                    {topTo ? (
                      new Date(topTo).toLocaleDateString("vi-VN")
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
                    selected={topTo ? new Date(topTo) : undefined}
                    onSelect={(date) => {
                      if (date instanceof Date)
                        setTopTo(date.toISOString().slice(0, 10));
                    }}
                    initialFocus
                    locale={vi}
                    disabled={(date) => date < new Date(topFrom)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[140px]">
              <Label className="text-xs font-medium mb-1">Số phòng top</Label>
              <Select
                value={limit.toString()}
                onValueChange={(v) => setLimit(Number(v))}
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
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : bookingStats?.data ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-full max-w-md h-80 flex flex-col items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} booking`,
                        name,
                      ]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 15 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Tổng booking ở giữa PieChart */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="text-3xl font-bold text-primary">
                    {bookingStats.data.totalBookings}
                  </span>
                  <span className="text-base text-muted-foreground font-medium">
                    Tổng booking
                  </span>
                </div>
              </div>
              {/* Thống kê từng trạng thái */}
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
                      {bookingStats.data.successfulBookings}
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
                      {confirmedBookings}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-muted rounded-xl shadow p-3">
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ background: BOOKING_COLORS.cancelled }}
                  />
                  <div>
                    <div className="text-sm text-muted-foreground">Đã huỷ</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {bookingStats.data.cancelledBookings}
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
                      {bookingStats.data.pendingBookings}
                    </div>
                  </div>
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
