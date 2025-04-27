import { useTranslation } from "react-i18next";
import {
  Building2,
  Search,
  Plus,
  Filter,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { hotelApi } from "@/api/hotel/hotel.api";
import { Hotel } from "@/types/hotel";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";

export default function HotelsManagementPage() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  // Sử dụng React Query để lấy danh sách khách sạn
  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels", currentPage],
    queryFn: async () => {
      const response = await hotelApi.getHotels({
        page: currentPage,
        limit: 10,
      });
      return response;
    },
  });

  // Xử lý lỗi
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">
            {t("common.error")}
          </h2>
          <p className="text-muted-foreground">{t("common.errorMessage")}</p>
        </div>
      </div>
    );
  }

  const totalPages = data?.pagination?.totalPages || 1;
  const allHotels = data?.data || [];

  // Lọc khách sạn theo trạng thái
  const hotels =
    statusFilter === "all"
      ? allHotels
      : allHotels.filter((hotel: Hotel) => hotel.status === statusFilter);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleRowClick = (hotelId: string) => {
    navigate(`/admin/hotels/${hotelId}`);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Thêm trang đầu nếu cần
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Thêm các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Thêm trang cuối nếu cần
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                <h1 className="text-2xl font-bold">
                  {t("admin.hotels.title")}
                </h1>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("admin.hotels.addNew")}
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              {t("admin.hotels.description")}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("admin.hotels.searchPlaceholder")}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("admin.hotels.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("admin.hotels.status.all")}
                </SelectItem>
                <SelectItem value="active">
                  {t("admin.hotels.status.active")}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("admin.hotels.status.inactive")}
                </SelectItem>
                <SelectItem value="pending">
                  {t("admin.hotels.status.pending")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t("common.filter")}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[25%]">
                  {t("admin.hotels.table.name")}
                </TableHead>
                <TableHead className="w-[20%]">
                  {t("admin.hotels.table.location")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("admin.hotels.table.checkInOut")}
                </TableHead>
                <TableHead className="w-[20%]">
                  {t("admin.hotels.table.policies")}
                </TableHead>
                <TableHead className="w-[10%]">
                  {t("admin.hotels.table.rating")}
                </TableHead>
                <TableHead className="w-[10%]">
                  {t("admin.hotels.table.status")}
                </TableHead>
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
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : hotels.length > 0 ? (
                hotels.map((hotel: Hotel) => (
                  <TableRow
                    key={hotel._id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(hotel._id)}
                  >
                    <TableCell className="max-w-[25%]">
                      <span className="font-medium truncate block">
                        {hotel.name}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[20%]">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="truncate">{hotel.address}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[15%]">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="whitespace-nowrap">
                          {hotel.policies.checkInTime} -{" "}
                          {hotel.policies.checkOutTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[20%]">
                      <div className="flex flex-wrap gap-1">
                        {hotel.policies.childrenPolicy === "yes" && (
                          <Badge variant="outline" className="text-xs">
                            {t("admin.hotels.policies.childrenAllowed")}
                          </Badge>
                        )}
                        {hotel.policies.petPolicy === "yes" && (
                          <Badge variant="outline" className="text-xs">
                            {t("admin.hotels.policies.petsAllowed")}
                          </Badge>
                        )}
                        {hotel.policies.smokingPolicy === "yes" && (
                          <Badge variant="outline" className="text-xs">
                            {t("admin.hotels.policies.smokingAllowed")}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[10%]">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <span className="font-medium">{hotel.rating || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[10%]">
                      <Badge
                        variant={
                          hotel.status === "active" ? "default" : "secondary"
                        }
                        className="whitespace-nowrap"
                      >
                        {t(`admin.hotels.status.${hotel.status}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("admin.hotels.noHotels")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {hotels.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground text-center mb-4">
                {t("common.showing")} {(currentPage - 1) * 10 + 1}-
                {Math.min(currentPage * 10, data?.count || 0)} {t("common.of")}{" "}
                {data?.total || 0} {t("common.results")}
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

                  {renderPaginationItems()}

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
