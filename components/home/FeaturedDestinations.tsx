import { getFeaturedDestinations } from "@/lib/cam-trip";
import ProvinceGrid from "./ProvinceGrid";

export default async function FeaturedDestinations() {
  return <ProvinceGrid {...await getFeaturedDestinations()} />;
}
