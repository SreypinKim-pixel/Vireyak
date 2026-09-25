import { MapPin } from "lucide-react";
import StarRating from "./StarRating";
import type { Review } from "./reviews";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-ink/10 bg-surface p-6 shadow-sm transition-shadow duration-300 hover:shadow-soft sm:p-7">
      <div className="flex items-center gap-3.5">
        <img
          src={review.avatar}
          alt=""
          width={52}
          height={52}
          loading="lazy"
          decoding="async"
          className="h-[52px] w-[52px] shrink-0 rounded-full border border-ink/5 object-cover"
        />
        <div>
          <h3 className="text-sm font-semibold text-ink">{review.name}</h3>
          <p className="mt-1 text-xs text-ink/55">{review.date}</p>
        </div>
      </div>
      <div className="mt-5">
        <StarRating rating={review.rating} />
      </div>
      <p className="mt-4 flex items-start gap-1.5 text-xs font-semibold leading-5 text-indigo dark:text-brightgold">
        <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        {review.destination}
      </p>
      <blockquote className="mt-3 text-sm leading-7 text-ink/70">
        &ldquo;{review.review}&rdquo;
      </blockquote>
    </article>
  );
}
