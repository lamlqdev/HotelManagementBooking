import { FaStar, FaThumbsUp } from "react-icons/fa";

interface ReviewStats {
  overall: number;
  total: number;
  distribution: {
    stars: number;
    count: number;
  }[];
}

interface ReviewUser {
  name: string;
  avatar: string;
  country: string;
}

interface Review {
  id: number;
  user: ReviewUser;
  rating: number;
  date: string;
  title: string;
  comment: string;
  stay: string;
  likes: number;
  photos: string[];
}

interface HotelReviewsProps {
  reviewStats: ReviewStats;
  reviews: Review[];
}

const HotelReviews = ({ reviewStats, reviews }: HotelReviewsProps) => {
  return (
    <section id="đánh giá">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Đánh giá từ khách hàng
      </h2>
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
                {reviewStats.total} đánh giá
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
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-foreground">
                      {review.user.name}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {review.user.country}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(review.date).toLocaleDateString("vi-VN")}
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
                <p className="text-muted-foreground mb-3">{review.comment}</p>
                <div className="text-sm text-muted-foreground mb-4">
                  {review.stay}
                </div>
              </div>

              {review.photos.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <FaThumbsUp />
                  <span>Hữu ích ({review.likes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelReviews;
