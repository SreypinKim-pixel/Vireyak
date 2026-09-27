import Icon from "../Icon";

/**
 * Statistics for the Cambodia section. Values arrive already calculated from
 * live API responses (see lib/camTripApi.js), so nothing here is hardcoded.
 */
export default function CambodiaStats({ stats }) {
  if (!Array.isArray(stats) || stats.length === 0) return null;
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="rounded-xl border border-slate/15 bg-panel p-5 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
        >
          <dt className="flex items-start gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-ink/50">
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

/**
 * Province and place counts per API region, with a proportional bar. The bar
 * only appears when the whole catalogue could be read.
 */
export function RegionBreakdown({ regions, descriptions = {} }) {
  if (!Array.isArray(regions) || regions.length === 0) return null;
  const highest = Math.max(...regions.map((region) => region.placeCount), 0);
  const showBars = highest > 0;

  return (
    <div className="h-full rounded-xl border border-slate/15 bg-panel p-6">
      <h3 className="text-sm font-semibold text-navy dark:text-ivory">
        Regions at a glance
      </h3>
      <p className="mt-2 text-[11px] leading-6 text-ink/55">
        Province counts come from{" "}
        <code className="text-[10px]">/api/provinces</code>
        {showBars ? (
          <>
            ; place counts come from{" "}
            <code className="text-[10px]">/api/attractions</code>
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
              <p className="text-[10px] text-ink/55">
                {region.provinceCount}{" "}
                {region.provinceCount === 1 ? "province" : "provinces"}
                {region.placeCount > 0 ? ` · ${region.placeCount} places` : ""}
              </p>
            </div>
            {descriptions[region.region] ? (
              <p className="mt-1 text-[10px] leading-5 text-ink/50">
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
