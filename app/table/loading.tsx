import { PlacesTableSkeleton } from "@/components/places/PlacesTable";

export default function Loading() {
  return (
    <div className="shell py-12 sm:py-16">
      <PlacesTableSkeleton />
    </div>
  );
}
