import { pageMetadata } from "@/lib/seo";
import type { ListingPageProps } from "@/lib/travel-types";
import ListingExplorer from "../../components/ListingExplorer";
import { stays } from "../../data/travel";
export default async function StaysPage({ searchParams }: ListingPageProps) {
  return (
    <ListingExplorer items={stays} kind="stays" initial={await searchParams} />
  );
}

export const metadata = pageMetadata({
  tabTitle: "Stays",
  title: "Places to Stay in Cambodia",
  description:
    "Explore our sample collection of Cambodian hotels, villas, and resorts. Compare destinations and amenities to find inspiration for your next trip.",
  path: "/stays",
});
