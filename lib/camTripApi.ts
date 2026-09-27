import { isVisibleAttraction } from "./attraction-visibility";
/**
 * CamTrip public API client.
 *
 * Server-side only: the public API (https://cam-trip.cheat.casa) does not send
 * CORS headers, so every request is made from a React Server Component and
 * cached with the Next.js fetch cache (revalidated every 30 minutes).
 *
 * Documented endpoints used here, from
 * https://cam-trip.cheat.casa/swagger-ui/index.html:
 *   GET /api/provinces    -> ProvinceResponse[]
 *   GET /api/attractions  -> PageResponseAttractionResponse
 *                            { content: AttractionResponse[], page, size, totalPages, totalElements }
 *
 * Only properties defined by the API documentation are read. When a documented
 * field is empty in practice (for example the often-empty `imageUrls`), the UI
 * falls back to another real API field (`province.imageUrl`) or to local
 * content — never to invented data.
 */
import { cache } from "react";

/** Province regions exactly as defined by the API `region` enum. */
export type RegionKey =
  "NORTHWEST" | "NORTHEAST" | "CENTRAL" | "COASTAL" | "SOUTHWEST";

/** Attraction categories exactly as defined by the API `category` enum. */
export type CategoryKey =
  | "TEMPLE"
  | "NATURE"
  | "BEACH"
  | "WATERFALL"
  | "HISTORICAL"
  | "MUSEUM"
  | "MARKET"
  | "OTHER";

/** A province, as read from `GET /api/provinces`. */
export interface Province {
  id: number;
  nameEn: string;
  nameKh: string | null;
  region: string;
  regionLabel: string;
  imageUrl: string | null;
}

/**
 * The subset of a place every card needs. Both API catalogue entries and the
 * local preview content shown when the API is unreachable satisfy this shape.
 */
export interface PlaceCardData {
  id: number | string;
  nameEn: string;
  nameKh: string | null;
  description: string | null;
  categoryLabel: string;
  provinceName: string | null;
  regionLabel: string | null;
  rating: number | null;
  image: string | null;
  imageIsProvincePhoto: boolean;
  mapsUrl: string | null;
  featured: boolean;
  /** Shown instead of a rating by preview cards; API places have none. */
  note?: string;
}

/** A catalogued attraction, as read from `GET /api/attractions`. */
export interface Place extends PlaceCardData {
  id: number;
  category: string;
  provinceNameKh: string | null;
  region: string | null;
}

/** One live figure for the hero and the Cambodia section. */
export interface CatalogueStat {
  key: string;
  label: string;
  value: number;
  icon: string;
}

/** Province and place counts for one API region. */
export interface RegionSummary {
  region: string;
  label: string;
  provinceCount: number;
  placeCount: number;
  share: number;
}

/** Everything the About page sections read from the API, in one object. */
export interface Catalogue {
  provinces: Province[];
  places: Place[];
  featuredPlaces: Place[];
  stats: CatalogueStat[];
  regions: RegionSummary[];
  totalPlaces: number;
  catalogueComplete: boolean;
  live: { provinces: boolean; places: boolean };
  ok: { provinces: boolean; places: boolean };
}

/** Query options for one page of `GET /api/attractions`. */
export interface AttractionQuery {
  page?: number;
  size?: number;
  category?: string;
  province?: number;
  sort?: string;
}

/** Base URL of the public CamTrip API. Override with CAMTRIP_API_BASE_URL. */
export const CAMTRIP_API_BASE_URL = (
  process.env.CAMTRIP_API_BASE_URL?.trim() || "https://cam-trip.cheat.casa"
).replace(/\/+$/, "");

/** How long API responses and the About page stay cached, in seconds. */
export const CAMTRIP_REVALIDATE_SECONDS = 1800;

const REQUEST_TIMEOUT_MS = 8000;
const PAGE_SIZE = 100;
const MAX_RECORDS = 400;
const FEATURED_PLACE_COUNT = 6;

/** Province regions exactly as defined by the API `region` enum. */
export const REGION_LABELS: Record<string, string> = Object.freeze({
  NORTHWEST: "Northwest",
  NORTHEAST: "Northeast",
  CENTRAL: "Central",
  COASTAL: "Coastal",
  SOUTHWEST: "Southwest",
});

/** Attraction categories exactly as defined by the API `category` enum. */
export const CATEGORY_LABELS: Record<string, string> = Object.freeze({
  TEMPLE: "Temple",
  NATURE: "Nature",
  BEACH: "Beach",
  WATERFALL: "Waterfall",
  HISTORICAL: "Historical",
  MUSEUM: "Museum",
  MARKET: "Market",
  OTHER: "Other",
});

/** Narrows an API value to trimmed text, or null when it is not usable. */
function asText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/** Narrows an API value to a finite number, or null. */
function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Narrows an API value to an array, or an empty array. */
function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** Narrows an API value to a JSON object, or an empty object. */
function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

