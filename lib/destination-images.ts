import catalogue from "@/data/destination-photos.json";

export interface DestinationPhoto {
  src: string;
  alt: string;
  source: string;
  credit: string;
  license: string;
  licenseUrl: string;
  backupSrc?: string;
}

const photos: Record<string, DestinationPhoto> = catalogue.photos;
const provincePhotos: Record<string, string> = catalogue.provinces;
const attractionPhotos: Record<string, string> = catalogue.attractions;

// These landmarks can arrive with incorrect province metadata from the API.
const landmarkPhotos: Record<string, string> = {
  "banteay-chhmar-temple": "banteay-chhmar-jpg",
  "prasat-ta-muen-thom": "destinations-attraction-41-jpg",
  "preah-vihear-temple": "destinations-attraction-51-jpg",
};

function normalize(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function provinceKey(name: string) {
  const key = normalize(name);
  const aliases: Record<string, string> = {
    "tbong-khmum": "tboung-khmum",
    rattanakiri: "ratanakiri",
    "mondol-kiri": "mondulkiri",
    kracheh: "kratie",
    sihanoukville: "preah-sihanouk",
    "oddar-meancheay": "oddar-meanchey",
  };
  return aliases[key] || key;
}

function apiPhoto(
  src: string | null | undefined,
  alt: string,
): DestinationPhoto | null {
  if (!src || /flag|placeholder|no[-_]?image/i.test(src)) return null;
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return null;
    return {
      src,
      alt,
      source: src,
      credit: "Destination catalogue",
      license: "",
      licenseUrl: "",
    };
  } catch {
    return null;
  }
}

export function getProvincePhoto(name: string, remoteUrl?: string | null) {
  return photos[provincePhotos[provinceKey(name)]] || apiPhoto(remoteUrl, name);
}

export function getAttractionPhoto(
  name: string,
  province: string,
  remoteUrls: string[] = [],
): DestinationPhoto | null {
  const curated =
    photos[landmarkPhotos[normalize(name)]] ||
    photos[attractionPhotos[`${provinceKey(province)}/${normalize(name)}`]];
  if (curated) return curated;
  for (const url of remoteUrls) {
    const photo = apiPhoto(url, `${name}, ${province}`);
    if (photo) return photo;
  }

  return null;
}

// Local copies keyed by API record ID for attraction cards; content still comes
// from the API. Province cards must not use ID-based images because the file
// would not match the province name shown on the card — see lib/province-images.ts.
const localImages: Record<string, string> = {
  "attraction-22": "/images/destinations/attraction-22.jpg",
  "attraction-31": "/images/destinations/attraction-31.jpg",
  "attraction-41": "/images/destinations/attraction-41.jpg",
  "attraction-51": "/images/destinations/attraction-51.jpg",
  "attraction-61": "/images/destinations/attraction-61.jpg",
  "attraction-71": "/images/destinations/attraction-71.jpg",
};

export function localDestinationImage(
  kind: "province" | "attraction",
  id: string | number,
  remoteUrl?: string | null,
): string | null {
  return localImages[`${kind}-${id}`] || remoteUrl || null;
}
