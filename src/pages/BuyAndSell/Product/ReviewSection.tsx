import { Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const reviews = [
  {
    name: "Aman Sharma",
    rating: 5,
    comment: "Product was as described. Seller was polite and quick.",
    time: "2 days ago",
  },
  {
    name: "Priya Gupta",
    rating: 4,
    comment: "Good experience overall. Packaging could be better.",
    time: "1 week ago",
  },
  {
    name: "Ravi Mehta",
    rating: 3,
    comment: "Item was fine, but delivery was delayed.",
    time: "3 weeks ago",
  },
];

export default function ReviewSection() {
  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <section className="max-w-6xl mx-auto px-0 sm:px-6 mt-16">
      {/* Heading + avg rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">Customer Reviews</h2>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="flex items-center gap-1 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < Math.round(averageRating)
                    ? "fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
          </span>
        </div>
      </div>

      <Separator />

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm"
          >
            <div className="flex items-start gap-4 mb-2">
              <div className="bg-[#81d0c7]/20 p-2 rounded-full">
                <User className="text-[#81d0c7] w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-base font-semibold text-black">
                    {review.name}
                  </p>
                  <span className="text-xs text-gray-500">{review.time}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < review.rating ? "fill-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
