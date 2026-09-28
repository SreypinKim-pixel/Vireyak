import type { CatalogueStat, RegionSummary } from "../../lib/camTripApi";
import Icon from "../Icon";

export default function CambodiaStats({
  stats = [],
}: {
  stats?: CatalogueStat[];
}) {
  if (!Array.isArray(stats) || stats.length === 0) return null;
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="rounded-xl border border-slate/60 dark:border-slate/15 bg-panel p-5 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-soft motion-reduce:transition-none motion-reduce:transform-none"
        >
          <dt className="flex items-start gap-2 text-xs font-medium uppercase tracking-[0.12em] text-ink/50">
            <Icon name={stat.icon} size={14} className="mt-0.5 text-gold" />
            {stat.label}
          </dt>
          <dd className="mt-3 text-3xl font-semibold tracking-tight text-navy dark:text-ivory">
            {stat.value.toLocaleString("en-US")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function RegionBreakdown({
  regions = [],
  descriptions = {},
}: {
  regions?: RegionSummary[];
  descriptions?: Record<string, string>;
}) {
  if (!Array.isArray(regions) || regions.length === 0) return null;
  const highest = Math.max(...regions.map((region) => region.placeCount), 0);
  const showBars = highest > 0;

  return (
    <div className="h-full rounded-xl border border-slate/60 dark:border-slate/15 bg-panel p-6">
      <h3 className="text-sm font-semibold text-navy dark:text-ivory">
        Regions at a glance
      </h3>
      <p className="mt-2 text-xs leading-6 text-ink/55">
        Province counts come from{" "}
        <code className="text-xs">/api/provinces</code>
        {showBars ? (
          <>
            ; place counts come from{" "}
            <code className="text-xs">/api/attractions</code>
          </>
        ) : null}
        .
      </p>
      <ul className="mt-5 space-y-5">
        {regions.map((region) => (
          <li key={region.region}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-semibold text-navy dark:text-ivory">
                {region.label}
              </p>
              <p className="text-xs text-ink/55">
                {region.provinceCount}{" "}
                {region.provinceCount === 1 ? "province" : "provinces"}
                {region.placeCount > 0 ? ` · ${region.placeCount} places` : ""}
              </p>
            </div>
            {descriptions[region.region] ? (
              <p className="mt-1 text-xs leading-5 text-ink/50">
                {descriptions[region.region]}
              </p>
            ) : null}
            {showBars ? (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo to-gold"
                  style={{
                    width:
                      region.placeCount === 0
                        ? "0%"
                        : `${Math.max(6, Math.round((region.placeCount / highest) * 100))}%`,
                  }}
                />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
