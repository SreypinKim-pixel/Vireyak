import type { Place, PlaceCardData } from "../../lib/camTripApi";
import Link from "next/link";
import Icon from "../Icon";
import { placesSection } from "../../data/about";
import PlaceCard from "./PlaceCard";

/**
 * Explore Cambodia grid. Handles every API outcome:
 * ready (cards), empty (helpful empty state) and error (static fallback cards
 * plus an explanation), so the page never breaks when the API is unreachable.
 */
export default function PlacesSection({
  places,
  fallbackPlaces = [],
  totalPlaces = 0,
  status = "ready",
}: {
  places?: Place[];
  fallbackPlaces?: PlaceCardData[];
  totalPlaces?: number;
  status?: "ready" | "empty" | "error";
}) {
  const livePlaces = Array.isArray(places) ? places : [];
  const isError = status === "error";
  const isEmpty = status === "empty";
  const cards = isError ? fallbackPlaces : livePlaces;

  return (
    <section id="explore-cambodia" className="shell scroll-mt-8 py-14 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">{placesSection.eyebrow}</p>
          <h2 className="section-title">{placesSection.title}</h2>
          <p className="mt-4 text-xs leading-7 text-ink/60">
            {placesSection.description}
          </p>
          {status === "ready" && totalPlaces > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px]">
              <span className="rounded-full bg-gold/10 px-3 py-1.5 font-medium text-ink/70">
                {totalPlaces.toLocaleString("en-US")} places in the live
                catalogue
              </span>
              <span className="rounded-full bg-slate/10 px-3 py-1.5 text-ink/60">
                Showing {cards.length} featured picks
              </span>
            </div>
          ) : null}
        </div>
        <Link
          href={placesSection.cta.href}
          className="flex items-center gap-2 text-[11px] font-medium text-indigo dark:text-brightgold"
        >
          {placesSection.cta.label} <Icon name="arrow" size={16} />
        </Link>
      </div>

      {isError ? (
        <div className="mt-9 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/10 p-5">
          <Icon name="shield" size={18} className="mt-0.5 shrink-0 text-gold" />
          <div>
            <p className="text-xs font-semibold text-navy dark:text-ivory">
              {placesSection.errorTitle}
            </p>
            <p className="mt-2 text-[11px] leading-6 text-ink/65">
              {placesSection.errorCopy}
            </p>
          </div>
        </div>
      ) : null}

      {isEmpty ? (
        <div className="mt-9 rounded-xl border border-dashed border-slate/30 bg-panel px-6 py-14 text-center">
          <Icon name="search" size={30} className="mx-auto mb-4 text-slate" />
          <h3 className="text-base font-medium text-navy dark:text-ivory">
            {placesSection.emptyTitle}
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-6 text-ink/60">
            {placesSection.emptyCopy}
          </p>
          <Link href={placesSection.cta.href} className="button-primary mt-6">
            {placesSection.cta.label}
          </Link>
        </div>
      ) : (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}

      {status === "ready" ? (
        <p className="mt-6 text-[10px] leading-5 text-ink/45">
          {placesSection.footnote}
        </p>
      ) : null}
    </section>
  );
}
