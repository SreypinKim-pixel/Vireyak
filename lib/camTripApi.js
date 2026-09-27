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
 *
 * @typedef {"NORTHWEST"|"NORTHEAST"|"CENTRAL"|"COASTAL"|"SOUTHWEST"} RegionKey
 * @typedef {"TEMPLE"|"NATURE"|"BEACH"|"WATERFALL"|"HISTORICAL"|"MUSEUM"|"MARKET"|"OTHER"} CategoryKey
 *
 * @typedef {Object} Province
 * @property {number} id
 * @property {string} nameEn
 * @property {string|null} nameKh
 * @property {string} region
 * @property {string} regionLabel
 * @property {string|null} imageUrl
 *
 * @typedef {Object} Place
 * @property {number} id
 * @property {string} nameEn
 * @property {string|null} nameKh
 * @property {string|null} description
 * @property {string} category
 * @property {string} categoryLabel
 * @property {string|null} provinceName
 * @property {string|null} provinceNameKh
 * @property {string|null} regionLabel
 * @property {number|null} rating
 * @property {string|null} image
 * @property {boolean} imageIsProvincePhoto
 * @property {string|null} mapsUrl
 * @property {boolean} featured
 *
 * @typedef {Object} CatalogueStat
 * @property {string} key
 * @property {string} label
 * @property {number} value
 * @property {string} icon
 *
 * @typedef {Object} RegionSummary
 * @property {string} region
 * @property {string} label
 * @property {number} provinceCount
 * @property {number} placeCount
 * @property {number} share
 */
import { cache } from "react";

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
export const REGION_LABELS = Object.freeze({
  NORTHWEST: "Northwest",
  NORTHEAST: "Northeast",
  CENTRAL: "Central",
  COASTAL: "Coastal",
  SOUTHWEST: "Southwest",
});

/** Attraction categories exactly as defined by the API `category` enum. */
export const CATEGORY_LABELS = Object.freeze({
  TEMPLE: "Temple",
  NATURE: "Nature",
  BEACH: "Beach",
  WATERFALL: "Waterfall",
  HISTORICAL: "Historical",
  MUSEUM: "Museum",
  MARKET: "Market",
  OTHER: "Other",
});

/** @param {unknown} value */
function asText(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/** @param {unknown} value */
function asNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Performs a GET request against the documented API and returns parsed JSON.
 * @param {string} path
 * @param {Record<string, string|number|undefined|null>} [params]
 */
async function apiGet(path, params = {}) {
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
      `CamTrip API unreachable: GET ${path} (${error?.message || "network error"})`,
    );
  }
  if (!response.ok) {
    throw new Error(`CamTrip API error: GET ${path} (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Reads one page of documented attraction data.
 * @param {{ page?: number, size?: number, category?: string, province?: number, sort?: string }} [options]
 */
async function fetchAttractionPage(options = {}) {
  const { page = 0, size = PAGE_SIZE, ...rest } = options;
  const data = await apiGet("/api/attractions", { page, size, ...rest });
  return {
    content: asArray(data?.content),
    totalElements: asNumber(data?.totalElements) ?? 0,
    totalPages: Math.max(1, asNumber(data?.totalPages) ?? 1),
  };
}

/** Reads every province documented by `GET /api/provinces`. */
async function fetchProvinces() {
  const data = await apiGet("/api/provinces");
  return asArray(data);
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
 * @param {any} raw
 * @returns {Province|null}
 */
function toProvince(raw) {
  const id = asNumber(raw?.id);
  const nameEn = asText(raw?.nameEn);
  if (id === null || !nameEn) return null;
  const region = asText(raw?.region) || "CENTRAL";
  return {
    id,
    nameEn,
    nameKh: asText(raw?.nameKh),
    region,
    regionLabel: REGION_LABELS[region] || "Cambodia",
    imageUrl: asText(raw?.imageUrl),
  };
}

/**
 * Maps a documented AttractionResponse onto the shape the UI needs. The card
 * image prefers the documented `imageUrls` entry and otherwise uses the parent
 * province's documented `imageUrl`, so every card can still show a real
 * Cambodian photograph.
 * @param {any} raw
 * @returns {Place|null}
 */
function toPlace(raw) {
  const id = asNumber(raw?.id);
  const nameEn = asText(raw?.nameEn);
  if (id === null || !nameEn) return null;

  const province = raw?.province ? toProvince(raw.province) : null;
  const category = asText(raw?.category) || "OTHER";
  const ownImage =
    asArray(raw?.imageUrls).map(asText).filter(Boolean)[0] || null;
  const image = ownImage || province?.imageUrl || null;
  const latitude = asNumber(raw?.latitude);
  const longitude = asNumber(raw?.longitude);
  const hasCoordinates = latitude !== null && longitude !== null;

  return {
    id,
    nameEn,
    nameKh: asText(raw?.nameKh),
    description: asText(raw?.descriptionEn) || asText(raw?.descriptionKh),
    category,
    categoryLabel: CATEGORY_LABELS[category] || "Place",
    provinceName: province?.nameEn || null,
    provinceNameKh: province?.nameKh || null,
    region: province?.region || null,
    regionLabel: province?.regionLabel || null,
    rating: asNumber(raw?.rating),
    image,
    imageIsProvincePhoto: !ownImage && Boolean(province?.imageUrl),
    mapsUrl: hasCoordinates
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : null,
    featured: raw?.featured === true,
  };
}

/**
 * Chooses featured places in a stable, province-varied order so the grid looks
 * intentional on every rebuild. Falls back to the whole catalogue when nothing
 * is flagged as featured.
 * @param {Place[]} places
 * @param {number} [limit]
 */
function selectFeaturedPlaces(places, limit = FEATURED_PLACE_COUNT) {
  if (places.length === 0) return [];
  const featured = places.filter((place) => place.featured);
  const pool = (featured.length > 0 ? featured : places)
    .slice()
    .sort(
      (a, b) =>
        Number(b.imageIsProvincePhoto === false) -
          Number(a.imageIsProvincePhoto === false) || a.id - b.id,
    );

  const chosen = [];
  const seenProvinces = new Set();
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

/** @param {(string|null|undefined)[]} values */
function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

/**
 * Builds only the figures the API responses actually support. Counts that need
 * the complete catalogue are omitted when the scan could not finish.
 * @param {{ provinces: Province[], places: Place[], totalPlaces: number, complete: boolean }} input
 * @returns {CatalogueStat[]}
 */
function buildStats({ provinces, places, totalPlaces, complete }) {
  const stats = [];
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
 * @param {Province[]} provinces
 * @param {Place[]} places
 * @param {boolean} complete
 * @returns {RegionSummary[]}
 */
function buildRegionSummaries(provinces, places, complete) {
  const placeCounts = new Map();
  for (const place of places) {
    if (!place.region) continue;
    placeCounts.set(place.region, (placeCounts.get(place.region) || 0) + 1);
  }
  const provinceCounts = new Map();
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
export const loadCambodiaCatalogue = cache(async () => {
  const [provinceResult, attractionResult] = await Promise.allSettled([
    fetchProvinces(),
    fetchAllAttractions(),
  ]);

  const provinces =
    provinceResult.status === "fulfilled"
      ? provinceResult.value.map(toProvince).filter(Boolean)
      : [];
  const scan =
    attractionResult.status === "fulfilled"
      ? attractionResult.value
      : { records: [], totalElements: 0, complete: false };
  const places = scan.records.map(toPlace).filter(Boolean);
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
