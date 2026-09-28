import type { Province } from "../../lib/camTripApi";

type RegionGroup = { region: string; label: string; items: Province[] };

export default function ProvinceChips({
  provinces = [],
}: {
  provinces?: Province[];
}) {
  if (!Array.isArray(provinces) || provinces.length === 0) return null;

  const groups: RegionGroup[] = [];
  for (const province of provinces) {
    let group = groups.find((entry) => entry.region === province.region);
    if (!group) {
      group = {
        region: province.region,
        label: province.regionLabel,
        items: [],
      };
      groups.push(group);
    }
    group.items.push(province);
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {groups.map((group) => (
        <div key={group.region}>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">
            <span className="h-1 w-4 rounded-full bg-gold" />
            {group.label}
            <span className="font-normal normal-case tracking-normal text-ink/40">
              {group.items.length}
            </span>
          </p>
          <ul className="space-y-2">
            {group.items.map((province) => (
              <li
                key={province.id}
                className="rounded-lg border border-slate/60 dark:border-slate/15 bg-panel px-3 py-2 transition duration-500 ease-out hover:border-gold dark:hover:border-gold/40 motion-reduce:transition-none"
              >
                <p className="text-xs font-medium text-navy dark:text-ivory">
                  {province.nameEn}
                </p>
                {province.nameKh ? (
                  <p
                    lang="km"
                    className="text-khmer mt-0.5 text-xs text-ink/50"
                  >
                    {province.nameKh}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
