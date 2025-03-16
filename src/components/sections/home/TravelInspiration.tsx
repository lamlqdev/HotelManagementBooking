import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface TravelPost {
  id: number;
  title: string;
  image: string;
  date: Date;
  categories: string[];
  isGuide?: boolean;
}

const travelPosts: TravelPost[] = [
  {
    id: 1,
    title: "travel.inspiration.expert_guide",
    image:
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800&h=600&fit=crop",
    date: new Date(),
    categories: [],
    isGuide: true,
  },
  {
    id: 2,
    title: "Các địa điểm nhất định phải ghé tại Hội An",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&h=600&fit=crop",
    date: new Date("2025-02-14"),
    categories: [
      "travel.inspiration.categories.explore",
      "travel.inspiration.categories.souvenir",
    ],
  },
  {
    id: 3,
    title: "Ghé Đà Lạt nhân dịp Festival hoa năm nay",
    image:
      "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=800&h=600&fit=crop",
    date: new Date("2024-09-08"),
    categories: [
      "travel.inspiration.categories.festival",
      "travel.inspiration.categories.nature",
      "travel.inspiration.categories.people",
    ],
  },
];

export default function TravelInspiration() {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return format(date, "d 'Tháng' L yyyy", { locale: vi });
  };

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            {t("travel.inspiration.title")}
          </h2>
          <Button variant="outline" className="font-medium">
            {t("common.view_all")}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelPosts.map((post) => (
            <div
              key={post.id}
              className={`relative rounded-lg overflow-hidden ${
                post.isGuide ? "pointer-events-none" : "group cursor-pointer"
              } aspect-[4/3]`}
            >
              <img
                src={post.image}
                alt={post.isGuide ? t(post.title) : post.title}
                className={`w-full h-full object-cover ${
                  !post.isGuide &&
                  "transition-transform duration-300 group-hover:scale-110"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                {post.isGuide ? (
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {t(post.title)}
                  </h3>
                ) : (
                  <>
                    <div className="flex gap-2 mb-2">
                      {post.categories.map((category, index) => (
                        <span key={index} className="text-white text-sm">
                          {t(category)}
                          {index < post.categories.length - 1 && " • "}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {formatDate(post.date)}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
