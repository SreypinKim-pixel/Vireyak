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
          className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 px-5 py-7 text-center"
        >
          <dt className="order-2 mt-3 max-w-[14rem] text-sm font-medium leading-6 text-white/75">
            <Icon
              name={stat.icon}
              size={14}
              className="mr-2 inline-block align-middle text-brightgold"
            />
            {stat.label}
          </dt>
          <dd className="order-1 text-5xl font-semibold tracking-tight text-white">
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
    <div className="h-full rounded-3xl border border-slate/25 bg-panel p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-navy dark:text-ivory">
        Regions at a glance
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-ink/60">
        Explore the landscapes and destinations that give each region its
        character.
      </p>
      <ul className="mt-7 grid gap-4 sm:grid-cols-2">
        {regions.map((region) => (
          <li
            key={region.region}
            className="flex flex-col rounded-2xl border border-slate/20 bg-surface p-5"
          >
            <div className="space-y-2">
              <p className="text-base font-semibold text-navy dark:text-ivory">
                {region.label}
              </p>
              <p className="text-xs text-ink/55">
                {region.provinceCount}{" "}
                {region.provinceCount === 1 ? "province" : "provinces"}
                {region.placeCount > 0 ? ` · ${region.placeCount} places` : ""}
              </p>
            </div>
            {descriptions[region.region] ? (
              <p className="mb-5 mt-3 flex-1 text-sm leading-7 text-ink/65">
                {descriptions[region.region]}
              </p>
            ) : null}
            {showBars ? (
              <div className="mt-auto h-1.5 w-full overflow-hidden rounded-full bg-slate/15">
                <div
                  className="h-full rounded-full bg-gold"
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
