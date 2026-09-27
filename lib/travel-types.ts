export type TravelKind = "stays" | "attraction";
export type SearchParams = Record<string, string | string[] | undefined>;
export type ListingPageProps = { searchParams: Promise<SearchParams> };
export type DetailPageProps = ListingPageProps & {
  params: Promise<{ id: string }>;
};
export interface TravelItem {
  id: string;
  name: string;
  destination: string;
  type: string;
  image: string;
  price: number;
  rating: string;
  reviews: number;
  badge: string;
  capacity?: number;
  description: string;
  amenities?: string[];
  includes?: string[];
  duration?: string;
  note?: string;
}
