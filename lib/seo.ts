import type { Metadata } from "next";
import type { SearchParams, TravelItem, TravelKind } from "./travel-types";
import { provinces } from "./provinces";

export const siteUrl = new URL(
  process.env.SITE_URL || "https://vireyak-rust.vercel.app",
).origin;
export const siteDescription =
  "Explore Cambodia with Vireyak. Discover temples, provincial highlights, and places to stay, from Siem Reap and Phnom Penh to the coast.";

export function pageMetadata({
  title,
  tabTitle,
  description,
  path,
  image = "/images/thumbnail.png",
}: {
  title: string;
  tabTitle?: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const socialTitle = `${title} | Vireyak`;
  return {
    title: { absolute: `${tabTitle || title} | Vireyak` },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Vireyak",
      title: socialTitle,
      description,
      url: path,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}

export function listingMetadata(
  kind: TravelKind,
  params: SearchParams,
  items: TravelItem[],
): Metadata {
  const destination =
    typeof params.destination === "string" ? params.destination : "";
  const catalogueDestination =
    provinces.find((province) => province.name === destination)?.destination ||
    destination;
  const matches = items.filter(
    (item) => item.destination === catalogueDestination,
  );
  const validDestination = Boolean(destination && matches.length);
  const location = validDestination ? destination : "Cambodia";
  const title =
    kind === "stays"
      ? `Places to Stay in ${location}`
      : `${location} Attractions & Experiences`;
  const path = `/${kind}${validDestination ? `?${new URLSearchParams({ destination })}` : ""}`;
  const metadata = pageMetadata({
    title,
    description:
      kind === "stays"
        ? `Explore our sample collection of hotels, villas, and resorts in ${location}. Compare destinations and amenities with Vireyak.`
        : `Discover temples, nature, and cultural sights in ${location}. Explore attractions and plan your next adventure with Vireyak.`,
    path,
    image: validDestination ? matches[0].image : undefined,
  });
  if (destination && !validDestination)
    metadata.robots = { index: false, follow: true };
  return metadata;
}
