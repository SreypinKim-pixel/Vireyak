import type { MetadataRoute } from "next";
import { attractions, stays } from "@/data/travel";
import { provinces } from "@/lib/provinces";
import { API_BASE_URL } from "@/lib/api-config";
import { siteUrl } from "@/lib/seo";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let apiPaths: string[] = [];
  try {
    const response = await fetch(`${API_BASE_URL}/provinces`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Province catalogue unavailable");
    const records: unknown = await response.json();
    if (!Array.isArray(records)) throw new Error("Invalid province catalogue");
    apiPaths = records.flatMap((record) =>
      record && (typeof record.id === "number" || typeof record.id === "string")
        ? [`/provinces/${encodeURIComponent(record.id)}`]
        : [],
    );
  } catch {
    // Keep local pages discoverable during an upstream outage.
  }
  const paths = [
    ...apiPaths,
    "/",
    "/about",
    "/table",
    "/stays",
    "/attraction",
    ...stays.map((item) => `/stays/${encodeURIComponent(item.id)}`),
    ...attractions.map((item) => `/attraction/${encodeURIComponent(item.id)}`),
    ...provinces.map((item) => `/provinces/${item.id}/attractions`),
  ];
  return [...new Set(paths)].map((path) => ({
    url: new URL(path, siteUrl).href,
  }));
}
