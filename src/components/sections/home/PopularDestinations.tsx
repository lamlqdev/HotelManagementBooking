import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";

import halongImg from "@/assets/images/destinations/halong.jpg";
import hoianImg from "@/assets/images/destinations/hoian.jpg";
import dalatImg from "@/assets/images/destinations/dalat.jpg";
import phuquocImg from "@/assets/images/destinations/phuquoc.jpg";
import nhatrangImg from "@/assets/images/destinations/nhatrang.jpg";
import sapaImg from "@/assets/images/destinations/sapa.jpg";

interface Destination {
  id: number;
  name: string;
  hotelCount: number;
  image: string;
}

const popularDestinations: Destination[] = [
  {
    id: 1,
    name: "Hạ Long",
    hotelCount: 245,
    image: halongImg,
  },
  {
    id: 2,
    name: "Hội An",
    hotelCount: 186,
    image: hoianImg,
  },
  {
    id: 3,
    name: "Đà Lạt",
    hotelCount: 312,
    image: dalatImg,
  },
  {
    id: 4,
    name: "Phú Quốc",
    hotelCount: 278,
    image: phuquocImg,
  },
  {
    id: 5,
    name: "Nha Trang",
    hotelCount: 421,
    image: nhatrangImg,
  },
  {
    id: 6,
    name: "Sapa",
    hotelCount: 165,
    image: sapaImg,
  },
];

export default function PopularDestinations() {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">{t("destinations.popular")}</h2>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {popularDestinations.map((destination) => (
                <CarouselItem
                  key={destination.id}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="relative group overflow-hidden rounded-lg cursor-pointer">
                    <div className="relative aspect-[4/3]">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-semibold mb-1">
                        {destination.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {t("destinations.hotel_count", {
                          count: destination.hotelCount,
                        })}
                      </p>
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
