import { Star } from "lucide-react";

export default function StarRating({ rating }: { rating: number }) {
  const score = Number.isFinite(rating)
    ? Math.min(5, Math.max(0, Math.round(rating)))
    : 0;
  return (
    <div
      role="img"
      aria-label={`${score} out of 5 stars`}
      className="flex gap-1"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          strokeWidth={1.7}
          fill={index < score ? "currentColor" : "none"}
          className="text-gold dark:text-brightgold"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
