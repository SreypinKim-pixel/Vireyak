import { notFound } from "next/navigation";
import { getProvinceAttractions } from "../../../../lib/provinces";
import TravelCard from "../../../../components/TravelCard";
export default async function ProvinceAttractionsPage({ params }) {
  const result = getProvinceAttractions((await params).id);
  if (!result) notFound();
  return (
    <div className="shell py-16">
      <p className="eyebrow">Find your next adventure</p>
      <h1 className="section-title mt-3">Explore {result.province.name}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.map((item) => (
          <TravelCard key={item.id} item={item} kind="attraction" />
        ))}
      </div>
    </div>
  );
}
