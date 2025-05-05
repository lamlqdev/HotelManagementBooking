import { format, startOfDay } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { locationApi } from "@/api/location/location.api";
import { Location } from "@/types/location";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [capacity, setCapacity] = useState(defaultValues?.capacity || 2);

  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await locationApi.getLocations();
      return response.success ? response.data : [];
    },
  });

  useEffect(() => {
    if (defaultValues?.locationName && locations.length > 0) {
      const location = locations.find(
        (loc) => loc.name === defaultValues.locationName
      );
      if (location) {
        setSelectedLocation(location);
      }
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
  }, [defaultValues, locations]);

  const formatDate = (date: Date) => {
    const formatted = format(date, "PPP", {
      locale: i18n.language === "vi" ? vi : enUS,
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const handleSearch = () => {
    if (!selectedLocation || !checkIn || !checkOut) {
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
    >
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Location Dropdown */}
        <div className="flex-1 w-full">
          <label className="text-sm font-medium mb-2 block">
            {t("search.destination")}
          </label>
          <Select
            value={selectedLocation?._id}
            onValueChange={(value) => {
              const location = locations.find((loc) => loc._id === value);
              setSelectedLocation(location || null);
            }}
            disabled={isLoadingLocations}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("search.placeholder.destination")} />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location._id} value={location._id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
