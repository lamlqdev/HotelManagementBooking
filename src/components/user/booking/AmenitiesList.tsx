import { IconType } from "react-icons";

interface Amenity {
  icon: IconType;
  name: string;
}

interface AmenitiesListProps {
  amenities: Amenity[];
}

export const AmenitiesList = ({ amenities }: AmenitiesListProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {amenities.map((amenity, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <amenity.icon className="text-primary" />
          <span>{amenity.name}</span>
        </div>
      ))}
    </div>
  );
};
