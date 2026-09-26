import type { ListingPageProps } from "@/lib/travel-types";
import ListingExplorer from "../../components/ListingExplorer";
import { attractions } from "../../data/travel";
export const metadata = { title: "Unforgettable experiences" };
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
