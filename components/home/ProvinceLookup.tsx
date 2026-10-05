"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import DestinationImage from "./DestinationImage";
import Dropdown from "../Dropdown";
import { getProvincePhoto } from "@/lib/destination-images";
import { localProvinceImage } from "@/lib/province-images";
import { regions, type Province } from "@/lib/cam-trip";
import type { TravelItem } from "@/lib/travel-types";
import {
  provinceCatalogFor,
  provinceLookupOptions,
  provinceNameFromSlug,
  provinceSlug,
} from "@/lib/province-lookup";

type Status = "idle" | "loading" | "error" | "success";
type ProvinceSource = "live" | "catalog";
type AttractionsStatus = "idle" | "loading" | "ready" | "empty";

export default function ProvinceLookup() {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [province, setProvince] = useState<Province | null>(null);
  const [attractionTypes, setAttractionTypes] = useState<string[]>([]);
  const [source, setSource] = useState<ProvinceSource>("live");
  const [errorText, setErrorText] = useState("");
  const [attractions, setAttractions] = useState<TravelItem[]>([]);
  const [attractionsStatus, setAttractionsStatus] =
    useState<AttractionsStatus>("idle");
  const selectionRef = useRef(0);

  const selectedName = provinceNameFromSlug(selectedSlug);

  function applyCatalogPreview(name: string) {
    const entry = provinceCatalogFor(name);
    setProvince({
      id: provinceSlug(name),
      nameEn: entry.name,
      nameKh: entry.nameKh || "",
      region: entry.region || "",
      attractionCount: entry.attractionCount,
      imageUrl: null,
    });
    setAttractionTypes(entry.attractionTypes);
    setSource("catalog");
    setStatus("success");
  }

  async function loadAttractions(slug: string, selection: number) {
    setAttractionsStatus("loading");
    try {
      const response = await fetch(`/api/provinces/${slug}/attractions`);
      const payload = await response.json();
      if (selection !== selectionRef.current) return;
      const items = Array.isArray(payload?.data) ? payload.data : [];
      setAttractions(items);
      setAttractionsStatus(items.length ? "ready" : "empty");
    } catch {
      if (selection !== selectionRef.current) return;
      setAttractions([]);
      setAttractionsStatus("empty");
    }
  }

  async function handleProvinceChange(slug: string) {
    const name = provinceNameFromSlug(slug);
    const selection = ++selectionRef.current;
    setSelectedSlug(slug);
    setProvince(null);
    setErrorText("");
    setAttractionTypes([]);
    setAttractions([]);
    setAttractionsStatus("idle");

    if (!slug || !name) {
      setStatus("idle");
      return;
    }

    const entry = provinceCatalogFor(name);
    if (entry.apiId == null) {
      applyCatalogPreview(name);
      void loadAttractions(slug, selection);
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(`/api/provinces/${entry.apiId}`);
      if (selection !== selectionRef.current) return;
      if (!response.ok) {
        applyCatalogPreview(name);
        void loadAttractions(slug, selection);
        return;
      }
      const payload = await response.json();
      if (selection !== selectionRef.current) return;
      setAttractionTypes(entry.attractionTypes);
      setSource("live");
      setProvince({
        ...payload.data,
        attractionCount: payload.data.attractionCount ?? entry.attractionCount,
      });
      setStatus("success");
      void loadAttractions(slug, selection);
    } catch {
      if (selection !== selectionRef.current) return;
      applyCatalogPreview(name);
      void loadAttractions(slug, selection);
    }
  }

  const name = province?.nameEn || province?.nameKh;

  return (
    <section
      aria-labelledby="province-lookup-title"
      className="border-t border-slate/60 dark:border-slate/15 bg-panel py-12 sm:py-16"
    >
      <div className="shell">
        <SectionHeading
          id="province-lookup-title"
          eyebrow="Live API demo"
          title="Province Lookup"
          description="Pick any of Cambodia's 25 provinces to explore its photo, region, and attractions — live from the teacher CamTrip API where available."
        />

        <div className="mt-8 max-w-xl space-y-3">
          <div>
            <span className="field-label">Province Exploring</span>
            <Dropdown
              id="province-lookup-picker"
              label="Province Exploring"
              name="province"
              value={selectedSlug}
              onChange={handleProvinceChange}
              options={provinceLookupOptions}
              className="mt-2"
            />
          </div>
          <p className="text-xs leading-5 text-ink/55">
            Click the picker above, then choose a province name — the lookup
            runs automatically.
          </p>
        </div>

        {status === "loading" && selectedName && (
          <p
            data-testid="province-loading"
            role="status"
            className="mt-8 text-sm text-ink/60"
          >
            Loading {selectedName} from the CamTrip API…
          </p>
        )}

        {status === "error" && (
          <p
            data-testid="province-error"
            role="alert"
            className="mt-8 rounded-lg border border-red-600/40 bg-red-600/5 p-4 text-xs leading-6 text-red-600 dark:text-red-400"
          >
            {errorText}
          </p>
        )}

        {status === "success" && province && (
          <>
            <article
              data-testid="province-result"
              className="mt-8 overflow-hidden rounded-2xl border border-slate/60 dark:border-slate/20 bg-surface shadow-soft"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <DestinationImage
                  src={
                    getProvincePhoto(selectedName || "")?.src ||
                    localProvinceImage(province, province.imageUrl)
                  }
                  alt={`${name} province photo`}
                  width={800}
                  height={450}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-navy dark:text-ivory">
                  {name}
                </h3>
                {province.nameKh && (
                  <p className="mt-1 text-sm text-ink/60">{province.nameKh}</p>
                )}
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div>
                    <dt className="text-ink/50">Region</dt>
                    <dd className="mt-0.5 font-medium">
                      {regions[province.region] ||
                        province.region ||
                        "Cambodia"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink/50">Attractions</dt>
                    <dd className="mt-0.5 font-medium">
                      {province.attractionCount ?? "unavailable"}
                    </dd>
                  </div>
                </dl>
                {attractionTypes.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-ink/50 text-xs">Attraction types</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attractionTypes.map((type) => (
                        <span
                          key={type}
                          className="rounded-full border border-indigo/30 bg-indigo/5 px-3 py-1 text-xs font-medium text-indigo dark:border-brightgold/30 dark:bg-brightgold/10 dark:text-brightgold"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mt-4 text-xs leading-5 text-ink/55">
                  {source === "live" ? (
                    <>
                      Live data from the teacher CamTrip API —{" "}
                      <code className="break-all">
                        GET /api/provinces/{province.id}
                      </code>
                    </>
                  ) : (
                    "Curated preview from the Vireyak catalogue."
                  )}
                </p>
              </div>
            </article>
            {attractionsStatus === "ready" && attractions.length > 0 && (
              <section
                aria-labelledby="province-attractions-title"
                data-testid="province-attractions"
                className="mt-10"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h3
                    id="province-attractions-title"
                    className="section-title text-2xl"
                  >
                    Explore {name} attractions
                  </h3>
                  <Link
                    href={`/attraction?destination=${encodeURIComponent(selectedName || "")}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-indigo dark:text-ivory dark:hover:text-brightgold"
                  >
                    View on Attractions page
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {attractions.map((attraction) => (
                    <article
                      key={attraction.id}
                      className="flex h-full flex-col rounded-2xl border border-slate/60 dark:border-slate/20 bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-indigo/30 bg-indigo/5 px-3 py-1 text-xs font-medium text-indigo dark:border-brightgold/30 dark:bg-brightgold/10 dark:text-brightgold">
                          {attraction.type}
                        </span>
                        {attraction.duration && (
                          <span className="text-xs text-ink/50">
                            {attraction.duration}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/attraction/${attraction.id}`}
                        className="mt-3 text-sm font-semibold leading-5 text-navy hover:text-indigo dark:text-ivory dark:hover:text-brightgold"
                      >
                        {attraction.name}
                      </Link>
                      <p className="mb-4 mt-2 line-clamp-2 text-xs leading-5 text-ink/60">
                        {attraction.description}
                      </p>
                      <dl className="mt-auto flex items-end justify-between border-t border-slate/60 dark:border-slate/15 pt-3 text-xs">
                        <div>
                          <dt className="sr-only">Rating</dt>
                          <dd className="flex items-center gap-1.5">
                            <span className="rounded-t-md rounded-br-md bg-navy px-1.5 py-1 font-semibold text-white dark:bg-indigo">
                              {attraction.rating}
                            </span>
                            <span className="text-ink/50">
                              ({attraction.reviews} reviews)
                            </span>
                          </dd>
                        </div>
                        <div className="text-right">
                          <dt className="sr-only">Price</dt>
                          <dd>
                            <span className="text-ink/50">from </span>
                            <span className="text-base font-semibold text-navy dark:text-ivory">
                              ${attraction.price}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-ink/55">
                  Attraction cards are curated previews from the Vireyak
                  catalogue — the same ones listed on the Attractions page.
                </p>
              </section>
            )}
            {attractionsStatus === "loading" && (
              <p
                data-testid="province-attractions-loading"
                role="status"
                className="mt-6 text-sm text-ink/60"
              >
                Loading {name} attractions from the Vireyak catalogue…
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
