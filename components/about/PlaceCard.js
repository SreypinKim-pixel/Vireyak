import Icon from "../Icon";

/**
 * Reusable card for one Cambodian place. Works for API catalogue entries and
 * for the local fallback destinations shown when the API is unreachable.
 *
 * Expected shape (see lib/camTripApi.js):
 * { id, nameEn, nameKh, description, categoryLabel, provinceName, regionLabel,
 *   rating, image, imageIsProvincePhoto, mapsUrl, featured }
 */
export default function PlaceCard({ place }) {
  const location = [place.provinceName, place.regionLabel]
    .filter(Boolean)
    .join(" · ");
  const imageAlt =
    place.imageIsProvincePhoto && place.provinceName
      ? `${place.provinceName} province, Cambodia`
      : `${place.nameEn}, Cambodia`;
  const hasRating = typeof place.rating === "number";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate/15 bg-panel transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[1.5] overflow-hidden bg-slate/10">
        {place.image ? (
          <img
            src={place.image}
            alt={imageAlt}
            width="600"
            height="400"
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-slate">
            <Icon name="temple" size={30} />
          </div>
        )}
        {place.categoryLabel ? (
          <span className="absolute left-3 top-3 rounded bg-ivory/95 px-2.5 py-1.5 text-[9px] font-medium text-navy">
            {place.categoryLabel}
          </span>
        ) : null}
        {place.featured ? (
          <span className="absolute right-3 top-3 rounded bg-navy/85 px-2.5 py-1.5 text-[9px] font-medium text-brightgold backdrop-blur">
            Featured
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-ink/50">
          <Icon name="pin" size={12} /> {location || "Cambodia"}
        </p>
        <h3 className="mt-2 text-[15px] font-semibold tracking-tight text-navy dark:text-ivory">
          {place.nameEn}
        </h3>
        {place.nameKh ? (
          <p lang="km" className="text-khmer mt-1 text-[11px] text-ink/50">
            {place.nameKh}
          </p>
        ) : null}
        {place.description ? (
          <p className="mt-3 line-clamp-3 text-[11px] leading-6 text-ink/60">
            {place.description}
          </p>
        ) : null}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate/15 pt-4">
          {hasRating ? (
            <span className="flex items-center gap-2">
              <span className="rounded-t-md rounded-br-md bg-navy px-1.5 py-1 text-[10px] font-semibold text-white dark:bg-indigo">
                {place.rating.toFixed(1)}
              </span>
              <span className="text-[9px] text-ink/45">API rating</span>
            </span>
          ) : (
            <span className="text-[9px] text-ink/45">
              {place.note || "Preview destination"}
            </span>
          )}
          {place.mapsUrl ? (
            <a
              href={place.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[10px] font-medium text-indigo hover:underline dark:text-brightgold"
            >
              Open in maps <Icon name="arrow" size={13} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
