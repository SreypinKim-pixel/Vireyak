import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "../Icon";
import { aboutHero } from "../../data/about";

/**
 * About page hero. `highlights` is an optional streamed slot holding the live
 * API figures, so the hero itself paints immediately.
 * @param {{ highlights?: import("react").ReactNode }} props
 */
export default function AboutHero({
  highlights = null,
}: {
  highlights?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="about-hero-title"
      className="relative isolate overflow-hidden border-b border-slate/60 dark:border-slate/15 bg-surface"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
      />
      <div className="shell grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="reveal">
          <p className="eyebrow mb-4">{aboutHero.eyebrow}</p>
          <h1
            id="about-hero-title"
            className="section-title text-4xl leading-[1.12] sm:text-5xl"
          >
            {aboutHero.title}{" "}
            <span className="text-indigo dark:text-brightgold">
              {aboutHero.titleAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-8 text-ink/60">
            {aboutHero.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={aboutHero.primaryCta.href}
              className="button-primary duration-500 ease-out motion-reduce:transition-none"
            >
              {aboutHero.primaryCta.label} <Icon name="arrow" size={16} />
            </Link>
            <Link
              href={aboutHero.secondaryCta.href}
              className="button-outline duration-500 ease-out motion-reduce:transition-none"
            >
              {aboutHero.secondaryCta.label}
            </Link>
          </div>
          {highlights}
        </div>
        <div className="relative">
          <img
            src={aboutHero.image.src}
            alt={aboutHero.image.alt}
            width="760"
            height="620"
            fetchPriority="high"
            className="aspect-[5/4] w-full rounded-2xl object-cover shadow-soft"
          />
          <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/20 bg-navy/85 p-5 text-white backdrop-blur">
            <p className="text-xs font-medium">{aboutHero.overlay.title}</p>
            <p className="mt-2 text-[10px] leading-5 text-white/60">
              {aboutHero.overlay.copy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
