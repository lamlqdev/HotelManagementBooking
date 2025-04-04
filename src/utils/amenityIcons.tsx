import {
  Wifi,
  Snowflake,
  Wine,
  Lock,
  Sun,
  Waves,
  Dumbbell,
  Heart,
  Utensils,
  Coffee,
  Bell,
  Presentation,
  Tv,
  Bath,
  Droplet,
  Phone,
  Table,
  Sofa,
  Fan,
  Coffee as CoffeeIcon,
  PlayCircle,
  Car,
  Receipt,
  Building,
  Cigarette,
  Shirt,
  Plane,
} from "lucide-react";

export const getAmenityIcon = (icon: string) => {
  switch (icon) {
    // Hotel amenities
    case "pool-icon":
      return <Waves className="w-5 h-5" />;
    case "gym-icon":
      return <Dumbbell className="w-5 h-5" />;
    case "restaurant-icon":
      return <Utensils className="w-5 h-5" />;
    case "spa-icon":
      return <Heart className="w-5 h-5" />;
    case "bar-icon":
      return <Wine className="w-5 h-5" />;
    case "lobby-icon":
      return <Sofa className="w-5 h-5" />;
    case "laundry-icon":
      return <Shirt className="w-5 h-5" />;
    case "parking-icon":
      return <Car className="w-5 h-5" />;
    case "conference-icon":
      return <Presentation className="w-5 h-5" />;
    case "tennis-icon":
      return <Dumbbell className="w-5 h-5" />;
    case "playground-icon":
      return <PlayCircle className="w-5 h-5" />;
    case "shuttle-icon":
      return <Plane className="w-5 h-5" />;
    case "reception-icon":
      return <Receipt className="w-5 h-5" />;
    case "elevator-icon":
      return <Building className="w-5 h-5" />;
    case "smoking-icon":
      return <Cigarette className="w-5 h-5" />;
    case "room-service-icon":
      return <Bell className="w-5 h-5" />;

    // Room amenities
    case "wifi-icon":
      return <Wifi className="w-5 h-5" />;
    case "ac-icon":
      return <Snowflake className="w-5 h-5" />;
    case "tv-icon":
      return <Tv className="w-5 h-5" />;
    case "minibar-icon":
      return <Wine className="w-5 h-5" />;
    case "bath-icon":
      return <Bath className="w-5 h-5" />;
    case "shower-icon":
      return <Droplet className="w-5 h-5" />;
    case "hair-dryer-icon":
      return <Fan className="w-5 h-5" />;
    case "desk-icon":
      return <Table className="w-5 h-5" />;
    case "wardrobe-icon":
      return <Sofa className="w-5 h-5" />;
    case "dressing-table-icon":
      return <Table className="w-5 h-5" />;
    case "phone-icon":
      return <Phone className="w-5 h-5" />;
    case "safe-icon":
      return <Lock className="w-5 h-5" />;
    case "balcony-icon":
      return <Sun className="w-5 h-5" />;
    case "fridge-icon":
      return <Snowflake className="w-5 h-5" />;
    case "kettle-icon":
      return <Coffee className="w-5 h-5" />;
    case "coffee-set-icon":
      return <CoffeeIcon className="w-5 h-5" />;
    default:
      return null;
  }
};
