import { FaStar, FaInfoCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { reviewApi } from "@/api/review/review.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { Review } from "@/types/review";
import Reviews from "@/assets/illustration/Reviews.svg";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { useMutation } from "@tanstack/react-query";

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
  rooms: { _id: string; roomName: string }[];
  onReviewCreated?: () => void;
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

const HotelReviews = ({
  reviewStats,
  reviews,
  rooms,
  onReviewCreated,
}: HotelReviewsProps) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const [roomId, setRoomId] = useState(rooms[0]?._id || "");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  const createReviewMutation = useMutation({
    mutationFn: (data: {
      roomId: string;
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

  const handleEdit = (review: Review) => {
    setEditReviewId(review._id);
    setRating(review.rating);
    setTitle(review.title);
    setComment(review.comment);
    setIsAnonymous(review.isAnonymous);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteReviewId) return;
    try {
      await reviewApi.deleteReview(deleteReviewId);
      toast.success("Đã xoá đánh giá!");
      setDeleteReviewId(null);
      if (onReviewCreated) onReviewCreated();
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message || "Xoá đánh giá thất bại");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !rating || !title || !comment) {
      toast.error("Vui lòng chọn phòng và điền đầy đủ thông tin đánh giá");
      return;
    }

    if (editReviewId) {
      updateReviewMutation.mutate(
        {
          id: editReviewId,
          data: { rating, title, comment, isAnonymous },
        },
        {
          onSuccess: () => {
            toast.success("Đã cập nhật đánh giá!");
            setRoomId(rooms[0]?._id || "");
            setRating(0);
            setTitle("");
            setComment("");
            setIsAnonymous(false);
            setShowForm(false);
            setEditReviewId(null);
            if (onReviewCreated) onReviewCreated();
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
    } else {
      createReviewMutation.mutate(
        { roomId, rating, title, comment, isAnonymous },
        {
          onSuccess: () => {
            toast.success("Đánh giá của bạn đã được gửi!");
            setRoomId(rooms[0]?._id || "");
            setRating(0);
            setTitle("");
            setComment("");
            setIsAnonymous(false);
            setShowForm(false);
            setEditReviewId(null);
            if (onReviewCreated) onReviewCreated();
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

  const handleCancel = () => {
    setShowForm(false);
    setRoomId(rooms[0]?._id || "");
    setRating(0);
    setTitle("");
    setComment("");
    setIsAnonymous(false);
    setEditReviewId(null);
  };

  const loading =
    createReviewMutation.isPending || updateReviewMutation.isPending;

  return (
    <section id="đánh giá">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {t("hotel.reviews.title")}
      </h2>
      {/* Nút mở form đánh giá */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="mb-6">
          {t("hotel.reviews.write_review") || "Viết đánh giá"}
        </Button>
      )}
      {/* Form đánh giá */}
      {(showForm || editReviewId) && (
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-lg shadow-md p-6 mb-8 space-y-4"
        >
          <div>
            <label className="block font-medium mb-1">Chọn phòng</label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn phòng" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room._id} value={room._id}>
                    {room.roomName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block font-medium mb-1">
              {t("hotel.reviews.rating")}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={
                    star <= rating
                      ? "text-yellow-400 text-2xl"
                      : "text-gray-300 text-2xl"
                  }
                  aria-label={`Chọn ${star} sao`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">
              {t("hotel.reviews.title_label") || "Tiêu đề"}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề đánh giá"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              {t("hotel.reviews.comment_label") || "Nội dung"}
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nội dung đánh giá"
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
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading
                ? t("hotel.reviews.sending") || "Đang gửi..."
                : t("hotel.reviews.send") || "Gửi đánh giá"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              {t("hotel.reviews.cancel") || "Huỷ"}
            </Button>
          </div>
        </form>
      )}
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
                      <img
                        src={`https://ui-avatars.com/api/?name=${
                          review.isAnonymous ? "Anonymous" : review.userId.name
                        }`}
                        alt={
                          review.isAnonymous
                            ? "Người dùng ẩn danh"
                            : review.userId.name
                        }
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-foreground">
                          {review.isAnonymous
                            ? "Người dùng ẩn danh"
                            : review.userId.name}
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          Việt Nam
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
                              disabled={loading}
                            >
                              Sửa
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setDeleteReviewId(review._id)}
                                  disabled={loading}
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
                                  <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={loading}
                                  >
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
