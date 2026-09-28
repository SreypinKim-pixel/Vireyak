import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import AboutHero from "../../components/about/AboutHero";
import HeroHighlights, {
  HeroHighlightsPlaceholder,
} from "../../components/about/HeroHighlights";
import {
  CambodiaSectionSkeleton,
  PlacesSectionSkeleton,
} from "../../components/about/AboutSkeletons";
import AboutIntro from "../../components/about/AboutIntro";
import CambodiaSection from "../../components/about/CambodiaSection";
import PlacesSection from "../../components/about/PlacesSection";
import TeamSection from "../../components/about/TeamSection";
import WhyVireyak from "../../components/about/WhyVireyak";
import TravelCompass from "../../components/about/TravelCompass";
import AboutFaqs from "../../components/about/AboutFaqs";
import AboutCTA from "../../components/about/AboutCTA";
import { destinations } from "../../data/travel";
import {
  loadCambodiaCatalogue,
  type PlaceCardData,
} from "../../lib/camTripApi";

export const revalidate = 1800;

const fallbackPlaces: PlaceCardData[] = destinations.map((destination) => ({
  id: `preview-${destination.name}`,
  nameEn: destination.name,
  nameKh: null,
  description: destination.subtitle,
  categoryLabel: destination.tag,
  provinceName: destination.name,
  regionLabel: null,
  rating: null,
  image: destination.image,
  imageIsProvincePhoto: false,
  mapsUrl: null,
  featured: false,
  note: "From our own guide",
}));

async function LiveHighlights() {
  const { stats } = await loadCambodiaCatalogue();
  return <HeroHighlights stats={stats} />;
}

async function LiveCambodiaSection() {
  const { provinces, stats, regions, live, ok } = await loadCambodiaCatalogue();
  return (
    <CambodiaSection
      provinces={provinces}
      stats={stats}
      regions={regions}
      live={live}
      reachable={ok.provinces || ok.places}
    />
  );
}

async function LivePlacesSection() {
  const { featuredPlaces, totalPlaces, ok } = await loadCambodiaCatalogue();

  const status = !ok.places
    ? "error"
    : featuredPlaces.length > 0
      ? "ready"
      : "empty";
  return (
    <PlacesSection
      places={featuredPlaces}
      fallbackPlaces={fallbackPlaces}
      totalPlaces={totalPlaces}
      status={status}
    />
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutHero
        highlights={
          <Suspense fallback={<HeroHighlightsPlaceholder />}>
            <LiveHighlights />
          </Suspense>
        }
      />
      <AboutIntro />
      <Suspense fallback={<CambodiaSectionSkeleton />}>
        <LiveCambodiaSection />
      </Suspense>
      <Suspense fallback={<PlacesSectionSkeleton />}>
        <LivePlacesSection />
      </Suspense>
      <TeamSection />
      <WhyVireyak />
      <TravelCompass />
      <AboutFaqs />
      <AboutCTA />
    </>
  );
}

export const metadata = pageMetadata({
  tabTitle: "About",
  title: "About Vireyak",
  description:
    "Meet Vireyak, a Cambodia travel discovery project. Explore our story, our team, and the provinces and places that inspire us.",
  path: "/about",
});
