// Local province photography lives in public/images/ and is named after each
// province's English name, e.g. "Kampong Thom.png". The teacher CamTrip API
// sometimes returns a wrong or failing remote imageUrl (missing flags, broken
// Wikimedia links), so the name-matched local copy is preferred whenever one
// exists.
const LOCAL_PROVINCE_IMAGES: Record<string, string> = {
  "kampong cham": "/images/Kampong Cham.png",
  "kampong chhnang": "/images/Kampong Chhnang.png",
  "kampong speu": "/images/Kampong Speu.png",
  "kampong thom": "/images/Kampong Thom.png",
  kampot: "/images/Kampot.png",
  kandal: "/images/Kandal.png",
  kep: "/images/Kep.png",
  "koh kong": "/images/Koh Kong.png",
  kratie: "/images/Kratie.png",
  mondulkiri: "/images/Mondulkiri.png",
  "oddar meanchey": "/images/Oddar Meanchey.png",
  pailin: "/images/Pailin.png",
  "phnom penh": "/images/Phnom Penh.png",
  "preah sihanouk": "/images/Preah Sihanouk.png",
  "preah vihear": "/images/Preah Vihear.png",
  "prey veng": "/images/Prey Veng.png",
  pursat: "/images/Pursat.png",
  ratanakiri: "/images/Ratanakiri.png",
  "stung treng": "/images/Stung Treng.png",
  "svay rieng": "/images/Svay Rieng.png",
  takeo: "/images/Takeo.png",
  "tboung khmum": "/images/Tboung Khmum.png",
};

// Alternate English spellings used by some data sources.
const NAME_ALIASES: Record<string, string> = {
  "tbong khmum": "tboung khmum",
  sihanoukville: "preah sihanouk",
};

function normalizeName(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s+province$/, "")
    .replace(/^krong\s+/, "");
}

export function localProvinceImage(
  province: { nameEn?: string | null; nameKh?: string | null } | null | undefined,
  remoteUrl?: string | null,
): string | null {
  const normalized = normalizeName(province?.nameEn || province?.nameKh);
  const key = NAME_ALIASES[normalized] || normalized;
  return LOCAL_PROVINCE_IMAGES[key] || remoteUrl || null;
}
