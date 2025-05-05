import { useTranslation } from "react-i18next";

import { Amenity } from "@/types/amenity";
import { getAmenityIcon } from "@/utils/amenityIcons";

interface HotelOverviewProps {
  description: string;
  amenities: Amenity[];
}

const HotelOverview = ({ description, amenities }: HotelOverviewProps) => {
  const { t } = useTranslation();
  
  return (
    <section id="tổng quan">
      <div className="space-y-6">
        <p className="text-muted-foreground">{description}</p>

        {/* Divider */}
        <hr className="my-8 border-border" />

        {/* Amenities */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            {t("hotel.overview.amenities")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon ? getAmenityIcon(amenity.icon) : null;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 text-primary"
                >
                  {Icon}
                  <span className="text-primary">{amenity.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelOverview;
