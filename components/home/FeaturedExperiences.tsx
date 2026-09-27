import Link from "next/link";
import Icon from "@/components/Icon";
import DestinationCard from "./DestinationCard";
import DestinationImage from "./DestinationImage";

export default function FeaturedExperiences({
  experiences,
}: {
  experiences: import("./DestinationCard").Destination[];
}) {
  return (
    <section
      aria-labelledby="featured-experiences"
      className="shell py-12 sm:py-16"
    >
      <div className="grid overflow-hidden rounded-3xl border border-slate/60 dark:border-slate/15 bg-panel md:grid-cols-2">
        <div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:p-12">
          <p className="eyebrow mb-4">Make memories, not just plans</p>
          <h2
            id="featured-experiences"
            className="section-title max-w-md text-3xl leading-tight sm:text-4xl"
          >
            A little adventure goes a long way
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-ink/65">
            Follow a forest trail, feel the spray of a waterfall, or take the
            scenic way home. Find your next adventure in Cambodia.
          </p>
          <Link href="/attraction" className="button-primary mt-7 gap-3">
            All experiences <Icon name="arrow" size={16} />
          </Link>
        </div>
        <figure className="relative min-h-[280px] md:min-h-[400px]">
          <DestinationImage
            src="/images/bousra-waterfall.jpg"
            alt="Bousra waterfall flowing through the forest in Mondulkiri, Cambodia"
            width={1280}
            height={960}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-midnight/55 via-transparent to-transparent"
          />
          <figcaption className="absolute bottom-5 left-6 flex items-center gap-2 text-xs font-medium text-white sm:bottom-7 sm:left-8">
            <Icon name="pin" size={15} /> Bousra waterfall · Mondulkiri
          </figcaption>
        </figure>
      </div>
      {experiences.length > 0 && (
        <div className="mt-7 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((item) => (
            <DestinationCard key={item.id} destination={item} />
          ))}
        </div>
      )}
    </section>
  );
}
