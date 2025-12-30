import { format, startOfDay, differenceInDays } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CalendarIcon, Search } from "lucide-react";

interface RoomSearchBoxProps {
  defaultValues?: {
    checkIn?: string;
    checkOut?: string;
    capacity?: number;
  };
  onSearch: (searchParams: {
    checkIn: string;
    checkOut: string;
    capacity: number;
  }) => void;
}

const RoomSearchBox = ({ defaultValues, onSearch }: RoomSearchBoxProps) => {
  const { t, i18n } = useTranslation();
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    defaultValues?.checkIn ? new Date(defaultValues.checkIn) : undefined
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    defaultValues?.checkOut ? new Date(defaultValues.checkOut) : undefined
  );
  const [capacity, setCapacity] = useState(defaultValues?.capacity || 2);

  const formatDate = (date: Date) => {
    const formatted = format(date, "PPP", {
      locale: i18n.language === "vi" ? vi : enUS,
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const validateSearch = () => {
    if (!checkIn || !checkOut) {
      toast.error(t("search.error.select_dates"));
      return false;
    }

    const today = startOfDay(new Date());
    const checkInDate = startOfDay(checkIn);
    const checkOutDate = startOfDay(checkOut);

    // Kiểm tra ngày check-in không được trong quá khứ
    if (checkInDate < today) {
      toast.error(t("search.error.check_in_past"));
      return false;
    }

    // Kiểm tra ngày check-out phải sau ngày check-in
    if (checkOutDate <= checkInDate) {
      toast.error(t("search.error.check_out_before_check_in"));
      return false;
    }

    // Kiểm tra khoảng cách giữa check-in và check-out không quá 30 ngày
    const daysBetween = differenceInDays(checkOutDate, checkInDate);
    if (daysBetween > 30) {
      toast.error(t("search.error.max_stay_days"));
      return false;
    }

    // Kiểm tra số lượng người
    if (capacity < 1 || capacity > 6) {
      toast.error(t("search.error.invalid_capacity"));
      return false;
    }

    return true;
  };

  const handleSearch = () => {
    if (!validateSearch()) {
      return;
    }

    onSearch({
      checkIn: format(checkIn!, "yyyy-MM-dd"),
      checkOut: format(checkOut!, "yyyy-MM-dd"),
      capacity,
    });
  };

  return (
    <div className="space-y-4 my-6">
      <h3 className="text-2xl font-semibold">{t("hotel.rooms.title")}</h3>
      <div className="bg-background p-6 rounded-lg shadow-sm border border-blue-100 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Check-in */}
          <div className="flex-1 w-full">
            <label className="text-sm font-medium mb-2 block">
              {t("search.check_in")}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal hover:text-white group"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? (
                    formatDate(checkIn)
                  ) : (
                    <span className="text-muted-foreground group-hover:text-white">
                      {t("search.check_in")}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  initialFocus
                  locale={i18n.language === "vi" ? vi : enUS}
                  disabled={(date) => startOfDay(date) < startOfDay(new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out */}
          <div className="flex-1 w-full">
            <label className="text-sm font-medium mb-2 block">
              {t("search.check_out")}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal hover:text-white group"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? (
                    formatDate(checkOut)
                  ) : (
                    <span className="text-muted-foreground group-hover:text-white">
                      {t("search.check_out")}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  initialFocus
                  locale={i18n.language === "vi" ? vi : enUS}
                  disabled={(date) =>
                    startOfDay(date) < startOfDay(new Date()) ||
                    (checkIn ? startOfDay(date) <= startOfDay(checkIn) : false)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Capacity */}
          <div className="flex-1 w-full">
            <label className="text-sm font-medium mb-2 block">
              {t("search.guests")}
            </label>
            <Select
              value={capacity.toString()}
              onValueChange={(value) => setCapacity(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("search.placeholder.guests")} />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {t("search.guests")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="flex-none h-10"
            size="lg"
            disabled={!checkIn || !checkOut}
          >
            <Search className="mr-2 h-4 w-4" />
            {t("search.search_button")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomSearchBox;
