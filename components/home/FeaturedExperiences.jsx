import Link from "next/link";
import Icon from "@/components/Icon";
import DestinationCard from "./DestinationCard";
import SectionHeading from "./SectionHeading";

export default function FeaturedExperiences({ experiences, unavailable }) {
  return (
    <section
      aria-labelledby="featured-experiences"
      className="shell py-12 sm:py-16"
    >
      <SectionHeading
        id="featured-experiences"
        eyebrow="Make memories, not just plans"
        title="A little adventure goes a long way"
      >
        <Link
          href="/attraction"
          className="flex min-h-11 items-center gap-2 text-[11px] font-medium text-indigo dark:text-brightgold"
        >
          All experiences <Icon name="arrow" size={16} />
        </Link>
      </SectionHeading>
      {experiences.length === 0 && (
        <p role="status" className="mt-7 text-sm text-ink/60">
          {unavailable
            ? "Experiences are temporarily unavailable. Please try again later."
            : "New experiences are coming soon."}
        </p>
      )}
      <div className="mt-7 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {experiences.map((item) => (
          <DestinationCard key={item.id} destination={item} />
        ))}
      </div>
    </section>
  );
}
