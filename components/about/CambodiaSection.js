import Icon from "../Icon";
import {
  cambodiaSection,
  countryFacts,
  regionDescriptions,
} from "../../data/about";
import CambodiaStats, { RegionBreakdown } from "./CambodiaStats";
import ProvinceChips from "./ProvinceChips";

/**
 * Cambodia information section. Statistics, the region breakdown, and the
 * province list are all rendered from live API responses passed in by the page.
 */
export default function CambodiaSection({
  provinces,
  stats,
  regions,
  live,
  reachable = true,
}) {
  const hasLiveFigures = Boolean(live?.provinces) || Boolean(live?.places);
  const hasStats = Array.isArray(stats) && stats.length > 0;
  const hasRegions = Array.isArray(regions) && regions.length > 0;

  return (
    <section
      id="cambodia"
      className="scroll-mt-8 border-y border-slate/15 bg-slate/[0.045] py-14 sm:py-16"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">{cambodiaSection.eyebrow}</p>
            <h2 className="section-title">{cambodiaSection.title}</h2>
            <p className="mt-4 text-xs leading-7 text-ink/60">
              {cambodiaSection.description}
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-2 text-[10px] font-medium text-ink/70">
            <Icon
              name={hasLiveFigures ? "globe" : "shield"}
              size={14}
              className="text-gold"
            />
            {hasLiveFigures
              ? "Live figures from the CamTrip API"
              : reachable
                ? "No catalogue entries to count yet"
                : "Live figures unavailable — reference content shown"}
          </span>
        </div>

        {hasStats ? (
          <div className="mt-10">
            <CambodiaStats stats={stats} />
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-slate/30 bg-panel p-6 text-xs leading-7 text-ink/60">
            {reachable
              ? "The catalogue returned no entries, so there are no figures to calculate yet. The rest of this section is reference information about Cambodia."
              : "The CamTrip API did not respond, so catalogue figures cannot be shown right now. Everything on this page still works — the rest of the section is reference information about Cambodia."}
          </p>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {hasRegions ? (
            <RegionBreakdown
              regions={regions}
              descriptions={regionDescriptions}
            />
          ) : null}
          <div className="h-full rounded-xl border border-slate/15 bg-panel p-6">
            <h3 className="text-sm font-semibold text-navy dark:text-ivory">
              {cambodiaSection.factsTitle}
            </h3>
            <p className="mt-2 text-[10px] text-ink/50">
              {cambodiaSection.factsNote}
            </p>
            <dl className="mt-5 divide-y divide-slate/15">
              {countryFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <dt className="text-[11px] text-ink/55">{fact.label}</dt>
                  <dd className="text-[11px] font-medium text-navy dark:text-ivory">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {Array.isArray(provinces) && provinces.length > 0 ? (
          <div className="mt-12">
            <h3 className="section-title text-lg">
              {cambodiaSection.provincesTitle}
            </h3>
            <p className="mt-3 text-[11px] leading-6 text-ink/55">
              Khmer and English names exactly as returned by{" "}
              <code className="text-[10px]">GET /api/provinces</code>.
            </p>
            <div className="mt-6">
              <ProvinceChips provinces={provinces} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
