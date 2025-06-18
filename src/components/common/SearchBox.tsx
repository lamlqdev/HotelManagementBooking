import { format, startOfDay } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { locationApi } from "@/api/location/location.api";
import { Location } from "@/types/location";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

import { CalendarIcon, Search } from "lucide-react";

interface SearchBoxProps {
  className?: string;
  onSearch?: (searchParams: {
    locationName: string;
    checkIn: string;
    checkOut: string;
    capacity: number;
  }) => void;
  defaultValues?: {
    locationName?: string;
    checkIn?: string;
    checkOut?: string;
    capacity?: number;
  };
}

const SearchBox = ({ className, onSearch, defaultValues }: SearchBoxProps) => {
  const { t, i18n } = useTranslation();
  const [locationQuery, setLocationQuery] = useState(
    defaultValues?.locationName || ""
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [capacity, setCapacity] = useState(defaultValues?.capacity || 2);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const { data, isLoading: isLoadingSearchResults } = useQuery<Location[]>({
    queryKey: ["searchLocations", locationQuery],
    queryFn: async () => {
      if (!locationQuery || locationQuery.length < 2) return [];
      const response = await locationApi.searchLocations(locationQuery, 5);
      return response.success ? response.data : [];
    },
    enabled: !!locationQuery && locationQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const searchResults: Location[] = data || [];

  useEffect(() => {
    if (defaultValues?.locationName) {
      setLocationQuery(defaultValues.locationName);
    }
    if (defaultValues?.checkIn) {
      setCheckIn(new Date(defaultValues.checkIn));
    }
    if (defaultValues?.checkOut) {
      setCheckOut(new Date(defaultValues.checkOut));
    }
    if (defaultValues?.capacity) {
      setCapacity(defaultValues.capacity);
    }
  }, [defaultValues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBoxRef]);

  const formatDate = (date: Date) => {
    const formatted = format(date, "PPP", {
      locale: i18n.language === "vi" ? vi : enUS,
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const handleSearch = () => {
    if (!selectedLocation || !checkIn || !checkOut) {
      toast.error(t("search.error.missing_fields"));
      return;
    }

    if (checkIn >= checkOut) {
      toast.error(t("search.error.invalid_dates"));
      return;
    }

    const searchParams = {
      locationName: selectedLocation.name,
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      capacity: capacity,
    };

    onSearch?.(searchParams);
  };

  return (
    <div
      className={`bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg ${className}`}
      ref={searchBoxRef}
    >
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Location Input */}
        <div className="flex-1 w-full relative">
          <label className="text-sm font-medium mb-2 block">
            {t("search.destination")}
          </label>

          <Input
            type="text"
            placeholder={t("search.placeholder.destination")}
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              setSelectedLocation(null);
              setShowLocationSuggestions(true);
            }}
            onFocus={() => setShowLocationSuggestions(true)}
          />
          {showLocationSuggestions && locationQuery.length >= 2 && (
            <div className="absolute z-10 bg-white border rounded-md shadow-lg w-full mt-1 max-h-60 overflow-hidden">
              {isLoadingSearchResults ? (
                <div className="p-4 text-center text-gray-500">
                  {t("common.loading")}
                </div>
              ) : searchResults.length > 0 ? (
                <ScrollArea className="h-full max-h-60">
                  {searchResults.map((location) => (
                    <div
                      key={location._id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedLocation(location);
                        setLocationQuery(location.name);
                        setShowLocationSuggestions(false);
                      }}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span>{location.name}</span>
                    </div>
                  ))}
                </ScrollArea>
              ) : null}
            </div>
          )}
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

        {/* Capacity */}
        <div className="flex-1 w-full">
          <label className="text-sm font-medium mb-2 block">
            {t("search.guests")}
          </label>
          <Input
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="flex-none h-10"
          size="lg"
          disabled={!selectedLocation || !checkIn || !checkOut}
        >
          <Search className="mr-2 h-4 w-4" />
          {t("search.search_button")}
        </Button>
      </div>
    </div>
  );
};

export default SearchBox;
