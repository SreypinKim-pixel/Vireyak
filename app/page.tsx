import HeroGrid from "@/components/smoothui/blocks/heroes/hero-grid/index";
import { getHomepageAttractions, getProvinceNames } from "@/lib/cam-trip";
import SearchForm from "@/components/SearchForm";
import FeatureStrip from "@/components/home/FeatureStrip";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import FeaturedExperiences from "@/components/home/FeaturedExperiences";
import WhyVireyak from "@/components/home/WhyVireyak";
import HowItWorks from "@/components/home/HowItWorks";
import TravelerReviews from "@/components/home/TravelerReviews";
import HomeCTA from "@/components/home/HomeCTA";

export default async function HomePage() {
  const [{ experiences, spotlight, unavailable }, provinces] =
    await Promise.all([getHomepageAttractions(), getProvinceNames()]);
  return (
    <>
      <HeroGrid />
      <div className="shell relative z-10 -mt-20">
        <SearchForm provinces={provinces} />
      </div>
      <FeatureStrip />
      <FeaturedDestinations />
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
