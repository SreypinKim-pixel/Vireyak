import { isVisibleAttraction } from "./attraction-visibility";
import { API_BASE_URL } from "./api-config";
import { getAttractionPhoto } from "./destination-images";
export { CAMTRIP_API_BASE_URL } from "./api-config";

import { cache } from "react";

export type RegionKey =
  "NORTHWEST" | "NORTHEAST" | "CENTRAL" | "COASTAL" | "SOUTHWEST";

export type CategoryKey =
  | "TEMPLE"
  | "NATURE"
  | "BEACH"
  | "WATERFALL"
  | "HISTORICAL"
  | "MUSEUM"
  | "MARKET"
  | "OTHER";

export interface Province {
  id: number;
  nameEn: string;
  nameKh: string | null;
  region: string;
  regionLabel: string;
  imageUrl: string | null;
}

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

  note?: string;
}

export interface Place extends PlaceCardData {
  id: number;
  category: string;
  provinceNameKh: string | null;
  region: string | null;
}

export interface CatalogueStat {
  key: string;
  label: string;
  value: number;
  icon: string;
}

export interface RegionSummary {
  region: string;
  label: string;
  provinceCount: number;
  placeCount: number;
  share: number;
}

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

export interface AttractionQuery {
  page?: number;
  size?: number;
  category?: string;
  province?: number;
  sort?: string;
}

export const CAMTRIP_REVALIDATE_SECONDS = 1800;

const REQUEST_TIMEOUT_MS = 8000;
const PAGE_SIZE = 100;
const MAX_RECORDS = 400;
const FEATURED_PLACE_COUNT = 6;

export const REGION_LABELS: Record<string, string> = Object.freeze({
  NORTHWEST: "Northwest",
  NORTHEAST: "Northeast",
  CENTRAL: "Central",
  COASTAL: "Coastal",
  SOUTHWEST: "Southwest",
});

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

function asText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function isPresent<T>(value: T | null): value is T {
  return value !== null;
}

async function apiGet(
  path: string,
  params: Record<string, string | number | undefined | null> = {},
): Promise<unknown> {
  const url = new URL(`${API_BASE_URL}${path}`);
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

async function fetchAttractionPage(options: AttractionQuery = {}) {
  const { page = 0, size = PAGE_SIZE, ...rest } = options;
  const data = asObject(
    await apiGet("/attractions", { page, size, ...rest }),
  );
  return {
    content: asArray(data.content),
    totalElements: asNumber(data.totalElements) ?? 0,
    totalPages: Math.max(1, asNumber(data.totalPages) ?? 1),
  };
}

async function fetchProvinces(): Promise<unknown[]> {
  return asArray(await apiGet("/provinces"));
}

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

function toPlace(input: unknown): Place | null {
  const raw = asObject(input);
  const id = asNumber(raw.id);
  const nameEn = asText(raw.nameEn);
  if (id === null || !nameEn || !isVisibleAttraction(id)) return null;

  const province = raw.province ? toProvince(raw.province) : null;
  const category = asText(raw.category) || "OTHER";
  const ownImage = getAttractionPhoto(
    nameEn,
    province?.nameEn || "",
    asArray(raw.imageUrls)
      .map(asText)
      .filter((value): value is string => Boolean(value)),
  )?.src;
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

function unique(values: (string | null | undefined)[]): string[] {
  const found = new Set<string>();
  for (const value of values) {
    if (value) found.add(value);
  }
  return [...found];
}

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

    ok: {
      provinces: provinceResult.status === "fulfilled",
      places: attractionResult.status === "fulfilled",
    },
  };
});
