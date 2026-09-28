import { pageMetadata } from "@/lib/seo";
import type { ListingPageProps } from "@/lib/travel-types";
import ListingExplorer from "../../components/ListingExplorer";
import { attractions } from "../../data/travel";
export default async function AttractionPage({
  searchParams,
}: ListingPageProps) {
  return (
    <ListingExplorer
      items={attractions}
      kind="attraction"
      initial={await searchParams}
    />
  );
}

export const metadata = pageMetadata({
  tabTitle: "Attractions",
  title: "Cambodia Attractions & Experiences",
  description:
    "Discover temples, waterfalls, islands, and cultural sights across Cambodia. Explore attractions by province and plan your next adventure.",
  path: "/attraction",
});
