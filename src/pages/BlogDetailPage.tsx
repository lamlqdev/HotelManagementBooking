import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowLeft,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiBookmark,
  FiHeart,
  FiMessageSquare,
  FiShare2,
} from "react-icons/fi";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  slug: string;
  images: string[];
}

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
  readTime: string;
  category: string;
  author: string;
  date: string;
}

const BlogDetail: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128);

  // Mock data - Thay thế bằng dữ liệu thực từ API
  const blogPost: BlogPost = {
    id: "1",
    title: "Khám phá 10 địa điểm du lịch hàng đầu tại Việt Nam",
    content: `
      <p>Việt Nam là một đất nước xinh đẹp với vô số điểm đến hấp dẫn. Từ những bãi biển hoang sơ đến những di tích lịch sử cổ kính, mỗi nơi đều mang trong mình một câu chuyện riêng.</p>
      
      <img src="https://images.unsplash.com/photo-1528127269322-539801943592" alt="Vịnh Hạ Long" class="w-full h-[400px] object-cover rounded-lg my-8" />
      
      <h2>1. Vịnh Hạ Long</h2>
      <p>Vịnh Hạ Long, một trong bảy kỳ quan thiên nhiên thế giới mới, nổi tiếng với hàng nghìn hòn đảo đá vôi nhô lên từ mặt nước trong xanh. Du khách có thể tham gia các hoạt động như chèo thuyền kayak, lặn biển, hoặc đơn giản là ngồi trên du thuyền ngắm cảnh.</p>
      
      <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482" alt="Phố cổ Hội An" class="w-full h-[400px] object-cover rounded-lg my-8" />
      
      <h2>2. Phố cổ Hội An</h2>
      <p>Hội An là một thị trấn cổ được UNESCO công nhận là Di sản Văn hóa Thế giới. Với những ngôi nhà gỗ truyền thống, những chiếc đèn lồng đầy màu sắc và cầu chùa Nhật Bản, Hội An mang đến một không gian hoài cổ đặc biệt.</p>
      
      <img src="https://images.unsplash.com/photo-1583417319189-7e8e0789a738" alt="Sa Pa" class="w-full h-[400px] object-cover rounded-lg my-8" />
      
      <h2>3. Sa Pa</h2>
      <p>Nằm ở vùng núi Tây Bắc, Sa Pa nổi tiếng với những ruộng bậc thang tuyệt đẹp và văn hóa độc đáo của các dân tộc thiểu số. Du khách có thể đi bộ trekking, tham quan các làng bản và trải nghiệm cuộc sống của người dân địa phương.</p>
      
      <img src="https://images.unsplash.com/photo-1583417319191-7e8e0789a739" alt="Huế" class="w-full h-[400px] object-cover rounded-lg my-8" />
      
      <h2>4. Huế</h2>
      <p>Huế, cố đô của triều Nguyễn, là nơi lưu giữ nhiều di tích lịch sử quan trọng như Đại Nội, lăng tẩm các vị vua và chùa Thiên Mụ. Thành phố này cũng nổi tiếng với ẩm thực cung đình độc đáo.</p>
      
      <img src="https://images.unsplash.com/photo-1583417319192-7e8e0789a740" alt="Đà Lạt" class="w-full h-[400px] object-cover rounded-lg my-8" />
      
      <h2>5. Đà Lạt</h2>
      <p>Được mệnh danh là "Thành phố ngàn hoa", Đà Lạt có khí hậu mát mẻ quanh năm và phong cảnh thiên nhiên tươi đẹp. Du khách có thể tham quan các điểm đến như Hồ Xuân Hương, Nhà thờ Con Gà và các vườn hoa rực rỡ.</p>
    `,
    category: "explore",
    author: "Nguyễn Văn A",
    date: "2024-03-19",
    readTime: "5",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592",
    slug: "top-10-destinations-vietnam",
    images: [
      "https://images.unsplash.com/photo-1528127269322-539801943592",
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
      "https://images.unsplash.com/photo-1583417319189-7e8e0789a738",
      "https://images.unsplash.com/photo-1583417319191-7e8e0789a739",
      "https://images.unsplash.com/photo-1583417319192-7e8e0789a740",
    ],
  };

  // Mock data cho bài viết liên quan
  const relatedPosts: RelatedPost[] = [
    {
      id: "2",
      title: "Ẩm thực đường phố Sài Gòn - Hương vị đặc trưng của phố thị",
      excerpt:
        "Khám phá những món ăn đường phố độc đáo và hấp dẫn tại Sài Gòn...",
      imageUrl: "https://images.unsplash.com/photo-1583077874340-79db6564672e",
      slug: "saigon-street-food",
      readTime: "5",
      category: "food",
      author: "Nguyễn Văn B",
      date: "2024-03-20",
    },
    {
      id: "3",
      title: "Lễ hội truyền thống Việt Nam - Nét đẹp văn hóa ngàn năm",
      excerpt: "Tìm hiểu về những lễ hội độc đáo và ý nghĩa văn hóa sâu sắc...",
      imageUrl: "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1",
      slug: "vietnam-traditional-festivals",
      readTime: "5",
      category: "culture",
      author: "Nguyễn Văn C",
      date: "2024-03-21",
    },
    {
      id: "4",
      title: "Kinh nghiệm du lịch bụi xuyên Việt",
      excerpt:
        "Chia sẻ những mẹo hữu ích và kinh nghiệm quý báu cho chuyến du lịch...",
      imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
      slug: "backpacking-vietnam-tips",
      readTime: "5",
      category: "travel",
      author: "Nguyễn Văn D",
      date: "2024-03-22",
    },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Article Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-muted-foreground hover:text-foreground mb-4"
              >
                <FiArrowLeft className="mr-2" />
                {t("common.back")}
              </button>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {t(`blog.categories.${blogPost.category}`)}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground space-x-6">
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    <span>{blogPost.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    <span>{new Date(blogPost.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    <span>
                      {blogPost.readTime} {t("blog.readTime")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 p-2 rounded-full transition-colors ${
                      isLiked
                        ? "text-red-500 bg-red-500/10"
                        : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    }`}
                  >
                    <FiHeart className="w-5 h-5" />
                    <span className="text-sm">{likeCount}</span>
                  </button>
                  <button className="flex items-center space-x-2 p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <FiMessageSquare className="w-5 h-5" />
                    <span className="text-sm">24</span>
                  </button>
                  <button className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Share Section */}
            <div className="border-t border-border pt-8 mb-12">
              <h3 className="text-xl font-semibold mb-4">{t("blog.share")}</h3>
              <div className="flex items-center space-x-4">
                <button className="p-3 rounded-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors">
                  <FiFacebook className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 transition-colors">
                  <FiTwitter className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors">
                  <FiLinkedin className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <FiBookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-border pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {t("blog.comments")} (24)
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {t("blog.sortBy")}:
                  </span>
                  <select className="bg-background border border-input rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-ring focus:border-ring">
                    <option>{t("blog.latest")}</option>
                    <option>{t("blog.popular")}</option>
                    <option>{t("blog.trending")}</option>
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                {/* Comment Form */}
                <div className="bg-card p-6 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        placeholder={t("blog.commentPlaceholder")}
                        className="w-full h-32 p-4 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      {t("blog.postComment")}
                    </button>
                  </div>
                </div>

                {/* Comment List */}
                <div className="space-y-6">
                  {/* Sample Comment */}
                  <div className="flex gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                      alt="User"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">Trần Văn B</h4>
                          <span className="text-xs text-muted-foreground">
                            2 giờ trước
                          </span>
                        </div>
                        <button className="text-sm text-muted-foreground hover:text-foreground">
                          {t("blog.replies")}
                        </button>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        Bài viết rất hay và hữu ích! Tôi đã có thêm nhiều thông
                        tin mới về các địa điểm du lịch tại Việt Nam.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <button className="flex items-center space-x-1 hover:text-foreground">
                          <FiHeart className="w-4 h-4" />
                          <span>12</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-foreground">
                          <FiMessageSquare className="w-4 h-4" />
                          <span>3</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Fixed Position */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {/* Author Info */}
              <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                      alt={blogPost.author}
                      className="w-16 h-16 rounded-full ring-2 ring-primary/20"
                    />
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{blogPost.author}</h4>
                    <p className="text-sm text-muted-foreground">
                      Travel Writer
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Chuyên gia du lịch với hơn 5 năm kinh nghiệm khám phá và viết
                  về các điểm đến tại Việt Nam.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="font-semibold">128</div>
                    <div className="text-sm text-muted-foreground">
                      {t("blog.articles")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">2.4k</div>
                    <div className="text-sm text-muted-foreground">
                      {t("blog.followers")}
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center space-x-2">
                  <FiUser className="w-4 h-4" />
                  <span>{t("blog.followAuthor")}</span>
                </button>
              </div>

              {/* Table of Contents */}
              <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    {t("blog.tableOfContents")}
                  </h3>
                  <span className="text-sm text-muted-foreground">5 mục</span>
                </div>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#vịnh-hạ-long"
                      className="text-muted-foreground hover:text-foreground block py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Vịnh Hạ Long
                    </a>
                  </li>
                  <li>
                    <a
                      href="#phố-cổ-hội-an"
                      className="text-muted-foreground hover:text-foreground block py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Phố cổ Hội An
                    </a>
                  </li>
                  <li>
                    <a
                      href="#sa-pa"
                      className="text-muted-foreground hover:text-foreground block py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Sa Pa
                    </a>
                  </li>
                  <li>
                    <a
                      href="#huế"
                      className="text-muted-foreground hover:text-foreground block py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Huế
                    </a>
                  </li>
                  <li>
                    <a
                      href="#đà-lạt"
                      className="text-muted-foreground hover:text-foreground block py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Đà Lạt
                    </a>
                  </li>
                </ul>
              </div>

              {/* Related Posts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    {t("blog.relatedPosts")}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    3 {t("blog.articles")}
                  </span>
                </div>
                <div className="space-y-4">
                  {relatedPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-card rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      <div className="relative">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium">
                          {post.readTime} {t("blog.readTime")}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                            {t(`blog.categories.${post.category}`)}
                          </span>
                        </div>
                        <h4 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <FiUser className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiCalendar className="w-4 h-4" />
                            <span>
                              {new Date(post.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
