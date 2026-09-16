import ListingExplorer from "../../components/ListingExplorer";
import { stays } from "../../data/travel";
export const metadata = { title: "Beautiful places to stay" };
export default async function StaysPage({ searchParams }) {
  return (
    <ListingExplorer items={stays} kind="stays" initial={await searchParams} />
  );
}
