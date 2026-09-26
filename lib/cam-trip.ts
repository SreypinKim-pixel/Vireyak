import { localDestinationImage } from "./destination-images";

interface Province {
  id: string | number;
  nameEn: string;
  nameKh: string;
  region: string;
  attractionCount?: number;
  imageUrl?: string | null;
}
interface Attraction {
  id: string | number;
  nameEn: string;
  nameKh: string;
  province: Province;
  featured?: boolean;
  category?: string;
  descriptionEn?: string;
  descriptionKh?: string;
  imageUrls?: string[];
  rating: number | null;
  entryFee: number | null;
  openingHours?: string | null;
}
interface AttractionPage {
  content: Attraction[];
  totalPages: number;
  totalElements?: number;
}

export const API_BASE_URL = "https://cam-trip.cheat.casa/api";

export const API_ENDPOINTS = {
  provinces: {
    getAll: `${API_BASE_URL}/provinces`,
    getById: (id: string | number) =>
      `${API_BASE_URL}/provinces/${encodeURIComponent(id)}`,
  },
  attractions: {
    getAll: `${API_BASE_URL}/attractions`,
    getById: (id: string | number) =>
      `${API_BASE_URL}/attractions/${encodeURIComponent(id)}`,
  },
};

const regions: Record<string, string> = {
  NORTHWEST: "Northwest Cambodia",
  NORTHEAST: "Northeast Cambodia",
  CENTRAL: "Central Cambodia",
  COASTAL: "Coastal Cambodia",
};

export async function getFeaturedDestinations() {
  try {
    const response = await fetch(API_ENDPOINTS.provinces.getAll, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Provinces API: ${response.status}`);
    const provinces: Province[] = await response.json();
    if (!Array.isArray(provinces))
      throw new Error("Invalid provinces response");

    const destinations = await Promise.all(
      provinces
        .filter(
          (province) =>
            province?.id != null && (province.nameEn || province.nameKh),
        )
        .sort((a, b) => Number(a.id) - Number(b.id))
        .slice(0, 3)
        .map(async (province) => {
          const name = province.nameEn || province.nameKh;
          let highlights: string[] = [];
          let attractionCount = province.attractionCount;
          try {
            const highlightsResponse = await fetch(
              `${API_ENDPOINTS.provinces.getById(province.id)}/attractions?size=3`,
              { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) },
            );
            if (highlightsResponse.ok) {
              const data: AttractionPage = await highlightsResponse.json();
              highlights = (data.content || [])
                .map((item) => item.nameEn || item.nameKh)
                .filter(Boolean);
              attractionCount = data.totalElements ?? attractionCount;
            }
          } catch {
            /* Province information remains usable if highlights are unavailable. */
          }

          return {
            id: province.id,
            name,
            location: regions[province.region] || "Cambodia",
            category: "Province",
            description: highlights.length
              ? `${name} highlights include ${highlights.join(", ")}.`
              : `${name} is in ${regions[province.region] || "Cambodia"}.`,
            attractionCount,
            image: localDestinationImage(
              "province",
              province.id,
              province.imageUrl,
            ),
            href: `/stays?destination=${encodeURIComponent(name)}`,
          };
        }),
    );
    return { destinations, unavailable: false };
  } catch (error) {
    console.error("Unable to load featured destinations:", error);
    return { destinations: [], unavailable: true };
  }
}

// Both sections share one selection so their places never overlap.
export async function getHomepageAttractions() {
  try {
    const items: Attraction[] = [];
    for (let page = 0; ; page += 1) {
      const response = await fetch(
        `${API_ENDPOINTS.attractions.getAll}?size=100&page=${page}`,
        { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) },
      );
      if (!response.ok) throw new Error(`Attractions API: ${response.status}`);
      const data: AttractionPage = await response.json();
      if (!Array.isArray(data.content) || !Number.isInteger(data.totalPages))
        throw new Error("Invalid attractions response");
      items.push(...data.content);
      if (page + 1 >= data.totalPages) break;
    }
    const { destinations } = await getFeaturedDestinations();
    const usedProvinces = new Set(destinations.map((item) => String(item.id)));
    const usedIds = new Set();
    const selected = [];
    // Prefer featured attractions, then fill with other places from distinct provinces.
    const candidates = [...items].sort(
      (a, b) =>
        Number(Boolean(b?.featured)) - Number(Boolean(a?.featured)) ||
        Number(a.id) - Number(b.id),
    );
    for (const item of candidates) {
      if (!item?.id || !(item.nameEn || item.nameKh) || !item.province?.id)
        continue;
      const provinceId = String(item.province.id);
      if (usedProvinces.has(provinceId) || usedIds.has(String(item.id)))
        continue;
      usedProvinces.add(provinceId);
      usedIds.add(String(item.id));
      const name = item.nameEn || item.nameKh;
      const province = item.province.nameEn || item.province.nameKh;
      selected.push({
        id: item.id,
        name,
        province,
        category: (item.category || "Attraction")
          .toLowerCase()
          .replaceAll("_", " "),
        description:
          (item.descriptionEn !== "A notable Cambodian destination." &&
            item.descriptionEn) ||
          item.descriptionKh ||
          `${name} is a ${(item.category || "attraction").toLowerCase().replaceAll("_", " ")} in ${province}.`,
        image: localDestinationImage(
          "attraction",
          item.id,
          item.imageUrls?.find(
            (image: unknown) => typeof image === "string" && image,
          ) ||
            item.province.imageUrl ||
            null,
        ),
        rating: item.rating,
        entryFee: item.entryFee,
        openingHours: item.openingHours,
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${province}, Cambodia`)}`,
      });
      if (selected.length === 5) break;
    }
    return {
      experiences: selected.slice(0, 4),
      spotlight: selected[4] || null,
      unavailable: false,
    };
  } catch (error) {
    console.error("Unable to load homepage attractions:", error);
    return { experiences: [], spotlight: null, unavailable: true };
  }
}
