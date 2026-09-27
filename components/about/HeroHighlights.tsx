import type { CatalogueStat } from "../../lib/camTripApi";
import Icon from "../Icon";

/**
 * The hero's live figures, streamed in after the hero has painted. Renders
 * nothing when the API is unavailable, so the hero stays intact.
 */
export default function HeroHighlights({
  stats = [],
}: {
  stats?: CatalogueStat[];
}) {
  if (!Array.isArray(stats) || stats.length === 0) return null;
  const highlights = stats.slice(0, 4);
  return (
    <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-slate/50 dark:border-slate/20 pt-6 sm:grid-cols-4">
      {highlights.map((stat) => (
        <div key={stat.key}>
          <dd className="text-2xl font-semibold tracking-tight text-navy dark:text-ivory">
            {stat.value.toLocaleString("en-US")}
          </dd>
          <dt className="mt-1 flex items-start gap-1.5 text-[10px] leading-4 text-ink/55">
            <Icon name={stat.icon} size={13} className="mt-0.5 text-gold" />
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

/** Shared with the hero skeleton so the layout does not jump. */
export function HeroHighlightsPlaceholder() {
  return (
    <div className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-slate/50 dark:border-slate/20 pt-6 sm:grid-cols-4">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="space-y-2">
          <div className="h-7 w-14 animate-pulse rounded bg-slate/15" />
          <div className="h-3 w-20 animate-pulse rounded bg-slate/10" />
        </div>
      ))}
    </div>
  );
}
