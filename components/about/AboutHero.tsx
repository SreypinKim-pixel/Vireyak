import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "../Icon";
import { aboutHero } from "../../data/about";

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
        <figure className="relative overflow-hidden rounded-[2rem] border border-slate/20 bg-navy shadow-soft">
          <div className="relative">
            <img
              src={aboutHero.image.src}
              alt={aboutHero.image.alt}
              width="760"
              height="620"
              fetchPriority="high"
              className="aspect-[5/4] w-full object-cover sm:aspect-[4/3]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent"
            />
            <span className="absolute bottom-5 left-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-navy/60 px-4 py-2 text-xs font-medium text-white backdrop-blur sm:left-8">
              <Icon name="pin" size={16} className="shrink-0 text-brightgold" />
              Angkor Wat · Cambodia
            </span>
          </div>
          <figcaption className="relative isolate overflow-hidden border-t border-white/20 px-6 py-7 text-white sm:px-8 sm:py-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <img
                src={aboutHero.image.src}
                alt=""
                className="h-full w-full scale-110 object-cover blur-xl"
              />
              <div className="absolute inset-0 bg-navy/70" />
            </div>
            <span
              aria-hidden="true"
              className="mb-5 block h-1 w-12 rounded-full bg-gold"
            />
            <h2 className="max-w-sm text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {aboutHero.overlay.title}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
              {aboutHero.overlay.copy}
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
