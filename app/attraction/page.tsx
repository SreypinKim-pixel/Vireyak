import { listingMetadata } from "@/lib/seo";
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

export async function generateMetadata({ searchParams }: ListingPageProps) {
  return listingMetadata("attraction", await searchParams, attractions);
}
