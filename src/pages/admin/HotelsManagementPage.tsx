import { useTranslation } from "react-i18next";
import {
  Building2,
  Search,
  Plus,
  Filter,
  Star,
  MapPin,
  Clock,
  Globe,
  Eye,
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
import { Hotel } from "@/api/hotel/type";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function HotelsManagementPage() {
  const { t } = useTranslation();

  // Sử dụng React Query để lấy danh sách khách sạn
  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const response = await hotelApi.getHotels();
      return response.data;
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
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t("common.filter")}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t("admin.hotels.table.name")}</TableHead>
                <TableHead>{t("admin.hotels.table.location")}</TableHead>
                <TableHead>{t("admin.hotels.table.policies")}</TableHead>
                <TableHead>{t("admin.hotels.table.rating")}</TableHead>
                <TableHead>{t("admin.hotels.table.status")}</TableHead>
                <TableHead className="text-right">
                  {t("common.actions")}
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
                      <Skeleton className="h-6 w-40 mb-1" />
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-36" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data && data.length > 0 ? (
                // Hiển thị dữ liệu khi đã load xong
                data.map((hotel: Hotel) => (
                  <TableRow
                    key={hotel._id || hotel.id}
                    className="hover:bg-transparent"
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{hotel.name}</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{hotel.address}</span>
                        </div>
                        {hotel.website && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            <a
                              href={hotel.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {hotel.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {hotel.locationName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {hotel.locationDescription}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>
                            {hotel.policies.checkInTime} -{" "}
                            {hotel.policies.checkOutTime}
                          </span>
                        </div>
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
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span>{hotel.rating || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          hotel.status === "active" ? "default" : "secondary"
                        }
                      >
                        {t(`admin.hotels.status.${hotel.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Hiển thị thông báo khi không có dữ liệu
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
        </Card>
      </div>
    </div>
  );
}
