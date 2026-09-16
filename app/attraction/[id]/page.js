import { notFound } from "next/navigation";
import { attractions } from "../../../data/travel";
import DetailPage from "../../../components/DetailPage";
export const dynamicParams = false;
export function generateStaticParams() {
  return attractions.map((item) => ({ id: item.id }));
}
export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: attractions.find((i) => i.id === id)?.name || "Experience not found",
  };
}
export default async function AttractionPage({ params, searchParams }) {
  const { id } = await params;
  const item = attractions.find((i) => i.id === id);
  if (!item) notFound();
  return (
    <DetailPage
      initial={await searchParams}
      item={item}
      kind="attraction"
      related={attractions.filter((i) => i.id !== item.id)}
    />
  );
}
