import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { postApi } from "@/api/post/post.api";
import { Post } from "@/types/post";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";

// Card hướng dẫn cố định
const guideCard = {
  id: "guide",
  title: "travel.inspiration.expert_guide",
  image:
    "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800&h=600&fit=crop",
  isGuide: true,
};

export default function TravelInspiration() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Lấy danh sách bài viết bằng react-query
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: postApi.getPosts,
  });

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "d 'Tháng' L yyyy", { locale: vi });
  };

  // Lấy 2 bài viết đầu tiên
  const posts: Post[] = (
    data?.data?.filter((post: Post) => post.status === "approved") || []
  ).slice(0, 2);

  return (
    <section className="md:py-12 py-6 bg-background md:px-0 px-4">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-3xl font-bold">
            {t("travel.inspiration.title")}
          </h2>
          <Button
            variant="outline"
            className="font-medium"
            onClick={() => navigate("/blog")}
          >
            {t("common.view_all")}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card hướng dẫn luôn ở đầu */}
          <div
            key={guideCard.id}
            className="relative rounded-lg overflow-hidden pointer-events-none aspect-[4/3]"
          >
            <img
              src={guideCard.image}
              alt={t(guideCard.title)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                {t(guideCard.title)}
              </h3>
            </div>
          </div>
          {/* Loading skeleton cho 2 bài viết */}
          {isLoading
            ? [1, 2].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] w-full h-full" />
              ))
            : posts.map((post, i) => (
                <div
                  key={post.id || post._id || i}
                  className="relative rounded-lg overflow-hidden group cursor-pointer aspect-[4/3]"
                  onClick={() => navigate(`/blog/${post.id || post._id}`)}
                >
                  <img
                    src={post.images?.[0]?.url || "/images/default.jpg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
