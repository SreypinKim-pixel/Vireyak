"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Dropdown from "@/components/Dropdown";
import type { TravelItem } from "@/lib/travel-types";

type Place = TravelItem & {
  numericId: number;
  province?: { id: string; name: string };
};
type SortKey = "id" | "name" | "province" | "type" | "price" | "rating";
const columns: { key: SortKey; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Place" },
  { key: "province", label: "Province" },
  { key: "type", label: "Type" },
  { key: "price", label: "Price (USD / person)" },
  { key: "rating", label: "Rating" },
];

export function PlacesTableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading places"
      className="rounded-xl border border-slate/40 bg-panel p-5"
    >
      <span className="sr-only">Loading places…</span>
      <div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
        <div className="h-11 rounded bg-slate/20" />
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="grid grid-cols-3 gap-5 sm:grid-cols-6">
            {Array.from({ length: 6 }, (_, col) => (
              <div
                key={col}
                className={`h-6 rounded bg-slate/15 ${col > 2 ? "hidden sm:block" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function isPlace(value: unknown): value is Place {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Place>;
  return (
    typeof item.id === "string" &&
    typeof item.numericId === "number" &&
    Number.isSafeInteger(item.numericId) &&
    item.numericId > 0 &&
    typeof item.name === "string" &&
    typeof item.type === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.rating === "string" &&
    Number.isFinite(Number(item.rating)) &&
    (item.province == null ||
      (typeof item.province.id === "string" &&
        typeof item.province.name === "string"))
  );
}

export default function PlacesTable() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; ascending: boolean }>({
    key: "name",
    ascending: true,
  });
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/attractions", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Places unavailable");
        const payload = await response.json();
        if (!Array.isArray(payload.data) || !payload.data.every(isPlace))
          throw new Error("Invalid places");
        setPlaces(payload.data);
        setState("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setState("error");
      });
    return () => controller.abort();
  }, [attempt]);
  const provinceOptions = [
    ...new Set(
      places
        .map((item) => item.province?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  ].sort();
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = places.filter(
      (item) =>
        (!province || item.province?.name === province) &&
        [
          item.name,
          String(item.numericId),
          item.province?.name || "",
          item.type,
        ].some((value) => value.toLowerCase().includes(query)),
    );
    return result.sort((a, b) => {
      const value = (item: Place) =>
        sort.key === "id"
          ? item.numericId
          : sort.key === "province"
            ? item.province?.name || ""
            : sort.key === "rating"
              ? Number(item.rating)
              : item[sort.key];
      const left = value(a),
        right = value(b);
      const comparison =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right), "en", { numeric: true });
      return (
        (sort.ascending ? comparison : -comparison) || a.id.localeCompare(b.id)
      );
    });
  }, [places, search, province, sort]);
  if (state === "loading") return <PlacesTableSkeleton />;
  if (state === "error")
    return (
      <div className="rounded-xl border border-slate/40 bg-panel p-6">
        <p role="alert">Places could not be loaded. Please try again.</p>
        <button
          className="button-primary mt-4"
          onClick={() => {
            setState("loading");
            setAttempt((value) => value + 1);
          }}
        >
          Retry
        </button>
      </div>
    );
  return (
    <div>
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="field-label">Search places</span>
          <input
            type="search"
            className="field"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Place, province, type, or ID"
          />
        </label>
        <div>
          <span className="field-label">Province</span>
          <Dropdown
            label="Filter by province"
            value={province}
            onChange={setProvince}
            options={[
              { value: "", label: "All provinces" },
              ...provinceOptions.map((name) => ({ value: name, label: name })),
            ]}
          />
        </div>
      </div>
      <p role="status" className="mb-4 text-sm text-ink/60">
        {rows.length} places · Sorted by{" "}
        {columns.find((column) => column.key === sort.key)?.label},{" "}
        {sort.ascending ? "ascending" : "descending"}
      </p>
      <div
        className="overflow-x-auto rounded-xl border border-slate/40 bg-panel"
        tabIndex={0}
        role="region"
        aria-label="Places table"
      >
        <table className="w-full min-w-[850px] text-left text-sm">
          <caption className="sr-only">
            Cambodia places. Select a column heading to change sorting.
          </caption>
          <thead className="bg-slate/10">
            <tr>
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  aria-sort={
                    sort.key === key
                      ? sort.ascending
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="px-4 py-3"
                >
                  <button
                    className="min-h-11 whitespace-nowrap rounded font-semibold focus-visible:outline-gold"
                    onClick={() =>
                      setSort({
                        key,
                        ascending: sort.key === key ? !sort.ascending : true,
                      })
                    }
                  >
                    {label}{" "}
                    <span aria-hidden="true">
                      {sort.key === key ? (sort.ascending ? "↑" : "↓") : "↕"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate/20 hover:bg-slate/5"
              >
                <td className="px-4 py-4 text-xs text-ink/60">
                  {item.numericId}
                </td>
                <th scope="row" className="px-4 py-4 font-medium">
                  <Link
                    className="underline decoration-gold underline-offset-4"
                    href={`/attraction/${encodeURIComponent(item.id)}`}
                  >
                    {item.name}
                  </Link>
                </th>
                <td className="px-4 py-4">
                  {item.province?.name || "Not specified"}
                </td>
                <td className="px-4 py-4">{item.type}</td>
                <td className="px-4 py-4 tabular-nums">
                  {item.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td className="px-4 py-4 tabular-nums">{item.rating} / 10</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <p className="p-8 text-center text-ink/60">
            No places found. Try another search or province.
          </p>
        )}
      </div>
    </div>
  );
}
