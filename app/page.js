import HeroGrid from "@/components/smoothui/blocks/heroes/hero-grid/index.js";
import { getHomepageAttractions } from "@/lib/cam-trip";
import SearchForm from "@/components/SearchForm";
import FeatureStrip from "@/components/home/FeatureStrip";
import FeaturedDestinations from "@/components/home/FeaturedDestinations.jsx";
import ProvinceLookup from "@/components/home/ProvinceLookup";
import FeaturedExperiences from "@/components/home/FeaturedExperiences";
import WhyVireyak from "@/components/home/WhyVireyak";
import HowItWorks from "@/components/home/HowItWorks";
import TravelerReviews from "@/components/home/TravelerReviews";
import HomeCTA from "@/components/home/HomeCTA";

export default async function HomePage() {
  const { experiences, spotlight, unavailable } =
    await getHomepageAttractions();
  return (
    <>
      <HeroGrid />
      <div className="shell relative z-10 -mt-20">
        <SearchForm />
      </div>
      <FeatureStrip />
      <FeaturedDestinations />
      <ProvinceLookup />
      <FeaturedExperiences
        experiences={experiences}
        unavailable={unavailable}
      />
      <WhyVireyak spotlight={spotlight} unavailable={unavailable} />
      <HowItWorks />
      <TravelerReviews />
      <HomeCTA />
    </>
  );
}
