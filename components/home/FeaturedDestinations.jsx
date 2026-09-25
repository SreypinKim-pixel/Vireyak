import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getFeaturedDestinations } from "@/lib/cam-trip";
import DestinationImage from "./DestinationImage";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default async function FeaturedDestinations() {
  const { destinations, unavailable } = await getFeaturedDestinations();

  return (
    <section
      aria-labelledby="featured-destinations-title"
      className="bg-panel py-12 sm:py-16"
    >
      <div className="shell">
        <SectionHeading
          id="featured-destinations-title"
          eyebrow="Explore Cambodia"
          title="Featured Destinations"
          description="Places that deserve a place on your next Cambodian adventure."
        >
          <Link
            href="/attraction"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-navy dark:text-ivory"
          >
            View all destinations
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </SectionHeading>

        {destinations.length === 0 && (
          <p className="mt-8 text-sm text-ink/60" role="status">
            {unavailable
              ? "Destinations are temporarily unavailable. Please try again later."
              : "New destinations are coming soon."}
          </p>
        )}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {destinations.map((destination, index) => (
            <Reveal key={destination.id} delay={index * 0.12}>
              <article className="group h-full overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-sm transition-shadow hover:shadow-xl">
                <Link
                  href={destination.href}
                  aria-label={`Discover ${destination.name}`}
                  className="flex h-full flex-col focus-visible:outline-offset-[-4px]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <DestinationImage
                      src={destination.image}
                      alt={destination.name}
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy backdrop-blur-md">
                      {destination.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-ink/60">
                      <MapPin size={13} aria-hidden="true" />
                      {destination.location}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-ink">
                      {destination.name}
                    </h3>
                    <p className="mb-5 mt-2 line-clamp-2 text-sm leading-6 text-ink/60">
                      {destination.description}
                    </p>
                    {destination.attractionCount != null && (
                      <p className="mb-4 w-fit rounded-lg bg-gold/20 px-3 py-2 text-sm font-semibold text-navy dark:text-brightgold">
                        {destination.attractionCount} attractions
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-navy dark:text-ivory">
                      Discover
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
