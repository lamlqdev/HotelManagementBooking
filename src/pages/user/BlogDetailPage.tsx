import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  FiCalendar,
  FiUser,
  FiArrowLeft,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiHeart,
  FiMessageSquare,
  FiShare2,
} from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api/post/post.api";
import { Skeleton } from "@/components/ui/skeleton";
import { PostInteraction } from "@/types/post";
import { useAppSelector } from "@/store/hooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const BlogDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [commentContent, setCommentContent] = useState("");

  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);

  // Lấy bài viết từ API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postApi.getPost(id!),
    enabled: !!id,
  });

  // Lấy danh sách tương tác của bài viết
  const { data: interactionsData } = useQuery({
    queryKey: ["post-interactions", id],
    queryFn: () => postApi.getPostInteractions(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (interactionsData?.data) {
      const interactions: PostInteraction[] = interactionsData.data;
      setLikeCount(interactions.filter((i) => i.type === "like").length);
      setCommentCount(interactions.filter((i) => i.type === "comment").length);
    }
  }, [interactionsData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const post = data?.data;

  // Mutation cho like bài viết
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      return postApi.addInteraction(id, { type: "like" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-interactions", id] });
      setIsLiked(true);
    },
  });

  // Mutation cho gửi bình luận
  const commentMutation = useMutation({
    mutationFn: async () => {
      if (!id || !commentContent.trim()) return;
      return postApi.addInteraction(id, {
        type: "comment",
        content: commentContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-interactions", id] });
      setCommentContent("");
    },
  });

  const handleLike = () => {
    if (!isLiked) {
      likeMutation.mutate();
    } else {
      // Nếu muốn unlike thì có thể gọi API xoá tương tác ở đây
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    }
  };

  const handlePostComment = () => {
    if (!commentContent.trim()) return;
    commentMutation.mutate();
  };

  const getPostUserName = (userId: string | { name?: string }) => {
    if (typeof userId === "object" && userId && "name" in userId) {
      return userId.name || "Ẩn danh";
    }
    return "Ẩn danh";
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("blog.share") + ": " + t("common.copied"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };
  const handleShareTwitter = () => {
    if (!post) return;
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        window.location.href
      )}&text=${encodeURIComponent(post.title)}`,
      "_blank"
    );
  };
  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto pt-32 pb-8">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-96 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-5/6 mb-2" />
        <Skeleton className="h-6 w-4/6 mb-2" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto pt-32 pb-8 text-center text-red-500">
        {t("common.error")}
      </div>
    );
  }

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
                {/* Category */}
              </div>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground space-x-6">
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    <span>{getPostUserName(post.userId)}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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
                    <span className="text-sm">{commentCount}</span>
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
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Section */}
            <div className="border-t border-border pt-8 mb-12">
              <h3 className="text-xl font-semibold mb-4">{t("blog.share")}</h3>
              <div className="flex items-center space-x-4">
                <button
                  className="p-3 rounded-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors"
                  onClick={handleShareFacebook}
                >
                  <FiFacebook className="w-5 h-5" />
                </button>
                <button
                  className="p-3 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 transition-colors"
                  onClick={handleShareTwitter}
                >
                  <FiTwitter className="w-5 h-5" />
                </button>
                <button
                  className="p-3 rounded-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors"
                  onClick={handleShareLinkedIn}
                >
                  <FiLinkedin className="w-5 h-5" />
                </button>
                <button
                  className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  onClick={handleShare}
                  title="Copy link"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-border pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {t("blog.comments")} ({commentCount})
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
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user?.avatar?.url || "/images/default-avatar.png"}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <textarea
                        placeholder={t("blog.commentPlaceholder")}
                        className="w-full h-32 p-4 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={handlePostComment}
                    >
                      {t("blog.postComment")}
                    </button>
                  </div>
                </div>

                {/* Comment List */}
                {interactionsData?.data &&
                interactionsData.data.filter((i) => i.type === "comment")
                  .length > 0 ? (
                  <div className="space-y-6">
                    {interactionsData.data
                      .filter((i) => i.type === "comment")
                      .map((comment) => (
                        <div
                          key={comment.id}
                          className="flex items-start space-x-4 bg-muted/40 p-4 rounded-lg"
                        >
                          <img
                            src="/images/default-avatar.png"
                            alt="User"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-semibold">
                              {getPostUserName(comment.userId)}
                            </div>
                            <div className="text-muted-foreground text-xs mb-1">
                              {new Date(comment.createdAt).toLocaleString()}
                            </div>
                            <div className="text-foreground">
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic text-center py-4">
                    {t("blog.noComments")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
