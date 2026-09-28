import { pageMetadata } from "@/lib/seo";
import type { DetailPageProps } from "@/lib/travel-types";
import { notFound } from "next/navigation";
import { stays } from "../../../data/travel";
import DetailPage from "../../../components/DetailPage";
export const dynamicParams = false;
export function generateStaticParams() {
  return stays.map((item) => ({ id: item.id }));
}
export async function generateMetadata({
  params,
}: Pick<DetailPageProps, "params">) {
  const { id } = await params;
  const item = stays.find((item) => item.id === id);
  if (!item) notFound();
  return pageMetadata({
    title: `${item.name} in ${item.destination}`,
    description: item.description,
    path: `/stays/${encodeURIComponent(item.id)}`,
    image: item.image,
  });
}
export default async function StayPage({
  params,
  searchParams,
}: DetailPageProps) {
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
