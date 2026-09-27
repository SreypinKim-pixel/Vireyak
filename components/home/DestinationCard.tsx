import { ArrowRight, Star } from "lucide-react";
import DestinationImage from "./DestinationImage";

export interface Destination {
  id: number | string;
  name: string;
  province: string;
  category: string;
  description: string;
  image: string | null;
  rating: number | null;
  entryFee: number | null;
  openingHours?: string | null;
  href: string;
}

const accents = {
  purple: { background: "#EEE8F7", text: "#6D55A3", border: "#DED5EF" },
  blue: { background: "#E3F1F4", text: "#397B87", border: "#CFE4E8" },
  green: { background: "#E6F1E8", text: "#4E7D5A", border: "#D4E5D8" },
  orange: { background: "#F8EBDD", text: "#A56A35", border: "#EEDCC9" },
};

function categoryAccent(category: string) {
  switch (category.toLowerCase()) {
    case "waterfall":
    case "beach":
      return accents.blue;
    case "nature":
      return accents.green;
    case "historical":
    case "cultural":
    case "heritage":
    case "museum":
      return accents.orange;
    default:
      return accents.purple;
  }
}

export function RatingBadge({ rating }: { rating: number | null }) {
  if (rating == null || !Number.isFinite(rating)) return null;
  const score = Math.min(5, Math.max(0, rating));
  return (
    <span
      aria-label={`Rated ${score} out of 5`}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF5D9] px-2.5 py-1.5 text-navy"
    >
      <span aria-hidden="true" className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className="relative block h-3 w-3">
            <Star size={12} className="absolute text-[#F4B942]" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{
                width: `${Math.min(1, Math.max(0, score - index)) * 100}%`,
              }}
            >
              <Star size={12} className="fill-[#F4B942] text-[#F4B942]" />
            </span>
          </span>
        ))}
      </span>
      <strong className="text-xs font-semibold">{score.toFixed(1)}</strong>
    </span>
  );
}

export default function DestinationCard({
  destination,
}: {
  destination: Destination;
}) {
  const accent = categoryAccent(destination.category);
  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg motion-reduce:transition-none"
      style={{ borderColor: accent.border }}
    >
      <div className="aspect-[1.48] overflow-hidden">
        <DestinationImage
          src={destination.image}
          alt={destination.name}
          width={600}
          height={405}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-2 pt-4">
        <h3 className="text-lg font-bold leading-6 text-navy">
          {destination.name}
        </h3>
        <div className="mt-2 flex items-center">
          <p
            className="rounded-full px-2.5 py-1.5 text-[10px] font-semibold leading-4"
            style={{ backgroundColor: accent.background, color: accent.text }}
          >
            {destination.province} <span aria-hidden="true">·</span>{" "}
            <span className="uppercase">{destination.category}</span>
          </p>
        </div>
        <p className="mb-3 mt-2 line-clamp-2 text-sm leading-5 text-[#667085]">
          {destination.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[#E8E8E8] pt-3">
          <RatingBadge rating={destination.rating} />
          <span className="rounded-full bg-[#F7F7F5] px-2.5 py-1.5 text-[10px] font-medium text-[#555555]">
            {destination.entryFee == null
              ? "Entry fee not listed"
              : destination.entryFee === 0
                ? "Free entry"
                : `$${destination.entryFee} entry`}
          </span>
        </div>
        {destination.openingHours && (
          <p className="mt-3 text-xs font-medium text-[#667085]">
            Hours: {destination.openingHours}
          </p>
        )}
        <a
          href={destination.href}
          target="_blank"
          rel="noreferrer"
          className="group/map mt-1 inline-flex min-h-11 w-fit items-center gap-2 rounded text-sm font-semibold text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
        >
          View on map{" "}
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/map:translate-x-1 group-focus-visible/map:translate-x-1 motion-reduce:transform-none"
          />
        </a>
      </div>
    </article>
  );
}
