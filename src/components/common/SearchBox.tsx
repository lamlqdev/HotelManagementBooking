import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, startOfDay } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { CalendarIcon, MapPinIcon, Search, Users } from "lucide-react";

interface SearchBoxProps {
  className?: string;
  onSearch?: (searchParams: {
    destination: string;
    checkIn: Date | undefined;
    checkOut: Date | undefined;
    adults: number;
    children: number;
  }) => void;
}

const SearchBox = ({ className, onSearch }: SearchBoxProps) => {
  const { t, i18n } = useTranslation();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const formatDate = (date: Date) => {
    const formatted = format(date, "PPP", {
      locale: i18n.language === "vi" ? vi : enUS,
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const handleSearch = () => {
    onSearch?.({
      destination,
      checkIn,
      checkOut,
      adults,
      children,
    });
  };

  return (
    <div
      className={`bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Destination */}
        <div className="flex-1 w-full">
          <label className="text-sm font-medium mb-2 block">
            {t("search.destination")}
          </label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search.placeholder.destination")}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

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

        {/* Guests */}
        <div className="flex-1 w-full">
          <label className="text-sm font-medium mb-2 block">
            {t("search.guests")}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>
                  {t("search.placeholder.guests", { adults, children })}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="grid gap-1">
                    <p className="font-medium">{t("search.adults")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setAdults(adults + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="grid gap-1">
                    <p className="font-medium">{t("search.children")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setChildren(children + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="flex-none h-10" size="lg">
          <Search className="mr-2 h-4 w-4" />
          {t("search.search_button")}
        </Button>
      </div>
    </div>
  );
};

export default SearchBox;
