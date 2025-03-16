import { FaMapMarkerAlt } from "react-icons/fa";
import { IconType } from "react-icons";

interface Amenity {
  icon: IconType;
  name: string;
}

interface NearbyPlace {
  name: string;
  distance: string;
}

interface HotelOverviewProps {
  description: string[];
  amenities: Amenity[];
  nearbyPlaces: NearbyPlace[];
}

const HotelOverview = ({
  description,
  amenities,
  nearbyPlaces,
}: HotelOverviewProps) => {
  return (
    <section id="tổng quan">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {description.map((paragraph, index) => (
            <p key={index} className="text-muted-foreground">
              {paragraph}
            </p>
          ))}

          {/* Divider */}
          <hr className="my-8 border-border" />

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Các tiện ích
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <amenity.icon className="text-primary text-xl" />
                  <span className="text-muted-foreground">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Nearby Places */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Các địa điểm xung quanh
            </h3>
            <div className="space-y-4">
              {nearbyPlaces.map((place, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span className="text-card-foreground">{place.name}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {place.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelOverview;
