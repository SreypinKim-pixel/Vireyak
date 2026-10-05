import { provinceNames } from "@/data/province-names";

/**
 * Best-known numeric IDs on the teacher CamTrip API for the provinces it
 * currently serves. Banteay Meanchey, Kampong Cham, Kratie, Preah Vihear and
 * Stung Treng are not published by the teacher API yet, so they have no entry
 * here; picking one shows a friendly notice instead of a misleading record.
 */
export const PROVINCE_API_IDS: Record<string, number> = {
  Battambang: 2,
  "Kampong Chhnang": 15,
  "Kampong Speu": 16,
  "Kampong Thom": 14,
  Kampot: 22,
  Kandal: 17,
  Kep: 24,
  "Koh Kong": 25,
  Mondulkiri: 9,
  "Oddar Meanchey": 5,
  Pailin: 4,
  "Phnom Penh": 11,
  "Preah Sihanouk": 23,
  "Prey Veng": 19,
  Pursat: 18,
  Ratanakiri: 8,
  "Siem Reap": 1,
  "Svay Rieng": 20,
  Takeo: 21,
  "Tboung Khmum": 13,
};

export function provinceSlug(name: string) {
  return name.toLowerCase().replaceAll(" ", "-");
}

export function provinceNameFromSlug(slug: string): string | undefined {
  return provinceNames.find((name) => provinceSlug(name) === slug);
}

export interface ProvinceOption {
  value: string;
  label: string;
}

export const provinceLookupOptions: ProvinceOption[] = [
  { value: "", label: "Choose a province" },
  ...provinceNames.map((name) => ({
    value: provinceSlug(name),
    label: name,
  })),
];

/**
 * Curated attraction summary per province, mirroring the local catalogue in
 * `data/travel.ts`. Used to complement the teacher CamTrip API (which returns
 * a null attraction count on its list endpoint) and to preview the five
 * provinces the teacher API does not publish yet.
 */
const PROVINCE_ATTRACTION_SUMMARY: Record<
  string,
  { count: number; types: string[] }
> = {
  "Banteay Meanchey": { count: 1, types: ["Culture"] },
  Battambang: { count: 1, types: ["Nature"] },
  "Kampong Cham": { count: 1, types: ["Culture"] },
  "Kampong Chhnang": { count: 1, types: ["Culture"] },
  "Kampong Speu": { count: 1, types: ["Nature"] },
  "Kampong Thom": { count: 1, types: ["Culture"] },
  Kampot: { count: 1, types: ["Nature"] },
  Kandal: { count: 1, types: ["Culture"] },
  Kep: { count: 1, types: ["Nature"] },
  "Koh Kong": { count: 1, types: ["Adventure"] },
  Kratie: { count: 1, types: ["Nature"] },
  Mondulkiri: { count: 1, types: ["Nature"] },
  "Oddar Meanchey": { count: 1, types: ["Culture"] },
  Pailin: { count: 1, types: ["Culture"] },
  "Phnom Penh": { count: 3, types: ["Culture"] },
  "Preah Sihanouk": { count: 1, types: ["Adventure"] },
  "Preah Vihear": { count: 2, types: ["Culture"] },
  "Prey Veng": { count: 1, types: ["Culture"] },
  Pursat: { count: 1, types: ["Culture"] },
  Ratanakiri: { count: 1, types: ["Nature"] },
  "Siem Reap": { count: 5, types: ["Culture", "Nature"] },
  "Stung Treng": { count: 1, types: ["Nature"] },
  "Svay Rieng": { count: 1, types: ["Culture"] },
  Takeo: { count: 1, types: ["Culture"] },
  "Tboung Khmum": { count: 1, types: ["Culture"] },
};

/** Regions for the provinces the teacher CamTrip API does not publish yet. */
const LOCAL_REGION: Record<string, string> = {
  "Banteay Meanchey": "NORTHWEST",
  "Kampong Cham": "CENTRAL",
  Kratie: "NORTHEAST",
  "Preah Vihear": "NORTHEAST",
  "Stung Treng": "NORTHEAST",
};

/** Khmer names for the provinces the teacher CamTrip API does not publish yet. */
const LOCAL_NAME_KH: Record<string, string> = {
  "Banteay Meanchey": "បន្ទាយមានជ័យ",
  "Kampong Cham": "កំពង់ចាម",
  Kratie: "ក្រចេះ",
  "Preah Vihear": "ព្រះវិហារ",
  "Stung Treng": "ស្ទឹងត្រែង",
};

export interface ProvinceCatalogEntry {
  name: string;
  apiId: number | null;
  region: string | null;
  nameKh: string | null;
  attractionCount: number;
  attractionTypes: string[];
}

export function provinceCatalogFor(name: string): ProvinceCatalogEntry {
  const summary = PROVINCE_ATTRACTION_SUMMARY[name] || {
    count: 0,
    types: [],
  };
  return {
    name,
    apiId: PROVINCE_API_IDS[name] ?? null,
    region: LOCAL_REGION[name] ?? null,
    nameKh: LOCAL_NAME_KH[name] ?? null,
    attractionCount: summary.count,
    attractionTypes: summary.types,
  };
}
