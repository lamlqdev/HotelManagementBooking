import { Amenity } from "@/types/amenity";
import { getAmenityIcon } from "@/utils/amenityIcons";

interface HotelOverviewProps {
  description: string;
  amenities: Amenity[];
}

const HotelOverview = ({ description, amenities }: HotelOverviewProps) => {
  return (
    <section id="tổng quan">
      <div className="space-y-6">
        <p className="text-muted-foreground">{description}</p>

        {/* Divider */}
        <hr className="my-8 border-border" />

        {/* Amenities */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            Các tiện ích
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon ? getAmenityIcon(amenity.icon) : null;
              return (
                <div key={index} className="flex items-center gap-3">
                  {Icon}
                  <span className="text-muted-foreground">{amenity.name}</span>
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
