import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Phone, FileText } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  GeneralTab,
  ContactTab,
  PoliciesTab,
  Hotel,
} from "@/components/partner/hotel-info";

const HotelInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [hotel, setHotel] = useState<Hotel>({
    name: "Vinpearl Resort & Spa",
    address: "Nha Trang, Khánh Hòa",
    description: "Khách sạn 5 sao với view biển tuyệt đẹp",
    mainImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    galleryImages: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
    ],
    amenities: ["wifi", "parking", "pool", "restaurant"],
    phone: "0123456789",
    email: "contact@vinpearl.com",
    website: "https://vinpearl.com",
    representativeName: "Nguyễn Văn A",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "Hủy phòng miễn phí trước 24h",
    paymentPolicy: "Thanh toán tại khách sạn",
    houseRules: "Không hút thuốc trong phòng",
    childrenPolicy: "Trẻ em dưới 6 tuổi được miễn phí",
    petPolicy: "Không chấp nhận thú cưng",
    smokingPolicy: "Không hút thuốc trong phòng",
  });

  const { t } = useTranslation();

  const availableAmenities = [
    { id: "wifi", name: "WiFi miễn phí", icon: "wifi" },
    { id: "parking", name: "Bãi đỗ xe", icon: "parking" },
    { id: "elevator", name: "Thang máy", icon: "elevator" },
    { id: "air-conditioning", name: "Điều hòa", icon: "air-conditioning" },
    { id: "minibar", name: "Minibar", icon: "minibar" },
    { id: "safe", name: "Két sắt", icon: "safe" },
    { id: "balcony", name: "Ban công", icon: "balcony" },
    { id: "ocean-view", name: "View biển", icon: "ocean-view" },
    { id: "pool", name: "Bể bơi", icon: "pool" },
    { id: "gym", name: "Phòng tập", icon: "gym" },
    { id: "spa", name: "Spa", icon: "spa" },
    { id: "tennis", name: "Sân tennis", icon: "tennis" },
    { id: "restaurant", name: "Nhà hàng", icon: "restaurant" },
    { id: "bar", name: "Bar", icon: "bar" },
    { id: "cafe", name: "Café", icon: "cafe" },
    { id: "room-service", name: "Dịch vụ phòng", icon: "room-service" },
    { id: "meeting-room", name: "Phòng họp", icon: "meeting-room" },
    {
      id: "business-center",
      name: "Trung tâm kinh doanh",
      icon: "business-center",
    },
    { id: "conference-hall", name: "Hội trường", icon: "conference-hall" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHotel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setHotel((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

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
