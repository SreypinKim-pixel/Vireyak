import { ArrowUpRight, Check } from "lucide-react";
import DestinationImage from "./DestinationImage";
import Reveal from "./Reveal";
import type { Destination } from "./DestinationCard";

interface WhyVireyakProps {
  spotlight: Destination | null;
  unavailable: boolean;
}

export default function WhyVireyak({
  spotlight,
  unavailable,
}: WhyVireyakProps) {
  const benefits = spotlight
    ? [spotlight.name, spotlight.province, spotlight.category]
    : [];
  const description =
    spotlight?.description.replace(
      /\bis a nature in\b/g,
      "is a natural destination in",
    ) ||
    (unavailable
      ? "Our next discovery is temporarily unavailable. Please try again later."
      : "More Cambodian discoveries are coming soon.");

  return (
    <section
      aria-labelledby="why-vireyak-title"
      className="bg-surface py-12 sm:py-16"
    >
      <div className="shell grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 xl:gap-12">
        <div className="min-w-0">
          <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-indigo dark:text-brightgold sm:text-sm">
            Off the beaten path
          </p>
          <h2
            id="why-vireyak-title"
            className="text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-navy dark:text-ivory min-[400px]:text-[38px] sm:text-[46px] lg:text-[44px] xl:text-[52px]"
          >
            <span className="block">Discover Cambodia</span>
            <span className="block text-indigo dark:text-brightgold">
              Beyond The Ordinary.
            </span>
          </h2>
          <p className="mt-5 max-w-[560px] text-lg leading-relaxed text-ink/65 sm:text-xl">
            {description}
          </p>
          <Reveal className="mt-6">
            <ul className="space-y-[18px]">
              {benefits.map((benefit, index) => (
                <li
                  key={`${index}-${benefit}`}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF5D9]">
                    <Check
                      size={17}
                      strokeWidth={2.5}
                      aria-hidden="true"
                      className="text-indigo"
                    />
                  </span>
                  <span
                    className={`text-[17px] font-semibold leading-7 text-navy dark:text-ivory sm:text-lg ${index === 2 ? "capitalize" : ""}`}
                  >
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
            {spotlight && (
              <a
                href={spotlight.href}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex items-center gap-3 rounded-[10px] bg-navy px-[26px] py-4 text-base font-semibold text-white transition-colors hover:bg-indigo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
              >
                View on map
                <ArrowUpRight
                  size={19}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </a>
            )}
          </Reveal>
        </div>
        {spotlight && (
          <Reveal delay={0.12} className="relative min-w-0 pb-4">
            <div className="overflow-hidden rounded-[2rem] shadow-soft">
              <DestinationImage
                src={spotlight.image}
                alt={spotlight.name}
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="aspect-square max-h-[480px] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-5 right-5 rounded-2xl border border-[#E8E8E8] bg-white px-6 py-4 shadow-lg sm:right-auto sm:min-w-[240px]">
              <p className="text-sm font-medium text-[#667085]">Discover</p>
              <p className="mt-1 text-lg font-semibold text-navy sm:text-xl">
                {spotlight.name}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
