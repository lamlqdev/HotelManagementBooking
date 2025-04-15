import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Building2, Phone, FileText } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  GeneralTab,
  ContactTab,
  PoliciesTab,
} from "@/components/partner/hotel-info";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { hotelApi } from "@/api/hotel/hotel.api";
import { amenitiesApi } from "@/api/amenities/amenities.api";
import { useAppSelector } from "@/store/hooks";
import { Amenity } from "@/types/amenity";

const HotelInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const {
    data: hotels,
    isLoading: isLoadingHotels,
    error: hotelError,
  } = useQuery({
    queryKey: ["hotel"],
    queryFn: () => hotelApi.getMyHotels({ ownerId: user?.id }),
  });

  const { data: amenitiesData, isLoading: isLoadingAmenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => amenitiesApi.getAmenities(),
  });

  const hotel = hotels?.data[0];
  const availableAmenities = (amenitiesData?.data || []).filter(
    (amenity: Amenity) => amenity.type === "hotel"
  );

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleInputChange = (
    _e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // TODO: Implement input change
  };

  const handleAmenityToggle = (_amenityId: string) => {
    // TODO: Implement amenity toggle
  };

  if (isLoadingHotels || isLoadingAmenities) {
    return (
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (hotelError) {
    return (
      <div className="container mx-auto px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error.title")}</AlertTitle>
          <AlertDescription>{t("error.loadHotelFailed")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("info.title")}</AlertTitle>
          <AlertDescription>{t("info.noHotelFound")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("hotelInfo.title")}</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                {t("hotelInfo.buttons.cancel")}
              </Button>
              <Button onClick={handleSave}>
                {t("hotelInfo.buttons.save")}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              {t("hotelInfo.buttons.edit")}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="inline-flex h-14 items-center justify-center rounded-xl bg-secondary/50 p-1 text-secondary-foreground w-full max-w-2xl">
          <TabsTrigger
            value="general"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-8 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex-1 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {t("hotelInfo.general.basicInfo")}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-8 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex-1 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t("hotelInfo.contact.title")}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </TabsTrigger>
          <TabsTrigger
            value="policies"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-8 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex-1 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t("hotelInfo.policies.title")}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </TabsTrigger>
        </TabsList>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl" />
          <TabsContent value="general" className="space-y-6 relative">
            <GeneralTab
              hotel={hotel}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onAmenityToggle={handleAmenityToggle}
              availableAmenities={availableAmenities}
            />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6 relative">
            <ContactTab
              hotel={hotel}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="policies" className="space-y-6 relative">
            <PoliciesTab
              hotel={hotel}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default HotelInfoPage;
