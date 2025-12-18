import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { FiSearch, FiCalendar } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

import { postApi } from "@/api/post/post.api";
import { Post } from "@/types/post";

import HeroBanner from "@/components/common/HeroBanner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function stripHtml(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Lấy danh sách bài viết từ API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: postApi.getPosts,
  });

  // Danh sách bài viết từ API
  const blogPosts: Post[] = (data?.data || []).map((item: unknown) => {
    const post = item as Post & { _id?: string };
    return {
      ...post,
      id: post._id || post.id,
    };
  });

  // Chỉ lấy bài viết đã duyệt và lọc theo search
  const filteredPosts = blogPosts
    .filter((post) => post.status === "approved")
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePostClick = (id: string) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        title={t("blog.hero.title")}
        description={t("blog.hero.subtitle")}
      />

      {/* Search Section */}
      <div className="w-full md:max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="w-full">
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
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(postsPerPage)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            {t("common.error")}
          </div>
        ) : currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="relative h-48">
                    <img
                      src={post.images?.[0]?.url || "/images/default.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {stripHtml(post.content).slice(0, 100)}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
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
