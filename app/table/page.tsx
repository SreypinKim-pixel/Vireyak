import PlacesTable from "./PlacesTable";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cambodia Places Directory",
  tabTitle: "Places",
  description:
    "Browse Cambodian places by name, province, type, and sample price.",
  path: "/table",
});

export default function PlacesPage() {
  return (
    <section className="shell py-12 sm:py-16">
      <p className="eyebrow">Explore Cambodia</p>
      <h1 className="section-title mt-3">Places directory</h1>
      <p className="mb-8 mt-4 max-w-2xl text-sm leading-7 text-ink/60">
        Compare places across Cambodia. Select any column heading to sort in
        either direction. Prices and ratings are illustrative demo data, not
        live offers.
      </p>
      <PlacesTable />
    </section>
  );
}
