import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import HeroBanner from "../components/sections/home/HeroBanner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Mock data - Thay thế bằng dữ liệu thực từ API
  const categories: Category[] = [
    { id: "1", name: t("blog.categories.all"), slug: "all" },
    { id: "2", name: t("blog.categories.explore"), slug: "explore" },
    { id: "3", name: t("blog.categories.culture"), slug: "culture" },
    { id: "4", name: t("blog.categories.food"), slug: "food" },
    { id: "5", name: t("blog.categories.tips"), slug: "tips" },
  ];

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Khám phá 10 địa điểm du lịch hàng đầu tại Việt Nam",
      excerpt:
        "Từ vịnh Hạ Long hùng vĩ đến phố cổ Hội An đầy màu sắc, hãy cùng khám phá những điểm đến tuyệt vời nhất tại Việt Nam...",
      category: "explore",
      author: "Nguyễn Văn A",
      date: "2024-03-19",
      readTime: "5",
      imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592",
      slug: "top-10-destinations-vietnam",
    },
    {
      id: "2",
      title: "Ẩm thực đường phố Sài Gòn - Hương vị đặc trưng của phố thị",
      excerpt:
        "Khám phá những món ăn đường phố độc đáo và hấp dẫn tại Sài Gòn, từ cơm tấm đến bánh mì...",
      category: "food",
      author: "Trần Thị B",
      date: "2024-03-18",
      readTime: "4",
      imageUrl: "https://images.unsplash.com/photo-1583077874340-79db6564672e",
      slug: "saigon-street-food",
    },
    {
      id: "3",
      title: "Lễ hội truyền thống Việt Nam - Nét đẹp văn hóa ngàn năm",
      excerpt:
        "Tìm hiểu về những lễ hội độc đáo và ý nghĩa văn hóa sâu sắc của người Việt Nam...",
      category: "culture",
      author: "Lê Văn C",
      date: "2024-03-17",
      readTime: "6",
      imageUrl: "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1",
      slug: "vietnam-traditional-festivals",
    },
    {
      id: "4",
      title: "Kinh nghiệm du lịch bụi xuyên Việt",
      excerpt:
        "Chia sẻ những mẹo hữu ích và kinh nghiệm quý báu cho chuyến du lịch bụi xuyên Việt...",
      category: "tips",
      author: "Phạm Văn D",
      date: "2024-03-16",
      readTime: "7",
      imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
      slug: "backpacking-vietnam-tips",
    },
    {
      id: "5",
      title: "Khám phá hang động Quảng Bình",
      excerpt:
        "Cuộc phiêu lưu khó quên trong hệ thống hang động kỳ vĩ tại Quảng Bình...",
      category: "explore",
      author: "Hoàng Thị E",
      date: "2024-03-15",
      readTime: "5",
      imageUrl: "https://images.unsplash.com/photo-1583417319189-7e8e0789a738",
      slug: "quang-binh-caves",
    },
    {
      id: "6",
      title: "Văn hóa cà phê Việt Nam",
      excerpt:
        "Tìm hiểu về văn hóa cà phê độc đáo và phong phú của người Việt Nam...",
      category: "culture",
      author: "Nguyễn Thị F",
      date: "2024-03-14",
      readTime: "4",
      imageUrl: "https://images.unsplash.com/photo-1583417319191-7e8e0789a739",
      slug: "vietnam-coffee-culture",
    },
    {
      id: "7",
      title: "Top 5 bãi biển đẹp nhất miền Trung",
      excerpt:
        "Khám phá những bãi biển hoang sơ và tuyệt đẹp dọc miền Trung Việt Nam...",
      category: "explore",
      author: "Trần Văn G",
      date: "2024-03-13",
      readTime: "5",
      imageUrl: "https://images.unsplash.com/photo-1583417319192-7e8e0789a740",
      slug: "central-vietnam-beaches",
    },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "all" ||
      post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        title={t("blog.hero.title")}
        description={t("blog.hero.subtitle")}
      />

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="w-full md:w-96">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("blog.search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground hover:bg-primary/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-sm rounded-full">
                        {t(`blog.categories.${post.category}`)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <FiUser className="mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>
                          {post.readTime} {t("blog.readTime")}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => {
                      const pageNumber = i + 1;

                      // Hiển thị các trang đầu
                      if (pageNumber <= 2) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(
                                e: React.MouseEvent<HTMLAnchorElement>
                              ) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={pageNumber === currentPage}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Hiển thị các trang cuối
                      if (pageNumber >= totalPages - 1) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(
                                e: React.MouseEvent<HTMLAnchorElement>
                              ) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={pageNumber === currentPage}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Hiển thị trang hiện tại và các trang xung quanh
                      if (
                        pageNumber === currentPage ||
                        pageNumber === currentPage - 1 ||
                        pageNumber === currentPage + 1
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(
                                e: React.MouseEvent<HTMLAnchorElement>
                              ) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={pageNumber === currentPage}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Hiển thị dấu ... cho các trang bị ẩn
                      if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {t("blog.noResults")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
