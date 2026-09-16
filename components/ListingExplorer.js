"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import SearchForm from "./SearchForm";
import TravelCard from "./TravelCard";
import Icon from "./Icon";
import Dropdown from "./Dropdown";
export default function ListingExplorer({ items, kind, initial }) {
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [budget, setBudget] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const types = ["All", ...new Set(items.map((i) => i.type))];
  const destination =
    typeof initial.destination === "string" ? initial.destination : "";
  const query = new URLSearchParams(
    Object.entries(initial).filter(([, value]) => typeof value === "string"),
  ).toString();
  const guests = Math.max(1, Math.min(6, Number(initial.guests) || 2));
  const filtered = useMemo(() => {
    const result = items.filter(
      (i) =>
        (!destination || i.destination === destination) &&
        (type === "All" || i.type === type) &&
        (budget === "all" || i.price <= Number(budget)) &&
        (kind !== "stays" || i.capacity >= guests) &&
        (!savedOnly || savedIds.includes(i.id)),
    );
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating")
      result.sort((a, b) => Number(b.rating) - Number(a.rating));
    return result;
  }, [
    items,
    destination,
    type,
    budget,
    guests,
    kind,
    sort,
    savedOnly,
    savedIds,
  ]);
  function showSaved(checked) {
    setSavedOnly(checked);
    try {
      setSavedIds(
        items
          .filter(
            (i) =>
              localStorage.getItem(`vireyak-saved-${kind}-${i.id}`) === "true",
          )
          .map((i) => i.id),
      );
    } catch {
      setSavedIds([]);
    }
  }
  return (
    <>
      <section className="border-b border-slate/15 bg-slate/[0.045] pb-10 pt-10">
        <div className="shell">
          <p className="eyebrow">
            {kind === "stays"
              ? "Stay somewhere that stays with you"
              : "Go a little beyond the everyday"}
          </p>
          <h1 className="section-title mb-3 mt-4 text-3xl sm:text-4xl">
            {kind === "stays"
              ? "Your perfect escape awaits."
              : "Moments that become memories."}
          </h1>
          <p className="mb-7 text-xs leading-6 text-ink/60">
            {kind === "stays"
              ? "From city hideaways to barefoot island living. Find your place in Cambodia."
              : "Discover culture, find adventure, and see Cambodia from a new perspective."}
          </p>
          <SearchForm
            key={`${kind}-${JSON.stringify(initial)}`}
            compact
            initial={initial}
            mode={kind}
          />
        </div>
      </section>
      <section className="shell grid gap-8 py-10 lg:grid-cols-[215px_1fr]">
        <aside>
          <div className="rounded-xl border border-slate/20 bg-panel p-5">
            <h2 className="mb-5 text-sm font-semibold">
              Make it your kind of trip
            </h2>
            <fieldset>
              <legend className="mb-3 text-xs font-medium">
                {kind === "stays" ? "Stay style" : "Experience type"}
              </legend>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-3">
                {types.map((t) => (
                  <label
                    key={t}
                    className="flex cursor-pointer items-center gap-2 text-[11px] text-ink/65"
                  >
                    <input
                      className="accent-navy dark:accent-brightgold"
                      type="radio"
                      name="type"
                      value={t}
                      checked={type === t}
                      onChange={() => setType(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="my-5 h-px bg-slate/15" />
            <label className="field-label" htmlFor="budget">
              {kind === "stays" ? "Nightly budget" : "Budget per person"}
            </label>
            <Dropdown
              id="budget"
              label={kind === "stays" ? "Nightly budget" : "Budget per person"}
              value={budget}
              onChange={setBudget}
              options={[
                { value: "all", label: "Any budget" },
                ...(kind === "stays" ? [80, 120, 160] : [25, 35, 45]).map(
                  (p) => ({ value: String(p), label: `Up to $${p}` }),
                ),
              ]}
            />
            <div className="my-5 h-px bg-slate/15" />
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={savedOnly}
                onChange={(e) => showSaved(e.target.checked)}
                className="accent-navy dark:accent-brightgold"
              />
              My saved favorites
            </label>
            <button
              type="button"
              onClick={() => {
                setType("All");
                setBudget("all");
                setSort("recommended");
                setSavedOnly(false);
              }}
              className="mt-5 text-[11px] font-medium text-indigo underline underline-offset-4 dark:text-brightgold"
            >
              Reset filters
            </button>
          </div>
          <div className="mt-5 hidden rounded-xl bg-gold/10 p-5 lg:block">
            <Icon name="leaf" className="mb-3 text-gold" />
            <p className="text-xs font-semibold">A little more thoughtful.</p>
            <p className="mt-2 text-[11px] leading-6 text-ink/60">
              Travel slowly. Choose locally. Leave room for the unexpected.
            </p>
          </div>
        </aside>
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-navy dark:text-ivory">
                {destination || "Explore Cambodia"}
              </h2>
              <p aria-live="polite" className="mt-1 text-[11px] text-ink/55">
                {filtered.length} {kind === "stays" ? "stays" : "experiences"}{" "}
                to discover
                {kind === "stays"
                  ? ` · ${guests} ${guests === 1 ? "guest" : "guests"}`
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-ink/55">
              Sort by
              <Dropdown
                label="Sort results"
                value={sort}
                onChange={setSort}
                className="min-w-[175px]"
                options={[
                  { value: "recommended", label: "Our picks" },
                  { value: "price-low", label: "Price: low to high" },
                  { value: "price-high", label: "Price: high to low" },
                  { value: "rating", label: "Highest rated" },
                ]}
              />
            </div>
          </div>
          <p className="mb-5 rounded-lg bg-slate/5 px-4 py-3 text-[10px] leading-5 text-ink/60">
            A preview of what&apos;s possible. Listings, imagery, prices, and
            reviews are illustrative; dates do not check live availability.
          </p>
          {filtered.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <TravelCard
                  key={item.id}
                  item={item}
                  kind={kind}
                  query={query}
                  onSavedChange={(id, saved) =>
                    setSavedIds((ids) =>
                      saved
                        ? [...ids, id]
                        : ids.filter((value) => value !== id),
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate/30 px-6 py-16 text-center">
              <Icon
                name="search"
                size={32}
                className="mx-auto mb-4 text-slate"
              />
              <h3 className="text-lg font-medium">
                A different path might be perfect.
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-ink/60">
                Try another destination, a different budget, or fewer guests.
                Saved favorites appear after you tap a heart.
              </p>
              <Link href={`/${kind}`} className="button-primary mt-5">
                Explore all {kind === "stays" ? "stays" : "experiences"}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