/** Keeps the non-null results of a mapper, with the type narrowed. */
function isPresent<T>(value: T | null): value is T {
  return value !== null;
}

/**
 * Performs a GET request against the documented API and returns parsed JSON.
 */
async function apiGet(
  path: string,
  params: Record<string, string | number | undefined | null> = {},
): Promise<unknown> {
  const url = new URL(`${CAMTRIP_API_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  let response;
  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: CAMTRIP_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Error(
      `CamTrip API unreachable: GET ${path} (${
        error instanceof Error ? error.message : "network error"
      })`,
    );
  }
  if (!response.ok) {
    throw new Error(`CamTrip API error: GET ${path} (HTTP ${response.status})`);
  }
  return response.json();
}

/** Reads one page of documented attraction data. */
async function fetchAttractionPage(options: AttractionQuery = {}) {
  const { page = 0, size = PAGE_SIZE, ...rest } = options;
  const data = asObject(
    await apiGet("/api/attractions", { page, size, ...rest }),
  );
  return {
    content: asArray(data.content),
    totalElements: asNumber(data.totalElements) ?? 0,
    totalPages: Math.max(1, asNumber(data.totalPages) ?? 1),
  };
}

/** Reads every province documented by `GET /api/provinces`. */
async function fetchProvinces(): Promise<unknown[]> {
  return asArray(await apiGet("/api/provinces"));
}

/**
 * Walks the paged attraction endpoint until the whole catalogue is read, so
 * derived figures are exact rather than sampled. Stops early at MAX_RECORDS.
 */
async function fetchAllAttractions() {
  const records = [];
  let totalElements = 0;
  let page = 0;
  let totalPages = 1;

  while (page < totalPages && records.length < MAX_RECORDS) {
    const result = await fetchAttractionPage({ page, size: PAGE_SIZE });
    if (page === 0) totalElements = result.totalElements;
    totalPages = result.totalPages;
    if (result.content.length === 0) break;
    records.push(...result.content);
    page += 1;
  }

  return {
    records,
    totalElements: totalElements || records.length,
    complete: records.length >= totalElements,
  };
}

/**
 * Maps a documented ProvinceResponse onto the shape the UI needs.
 */
function toProvince(input: unknown): Province | null {
  const raw = asObject(input);
  const id = asNumber(raw.id);
  const nameEn = asText(raw.nameEn);
  if (id === null || !nameEn) return null;
  const region = asText(raw.region) || "CENTRAL";
  return {
    id,
    nameEn,
    nameKh: asText(raw.nameKh),
    region,
    regionLabel: REGION_LABELS[region] || "Cambodia",
    imageUrl: asText(raw.imageUrl),
  };
}

/**
 * Maps a documented AttractionResponse onto the shape the UI needs. The card
 * image prefers the documented `imageUrls` entry and otherwise uses the parent
 * province's documented `imageUrl`, so every card can still show a real
 * Cambodian photograph.
 */
function toPlace(input: unknown): Place | null {
  const raw = asObject(input);
  const id = asNumber(raw.id);
  const nameEn = asText(raw.nameEn);
  if (id === null || !nameEn || !isVisibleAttraction(id)) return null;

  const province = raw.province ? toProvince(raw.province) : null;
  const category = asText(raw.category) || "OTHER";
  const ownImage =
    asArray(raw.imageUrls)
      .map(asText)
      .find((value): value is string => Boolean(value)) ?? null;
  const image = ownImage || province?.imageUrl || null;
  const latitude = asNumber(raw.latitude);
  const longitude = asNumber(raw.longitude);
  const hasCoordinates = latitude !== null && longitude !== null;

  return {
    id,
    nameEn,
    nameKh: asText(raw.nameKh),
    description: asText(raw.descriptionEn) || asText(raw.descriptionKh),
    category,
    categoryLabel: CATEGORY_LABELS[category] || "Place",
    provinceName: province?.nameEn || null,
    provinceNameKh: province?.nameKh || null,
    region: province?.region || null,
    regionLabel: province?.regionLabel || null,
    rating: asNumber(raw.rating),
    image,
    imageIsProvincePhoto: !ownImage && Boolean(province?.imageUrl),
    mapsUrl: hasCoordinates
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : null,
    featured: raw.featured === true,
  };
}

/**
 * Chooses featured places in a stable, province-varied order so the grid looks
 * intentional on every rebuild. Falls back to the whole catalogue when nothing
 * is flagged as featured.
 */
function selectFeaturedPlaces(
  places: Place[],
  limit = FEATURED_PLACE_COUNT,
): Place[] {
  if (places.length === 0) return [];
  const featured = places.filter((place) => place.featured);
  const pool = (featured.length > 0 ? featured : places)
    .slice()
    .sort(
      (a, b) =>
        Number(b.imageIsProvincePhoto === false) -
          Number(a.imageIsProvincePhoto === false) || a.id - b.id,
    );

  const chosen: Place[] = [];
  const seenProvinces = new Set<string>();
  for (const place of pool) {
    if (chosen.length >= limit) break;
    const key = place.provinceName || `place-${place.id}`;
    if (seenProvinces.has(key)) continue;
    seenProvinces.add(key);
    chosen.push(place);
  }
  for (const place of pool) {
    if (chosen.length >= limit) break;
    if (!chosen.includes(place)) chosen.push(place);
  }
  return chosen;
}

/** The distinct, non-empty strings of a list, in first-seen order. */
function unique(values: (string | null | undefined)[]): string[] {
  const found = new Set<string>();
  for (const value of values) {
    if (value) found.add(value);
  }
  return [...found];
}

/**
 * Builds only the figures the API responses actually support. Counts that need
 * the complete catalogue are omitted when the scan could not finish.
 */
function buildStats({
  provinces,
  places,
  totalPlaces,
  complete,
}: {
  provinces: Province[];
  places: Place[];
  totalPlaces: number;
  complete: boolean;
}): CatalogueStat[] {
  const stats: CatalogueStat[] = [];
  if (provinces.length > 0) {
    stats.push({
      key: "provinces",
      label: "Provinces in the catalogue",
      value: provinces.length,
      icon: "pin",
    });
  }
  if (totalPlaces > 0) {
    stats.push({
      key: "places",
      label: "Places and attractions",
      value: totalPlaces,
      icon: "temple",
    });
  }
  const regions = unique(provinces.map((province) => province.region));
  if (regions.length > 0) {
    stats.push({
      key: "regions",
      label: "Regions covered",
      value: regions.length,
      icon: "globe",
    });
  }
  if (complete) {
    const categories = unique(places.map((place) => place.category));
    if (categories.length > 0) {
      stats.push({
        key: "categories",
        label: "Place categories",
        value: categories.length,
        icon: "leaf",
      });
    }
  }
  return stats;
}

/**
 * Groups provinces into the API regions and counts the catalogued places in
 * each one. Place counts are only reported when the whole catalogue was read.
 */
function buildRegionSummaries(
  provinces: Province[],
  places: Place[],
  complete: boolean,
): RegionSummary[] {
  const placeCounts = new Map<string, number>();
  for (const place of places) {
    if (!place.region) continue;
    placeCounts.set(place.region, (placeCounts.get(place.region) || 0) + 1);
  }
  const provinceCounts = new Map<string, number>();
  for (const province of provinces) {
    provinceCounts.set(
      province.region,
      (provinceCounts.get(province.region) || 0) + 1,
    );
  }
  const regionKeys = unique([...provinceCounts.keys(), ...placeCounts.keys()]);
  const totalPlaces = complete
    ? places.length
    : [...provinceCounts.keys()].reduce(
        (sum, key) => sum + (placeCounts.get(key) || 0),
        0,
      );

  return regionKeys
    .map((region) => {
      const placeCount = placeCounts.get(region) || 0;
      return {
        region,
        label: REGION_LABELS[region] || "Cambodia",
        provinceCount: provinceCounts.get(region) || 0,
        placeCount: complete ? placeCount : 0,
        share: complete && totalPlaces > 0 ? placeCount / totalPlaces : 0,
      };
    })
    .sort(
      (a, b) =>
        b.placeCount - a.placeCount ||
        b.provinceCount - a.provinceCount ||
        a.label.localeCompare(b.label),
    );
}

/**
 * Single entry point for the About page. Never throws: each endpoint resolves
 * independently, and the page falls back to static content when one is down.
 * Wrapped in React `cache` so several sections share one set of requests.
 */
export const loadCambodiaCatalogue = cache(async (): Promise<Catalogue> => {
  const [provinceResult, attractionResult] = await Promise.allSettled([
    fetchProvinces(),
    fetchAllAttractions(),
  ]);

  const provinces: Province[] =
    provinceResult.status === "fulfilled"
      ? provinceResult.value.map(toProvince).filter(isPresent)
      : [];
  const scan =
    attractionResult.status === "fulfilled"
      ? attractionResult.value
      : { records: [], totalElements: 0, complete: false };
  const places = scan.records.map(toPlace).filter(isPresent);
  const totalPlaces = scan.totalElements || places.length;
  const complete = scan.complete && scan.records.length > 0;

  return {
    provinces,
    places,
    featuredPlaces: selectFeaturedPlaces(places),
    stats: buildStats({ provinces, places, totalPlaces, complete }),
    regions: buildRegionSummaries(provinces, places, complete),
    totalPlaces,
    catalogueComplete: complete,
    live: { provinces: provinces.length > 0, places: places.length > 0 },
    // Request success, so the UI can tell "empty" apart from "unreachable".
    ok: {
      provinces: provinceResult.status === "fulfilled",
      places: attractionResult.status === "fulfilled",
    },
  };
});
