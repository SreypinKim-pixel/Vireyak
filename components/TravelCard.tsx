"use client";
import type { TravelItem, TravelKind } from "@/lib/travel-types";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import Icon from "./Icon";
const savedFallback = new Map<string, boolean>();
function readSaved(key: string) {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return savedFallback.get(key) ?? false;
  }
}
function subscribeSaved(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("vireyak-saved-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("vireyak-saved-change", onChange);
  };
}
export default function TravelCard({
  item,
  kind = "stays",
  query = "",
  onSavedChange,
}: {
  item: TravelItem;
  kind?: TravelKind;
  query?: string;
  onSavedChange?: (id: string, saved: boolean) => void;
}) {
  const key = `vireyak-saved-${kind}-${item.id}`;
  const saved = useSyncExternalStore(
    subscribeSaved,
    () => readSaved(key),
    () => false,
  );
  function toggle() {
    const next = !saved;
    try {
      localStorage.setItem(key, String(next));
    } catch {}
    savedFallback.set(key, next);
    window.dispatchEvent(new Event("vireyak-saved-change"));
    onSavedChange?.(item.id, next);
  }
  return (
    <article className="group overflow-hidden rounded-xl border border-slate/15 bg-panel transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[1.48] overflow-hidden">
        <Link
          href={`/${kind}/${item.id}${query ? `?${query}` : ""}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={item.image}
            alt=""
            width="600"
            height="405"
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>
        <span className="absolute left-3 top-3 rounded bg-ivory/95 px-2.5 py-1.5 text-[9px] font-medium text-navy">
          {item.badge}
        </span>
        <button
          onClick={toggle}
          type="button"
          aria-label={`${saved ? "Unsave" : "Save"} ${item.name}`}
          aria-pressed={saved}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-navy shadow-sm"
        >
          <Icon
            name="heart"
            size={16}
            className={saved ? "fill-gold stroke-gold" : ""}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-1 text-[9px] uppercase tracking-wider text-ink/50">
          <Icon name="pin" size={12} /> {item.destination}
          <span className="mx-1">·</span>
          {item.type}
        </div>
        <Link
          href={`/${kind}/${item.id}${query ? `?${query}` : ""}`}
          className="text-[14px] font-semibold tracking-tight text-navy hover:text-indigo dark:text-ivory"
        >
          {item.name}
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-t-md rounded-br-md bg-navy px-1.5 py-1 text-[10px] font-semibold text-white dark:bg-indigo">
            {item.rating}
          </span>
          <span className="text-[10px] font-medium">
            {kind === "stays" ? "Wonderful" : "Guest favorite"}
          </span>
          <span className="text-[9px] text-ink/45">
            ({item.reviews} sample reviews)
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-slate/15 pt-3">
          <span className="flex items-center gap-1 text-[9px] text-ink/55">
            <Icon name={kind === "stays" ? "check" : "clock"} size={12} />
            {kind === "stays" ? "A stay to remember" : item.duration}
          </span>
          <div className="text-right">
            <span className="text-[9px] text-ink/50">from </span>
            <span className="text-lg font-semibold text-navy dark:text-ivory">
              ${item.price}
            </span>
            <p className="text-[8px] text-ink/50">
              {kind === "stays" ? "per night" : "per person"} · sample price
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
