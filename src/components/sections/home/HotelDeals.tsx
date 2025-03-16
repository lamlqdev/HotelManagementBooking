import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Star } from "lucide-react";

interface HotelDeal {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
}

const hotelDeals: HotelDeal[] = [
  {
    id: 1,
    name: "Vinpearl Resort & Spa Hạ Long",
    location: "Hạ Long",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&h=600&fit=crop",
    rating: 4.8,
    originalPrice: 5200000,
    discountedPrice: 3640000,
    discountPercent: 30,
  },
  {
    id: 2,
    name: "La Siesta Hoi An Resort & Spa",
    location: "Hội An",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&h=600&fit=crop",
    rating: 4.9,
    originalPrice: 4800000,
    discountedPrice: 2880000,
    discountPercent: 40,
  },
  {
    id: 3,
    name: "Dalat Palace Heritage Hotel",
    location: "Đà Lạt",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&h=600&fit=crop",
    rating: 4.7,
    originalPrice: 3800000,
    discountedPrice: 2660000,
    discountPercent: 30,
  },
  {
    id: 4,
    name: "InterContinental Phu Quoc",
    location: "Phú Quốc",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&h=600&fit=crop",
    rating: 4.9,
    originalPrice: 6500000,
    discountedPrice: 4550000,
    discountPercent: 30,
  },
  {
    id: 5,
    name: "Mia Resort Nha Trang",
    location: "Nha Trang",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&h=600&fit=crop",
    rating: 4.6,
    originalPrice: 4200000,
    discountedPrice: 2940000,
    discountPercent: 30,
  },
];

export default function HotelDeals() {
  const { t } = useTranslation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t("hotels.best_deals")}</h2>
          <Button variant="outline" className="font-medium">
            {t("common.view_all")}
          </Button>
        </div>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {hotelDeals.map((hotel) => (
                <CarouselItem
                  key={hotel.id}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="bg-card rounded-lg overflow-hidden border border-border group cursor-pointer">
                    <div className="relative aspect-[4/3]">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">
                        -{hotel.discountPercent}%
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {hotel.rating}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">
                        {hotel.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {hotel.location}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm line-through text-muted-foreground">
                          {formatPrice(hotel.originalPrice)}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(hotel.discountedPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-white hover:bg-white/90 text-foreground hover:text-foreground/90 border-none shadow-md" />
            <CarouselNext className="hidden md:flex -right-4 bg-white hover:bg-white/90 text-foreground hover:text-foreground/90 border-none shadow-md" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
