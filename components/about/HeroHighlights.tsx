import type { CatalogueStat } from "../../lib/camTripApi";
import Icon from "../Icon";

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
        <div key={stat.key} className="text-center">
          <dd className="text-2xl font-semibold tracking-tight text-navy dark:text-ivory">
            {stat.value.toLocaleString("en-US")}
          </dd>
          <dt className="mt-1 text-xs leading-5 text-ink/55">
            <Icon name={stat.icon} size={13} className="mr-1.5 inline-block align-middle text-gold" />
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

export function HeroHighlightsPlaceholder() {
  return (
    <div className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-slate/50 dark:border-slate/20 pt-6 sm:grid-cols-4">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <div className="h-7 w-14 animate-pulse rounded bg-slate/15" />
          <div className="h-3 w-20 animate-pulse rounded bg-slate/10" />
        </div>
      ))}
    </div>
  );
}
