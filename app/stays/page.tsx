import { listingMetadata } from "@/lib/seo";
import type { ListingPageProps } from "@/lib/travel-types";
import ListingExplorer from "../../components/ListingExplorer";
import { stays } from "../../data/travel";
export default async function StaysPage({ searchParams }: ListingPageProps) {
  return (
    <ListingExplorer items={stays} kind="stays" initial={await searchParams} />
  );
}

export async function generateMetadata({ searchParams }: ListingPageProps) {
  return listingMetadata("stays", await searchParams, stays);
}
