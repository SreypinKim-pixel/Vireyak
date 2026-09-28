import type { MetadataRoute } from "next";
import { attractions, stays } from "@/data/travel";
import { provinces } from "@/lib/provinces";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/table",
    "/stays",
    "/attraction",
    ...stays.map((item) => `/stays/${encodeURIComponent(item.id)}`),
    ...attractions.map((item) => `/attraction/${encodeURIComponent(item.id)}`),
    ...provinces.map((item) => `/provinces/${item.id}/attractions`),
  ];
  return paths.map((path) => ({ url: new URL(path, siteUrl).href }));
}
