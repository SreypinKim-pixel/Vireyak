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
    photos[attractionPhotos[`${provinceKey(province)}/${normalize(name)}`]];
  if (curated) return curated;
  for (const url of remoteUrls) {
    const photo = apiPhoto(url, `${name}, ${province}`);
    if (photo) return photo;
  }

  return null;
}
