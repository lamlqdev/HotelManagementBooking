import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { Button } from "../../ui/button";

interface Hotel {
  id: string;
  name: string;
  image: string;
  stars: number;
  price: number;
  originalPrice: number;
  location: string;
  rating: number;
  reviewCount: number;
}

interface HotelListProps {
  hotels: Hotel[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange: (value: string) => void;
}

const HotelList = ({
  hotels,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
}: HotelListProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Sort Section */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {t("search.results_count", { count: hotels.length })}
        </p>
        <Select onValueChange={onSortChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("sort.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">{t("sort.price_asc")}</SelectItem>
            <SelectItem value="price_desc">{t("sort.price_desc")}</SelectItem>
            <SelectItem value="rating_desc">{t("sort.rating_desc")}</SelectItem>
            <SelectItem value="popularity">{t("sort.popularity")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hotel Cards */}
      <div className="space-y-4">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="flex gap-4 p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-72 h-48 object-cover rounded-lg"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-semibold">{hotel.name}</h3>
                  <div className="flex items-center space-x-1">
                    {Array(hotel.stars)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {hotel.location}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded">
                      {hotel.rating.toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("hotels.card.reviews_count", {
                        count: hotel.reviewCount,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {t("hotels.card.original_price")}:{" "}
                    <span className="line-through">
                      {hotel.originalPrice.toLocaleString()}đ
                    </span>
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {hotel.price.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("search.price.per_night")}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="default"
                  onClick={() => navigate(`/hoteldetail/${hotel.id}`)}
                >
                  {t("hotels.card.select_room")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;

            // Hiển thị các trang đầu
            if (pageNumber <= 2) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      onPageChange(pageNumber);
                    }}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            // Hiển thị các trang cuối
            if (pageNumber >= totalPages - 1) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      onPageChange(pageNumber);
                    }}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            // Hiển thị trang hiện tại và các trang xung quanh
            if (
              pageNumber === currentPage ||
              pageNumber === currentPage - 1 ||
              pageNumber === currentPage + 1
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      onPageChange(pageNumber);
                    }}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            // Hiển thị dấu ... cho các trang bị ẩn
            if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return null;
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default HotelList;
