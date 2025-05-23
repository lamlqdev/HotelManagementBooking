import { useTranslation } from "react-i18next";
import { Users, Search, Filter, Mail, Phone, Shield } from "lucide-react";
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
import { userApi } from "@/api/user/user.api";
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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router";

export default function UsersManagementPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    isEmailVerified: "all",
  });

  // Sử dụng React Query để lấy danh sách người dùng
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", currentPage, search, filters],
    queryFn: async () => {
      const response = await userApi.getUsers({
        page: currentPage,
        limit: 5,
        search,
        role: filters.role === "all" ? undefined : filters.role,
        isEmailVerified:
          filters.isEmailVerified === "true"
            ? true
            : filters.isEmailVerified === "false"
            ? false
            : undefined,
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
  const users = data?.data || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      role: "all",
      isEmailVerified: "all",
    });
    setSearch("");
    setCurrentPage(1);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/admin/users/${userId}`);
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
                <Users className="h-6 w-6" />
                <h1 className="text-2xl font-bold">{t("admin.users.title")}</h1>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">
              {t("admin.users.description")}
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("admin.users.searchPlaceholder")}
                  className="pl-9"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleResetFilters}>
                <Filter className="h-4 w-4 mr-2" />
                {t("admin.users.filters.reset")}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">
                  {t("admin.users.filters.role")}
                </label>
                <Select
                  value={filters.role}
                  onValueChange={(value) => handleFilterChange("role", value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t("admin.users.filters.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="admin">
                      {t("admin.users.roles.admin")}
                    </SelectItem>
                    <SelectItem value="user">
                      {t("admin.users.roles.user")}
                    </SelectItem>
                    <SelectItem value="partner">
                      {t("admin.users.roles.partner")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">
                  {t("admin.users.filters.emailVerified")}
                </label>
                <Select
                  value={filters.isEmailVerified}
                  onValueChange={(value) =>
                    handleFilterChange("isEmailVerified", value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue
                      placeholder={t("admin.users.filters.emailVerified")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="true">{t("common.yes")}</SelectItem>
                    <SelectItem value="false">{t("common.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[20%]">
                  {t("admin.users.table.name")}
                </TableHead>
                <TableHead className="w-[20%]">
                  {t("admin.users.table.email")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("admin.users.table.phone")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("admin.users.table.role")}
                </TableHead>
                <TableHead className="w-[10%]">
                  {t("admin.users.table.status")}
                </TableHead>
                <TableHead className="w-[10%]">
                  {t("admin.users.table.emailVerified")}
                </TableHead>
                <TableHead className="w-[10%]">
                  {t("admin.users.table.createdAt")}
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
                      <Skeleton className="h-6 w-40" />
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
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-transparent cursor-pointer"
                    onClick={() => handleUserClick(user._id)}
                  >
                    <TableCell className="max-w-[20%] py-4">
                      <span className="font-medium truncate block">
                        {user.name}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[20%] py-4">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[15%] py-4">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[15%] py-4">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          {t(`admin.users.roles.${user.role}`)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[10%] py-4">
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                        className="whitespace-nowrap"
                      >
                        {t(
                          `admin.users.status.${
                            user.status === "active" ? "active" : "inactive"
                          }`
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[10%] py-4">
                      <Badge
                        variant={user.isEmailVerified ? "default" : "secondary"}
                        className="whitespace-nowrap"
                      >
                        {user.isEmailVerified
                          ? t("common.yes")
                          : t("common.no")}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[10%] py-4">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(user.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("admin.users.noUsers")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {users.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground text-center mb-4">
                {t("common.showing")} {(currentPage - 1) * 10 + 1}-
                {Math.min(currentPage * 10, data?.count || 0)} {t("common.of")}{" "}
                {data?.pagination?.totalItems || 0} {t("common.results")}
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
