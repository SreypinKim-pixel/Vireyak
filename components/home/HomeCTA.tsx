import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import Reveal from "./Reveal";

export default function HomeCTA() {
  return (
    <section
      aria-labelledby="home-cta-title"
      className="bg-panel pb-12 pt-4 sm:pb-16"
    >
      <div className="shell">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-navy px-7 py-12 sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo/30 blur-3xl"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-2 text-brightgold">
                <Compass size={19} aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Start Exploring
                </span>
              </p>
              <h2
                id="home-cta-title"
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              >
                Your next Cambodian adventure
                <span className="text-brightgold"> starts here.</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
                Discover beautiful places, unique experiences and unforgettable
                stays across the Kingdom of Wonder.
              </p>
            </div>

            <Link
              href="/attraction"
              className="group inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl bg-brightgold px-6 py-3.5 text-sm font-semibold text-navy shadow-lg transition-colors hover:bg-gold focus-visible:outline-brightgold"
            >
              Explore Cambodia
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
