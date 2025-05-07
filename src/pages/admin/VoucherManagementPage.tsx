import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Plus,
  RefreshCw,
  Tag,
  Percent,
  Calendar,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { voucherApi } from "@/api/voucher/voucher.api";
import { GetVouchersResponse } from "@/api/voucher/types";
import NoDiscount from "@/assets/illustration/NoDiscount.svg";
import CreateVoucherModal from "@/components/admin/voucher-management/CreateVoucherModal";

export default function VoucherManagementPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery<GetVouchersResponse>({
    queryKey: ["vouchers"],
    queryFn: () => voucherApi.getVouchers(),
  });

  const filteredVouchers = data?.data.filter((voucher) => {
    const matchesSearch = voucher.code
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || voucher.status === statusFilter;
    const matchesType =
      typeFilter === "all" || voucher.discountType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-destructive mb-4">
          {t("common.error_loading_data")}
        </p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("common.try_again")}
        </Button>
      </div>
    );
  }

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-6 w-6" />
                <h1 className="text-2xl font-bold">
                  {t("admin.vouchers.title")}
                </h1>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("admin.vouchers.create")}
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              {t("admin.vouchers.description")}
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("admin.vouchers.searchPlaceholder")}
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleResetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("admin.vouchers.filters.reset")}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">
                  {t("admin.vouchers.filters.status")}
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue
                      placeholder={t("admin.vouchers.filters.status")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="active">
                      {t("admin.vouchers.status.active")}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("admin.vouchers.status.inactive")}
                    </SelectItem>
                    <SelectItem value="expired">
                      {t("admin.vouchers.status.expired")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">
                  {t("admin.vouchers.filters.type")}
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue
                      placeholder={t("admin.vouchers.filters.type")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="percentage">
                      {t("admin.vouchers.types.percentage")}
                    </SelectItem>
                    <SelectItem value="fixed">
                      {t("admin.vouchers.types.fixed")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[20%]">
                  {t("admin.vouchers.table.code")}
                </TableHead>
                <TableHead className="w-[20%]">
                  {t("admin.vouchers.table.type")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("admin.vouchers.table.value")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("admin.vouchers.table.status")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("admin.vouchers.table.expiryDate")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("admin.vouchers.table.createdAt")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
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
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredVouchers?.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <img
                        src={NoDiscount}
                        alt="No vouchers"
                        className="w-96 h-96"
                      />
                      <p className="text-muted-foreground">
                        {t("admin.vouchers.noVouchers")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVouchers?.map((voucher) => (
                  <TableRow
                    key={voucher.id}
                    className="hover:bg-transparent cursor-pointer"
                  >
                    <TableCell className="max-w-[20%] py-4">
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="font-medium truncate block">
                          {voucher.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[20%] py-4">
                      <div className="flex items-center gap-1">
                        <Percent className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <Badge variant="outline" className="whitespace-nowrap">
                          {t(`admin.vouchers.types.${voucher.discountType}`)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[15%] py-4">
                      <span className="font-medium">
                        {voucher.discountType === "percentage"
                          ? `${voucher.discount}%`
                          : `${voucher.discount.toLocaleString()}đ`}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[15%] py-4">
                      <Badge
                        variant={
                          voucher.status === "active" ? "default" : "secondary"
                        }
                        className="whitespace-nowrap"
                      >
                        {t(`admin.vouchers.status.${voucher.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[15%] py-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(voucher.expiryDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[15%] py-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(voucher.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <CreateVoucherModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
