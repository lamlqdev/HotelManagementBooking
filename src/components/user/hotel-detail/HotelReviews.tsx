import { FaStar, FaInfoCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { reviewApi } from "@/api/review/review.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Review } from "@/types/review";
import Reviews from "@/assets/illustration/Reviews.svg";
import { useAppSelector } from "@/store/hooks";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface ReviewStats {
  overall: number;
  total: number;
  distribution: {
    stars: number;
    count: number;
  }[];
}

interface HotelReviewsProps {
  reviewStats: ReviewStats;
  reviews: Review[];
  hotelId: string;
}

// Định nghĩa type cho error trả về từ backend
interface BackendError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Component Modal cho form đánh giá
interface ReviewFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hotelId: string;
  editReview?: Review | null;
  onSuccess: () => void;
}

const ReviewFormModal = ({
  isOpen,
  onOpenChange,
  hotelId,
  editReview,
  onSuccess,
}: ReviewFormModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(editReview?.rating || 0);
  const [title, setTitle] = useState(editReview?.title || "");
  const [comment, setComment] = useState(editReview?.comment || "");
  const [isAnonymous, setIsAnonymous] = useState(
    editReview?.isAnonymous || false
  );

  // Cập nhật form values khi editReview thay đổi
  useEffect(() => {
    if (editReview) {
      setRating(editReview.rating);
      setTitle(editReview.title);
      setComment(editReview.comment);
      setIsAnonymous(editReview.isAnonymous);
    } else {
      // Reset form khi tạo review mới
      setRating(0);
      setTitle("");
      setComment("");
      setIsAnonymous(false);
    }
  }, [editReview]);

  const createReviewMutation = useMutation({
    mutationFn: (data: {
      hotelId: string;
      rating: number;
      title: string;
      comment: string;
      isAnonymous: boolean;
    }) => reviewApi.createReview(data),
  });

  const updateReviewMutation = useMutation({
    mutationFn: (params: {
      id: string;
      data: {
        rating: number;
        title: string;
        comment: string;
        isAnonymous: boolean;
      };
    }) => reviewApi.updateReview(params.id, params.data),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !title || !comment) {
      toast.error("Vui lòng điền đầy đủ thông tin đánh giá");
      return;
    }

    if (editReview) {
      updateReviewMutation.mutate(
        {
          id: editReview._id,
          data: { rating, title, comment, isAnonymous },
        },
        {
          onSuccess: () => {
            toast.success("Đã cập nhật đánh giá!");
            resetForm();
            onOpenChange(false);

            // Invalidate các queries liên quan
            queryClient.invalidateQueries({ queryKey: ["reviews", hotelId] });
            queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
            queryClient.invalidateQueries({ queryKey: ["availableRooms"] });

            onSuccess();
          },
          onError: (err: unknown) => {
            const error = err as BackendError;
            const message =
              error?.response?.data?.message ||
              error?.message ||
              "Cập nhật đánh giá thất bại";
            toast.error(message);
          },
        }
      );
    } else {
      createReviewMutation.mutate(
        { hotelId, rating, title, comment, isAnonymous },
        {
          onSuccess: () => {
            toast.success("Đánh giá của bạn đã được gửi!");
            resetForm();
            onOpenChange(false);

            // Invalidate các queries liên quan
            queryClient.invalidateQueries({ queryKey: ["reviews", hotelId] });
            queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
            queryClient.invalidateQueries({ queryKey: ["availableRooms"] });

            onSuccess();
          },
          onError: (err: unknown) => {
            const error = err as BackendError;
            const message =
              error?.response?.data?.message ||
              error?.message ||
              "Gửi đánh giá thất bại";
            toast.error(message);
          },
        }
      );
    }
  };

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setComment("");
    setIsAnonymous(false);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const loading =
    createReviewMutation.isPending || updateReviewMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">
              {t("hotel.reviews.rating") || "Đánh giá"}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={
                    star <= rating
                      ? "text-yellow-400 text-2xl hover:text-yellow-500 transition-colors"
                      : "text-gray-300 text-2xl hover:text-gray-400 transition-colors"
                  }
                  aria-label={`Chọn ${star} sao`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">
              {t("hotel.reviews.title_label") || "Tiêu đề"}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề đánh giá"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              {t("hotel.reviews.comment_label") || "Nội dung"}
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nội dung đánh giá"
              rows={4}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(v) => setIsAnonymous(!!v)}
            />
            <label htmlFor="anonymous" className="text-sm cursor-pointer">
              {t("hotel.reviews.anonymous") || "Ẩn danh"}
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {t("hotel.reviews.cancel") || "Huỷ"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? t("hotel.reviews.sending") || "Đang gửi..."
                : editReview
                ? "Cập nhật"
                : t("hotel.reviews.send") || "Gửi đánh giá"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const HotelReviews = ({ reviewStats, reviews, hotelId }: HotelReviewsProps) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  const handleEdit = (review: Review) => {
    setEditReview(review);
    setIsReviewModalOpen(true);
  };

  const handleCreateReview = () => {
    setEditReview(null);
    setIsReviewModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteReviewId) return;
    try {
      await reviewApi.deleteReview(deleteReviewId);
      toast.success("Đã xoá đánh giá!");
      setDeleteReviewId(null);

      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: ["reviews", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["availableRooms"] });
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message || "Xoá đánh giá thất bại");
    }
  };

  const handleModalSuccess = () => {
    // Modal sẽ tự động đóng và invalidate queries
  };

  return (
    <section id="đánh giá">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {t("hotel.reviews.title")}
      </h2>

      {/* Nút mở modal đánh giá */}
      {user && (
        <Button onClick={handleCreateReview} className="mb-6">
          {t("hotel.reviews.write_review") || "Viết đánh giá"}
        </Button>
      )}

      {/* Modal form đánh giá */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        hotelId={hotelId}
        editReview={editReview}
        onSuccess={handleModalSuccess}
      />

      {/* Phần hiển thị đánh giá hoặc illustration */}
      {!reviews || reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <img src={Reviews} alt="No reviews" className="w-96 h-96 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t("hotel.reviews.no_reviews")}
          </h3>
          <p className="text-muted-foreground">
            {t("hotel.reviews.no_reviews_description")}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overall Rating Section */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0">
                <div className="text-5xl font-bold text-primary mb-2">
                  {reviewStats.overall}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: Math.floor(reviewStats.overall) }).map(
                    (_, index) => (
                      <FaStar key={index} className="text-yellow-400 text-xl" />
                    )
                  )}
                  {reviewStats.overall % 1 !== 0 && (
                    <FaStar className="text-yellow-400 opacity-50 text-xl" />
                  )}
                </div>
                <div className="text-muted-foreground">
                  {reviewStats.total} {t("hotel.reviews.total_reviews")}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {reviewStats.distribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm text-muted-foreground">
                        {item.stars}
                      </span>
                      <FaStar className="text-yellow-400 text-sm" />
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(item.count / reviewStats.total) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-sm text-muted-foreground">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-card rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            review.isAnonymous
                              ? "https://ui-avatars.com/api/?name=Anonymous"
                              : review.userId.avatar?.url ||
                                `https://ui-avatars.com/api/?name=${review.userId.name}`
                          }
                          alt={
                            review.isAnonymous
                              ? "Người dùng ẩn danh"
                              : review.userId.name
                          }
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex items-center">
                          <h4 className="font-medium text-foreground">
                            {review.isAnonymous
                              ? "Người dùng ẩn danh"
                              : review.userId.name}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex gap-2">
                      {user &&
                        review.userId &&
                        review.userId._id === user._id && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(review)}
                            >
                              Sửa
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setDeleteReviewId(review._id)}
                                >
                                  Xoá
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Bạn có chắc chắn muốn xoá đánh giá này?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Hành động này không thể hoàn tác. Đánh giá
                                    sẽ bị xoá vĩnh viễn.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    onClick={() => setDeleteReviewId(null)}
                                  >
                                    Huỷ
                                  </AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDelete}>
                                    Xoá
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <FaStar key={index} className="text-yellow-400" />
                      ))}
                    </div>
                    <h3 className="font-medium mb-2 text-foreground">
                      {review.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {review.comment}
                    </p>
                    <div className="text-sm text-muted-foreground mb-4">
                      {t("hotel.reviews.stayed")}
                    </div>
                  </div>

                  {review.response && (
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-2">
                        {t("hotel.reviews.hotel_response")}
                      </h4>
                      <p className="text-muted-foreground">{review.response}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <Alert>
                <FaInfoCircle className="h-4 w-4" />
                <AlertDescription>
                  {t("hotel.reviews.no_reviews_description")}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HotelReviews;
