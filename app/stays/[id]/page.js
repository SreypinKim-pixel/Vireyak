import { notFound } from "next/navigation";
import { stays } from "../../../data/travel";
import DetailPage from "../../../components/DetailPage";
export const dynamicParams = false;
export function generateStaticParams() {
  return stays.map((item) => ({ id: item.id }));
}
export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: stays.find((i) => i.id === id)?.name || "Stay not found",
  };
}
export default async function StayPage({ params, searchParams }) {
  const { id } = await params;
  const item = stays.find((i) => i.id === id);
  if (!item) notFound();
  return (
    <DetailPage
      initial={await searchParams}
      item={item}
      kind="stays"
      related={stays.filter((i) => i.id !== item.id)}
    />
  );
}
