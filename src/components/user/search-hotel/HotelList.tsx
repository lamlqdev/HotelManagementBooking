import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { Button } from "../../ui/button";
import { Hotel } from "@/types/hotel";

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {t("search.results", { count: hotels.length })}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {t("search.sort_by")}:
          </span>
          <Select onValueChange={onSortChange} defaultValue="">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("search.select_sort")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">
                {t("search.sort.price_asc")}
              </SelectItem>
              <SelectItem value="price_desc">
                {t("search.sort.price_desc")}
              </SelectItem>
              <SelectItem value="rating_desc">
                {t("search.sort.rating_desc")}
              </SelectItem>
              <SelectItem value="rating_asc">
                {t("search.sort.rating_asc")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("search.no_results")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="bg-card rounded-lg overflow-hidden border border-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="w-48 h-32 relative rounded-md overflow-hidden">
                    <img
                      src={hotel.featuredImage?.url || "/placeholder-image.jpg"}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {hotel.name}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {hotel.locationDescription || hotel.address}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="bg-primary text-primary-foreground px-2 py-1 rounded">
                          {hotel.rating.toFixed(1)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t("hotels.card.reviews_count", {
                            count: hotel.favoriteCount || 0,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {hotel.lowestPrice > hotel.lowestDiscountedPrice && (
                        <p className="text-sm text-muted-foreground">
                          {t("hotels.card.original_price")}:{" "}
                          <span className="line-through">
                            {formatPrice(hotel.lowestPrice)}
                          </span>
                        </p>
                      )}
                      <p className="text-xl font-bold text-primary">
                        {formatPrice(hotel.lowestDiscountedPrice)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("search.price.per_night")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="default"
                    onClick={() => navigate(`/hoteldetail/${hotel._id}`)}
                  >
                    {t("common.view_details")}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => onPageChange(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPageChange(currentPage + 1)}
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
          )}
        </>
      )}
    </div>
  );
};

export default HotelList;
