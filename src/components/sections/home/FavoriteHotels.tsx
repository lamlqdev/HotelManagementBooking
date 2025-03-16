import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Button } from "../../ui/button";
import { Heart, Star } from "lucide-react";

interface FavoriteHotel {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  isFavorite: boolean;
}

const favoriteHotels: FavoriteHotel[] = [
  {
    id: 1,
    name: "Fusion Resort Cam Ranh",
    location: "Cam Ranh",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&h=600&fit=crop",
    rating: 4.9,
    reviewCount: 1250,
    price: 8500000,
    isFavorite: false,
  },
  {
    id: 2,
    name: "Six Senses Ninh Van Bay",
    location: "Nha Trang",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&h=600&fit=crop",
    rating: 4.8,
    reviewCount: 980,
    price: 15200000,
    isFavorite: false,
  },
  {
    id: 3,
    name: "Amanoi Resort",
    location: "Ninh Thuận",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&h=600&fit=crop",
    rating: 5.0,
    reviewCount: 750,
    price: 20500000,
    isFavorite: false,
  },
  {
    id: 4,
    name: "Four Seasons Resort The Nam Hai",
    location: "Hội An",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&h=600&fit=crop",
    rating: 4.9,
    reviewCount: 2100,
    price: 12500000,
    isFavorite: false,
  },
];

export default function FavoriteHotels() {
  const { t } = useTranslation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleToggleFavorite = (hotelId: number) => {
    // Implement favorite toggle logic here
    console.log("Toggle favorite for hotel:", hotelId);
  };

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t("hotels.favorites")}</h2>
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
              {favoriteHotels.map((hotel) => (
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white/90 transition-colors group/btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(hotel.id);
                        }}
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            hotel.isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-gray-500 group-hover/btn:text-red-500"
                          }`}
                        />
                      </Button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {hotel.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({hotel.reviewCount} {t("common.reviews")})
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">
                        {hotel.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {hotel.location}
                      </p>
                      <div>
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(hotel.price)}
                          <span className="text-sm font-normal text-muted-foreground">
                            {" "}
                            {t("hotels.per_night")}
                          </span>
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
