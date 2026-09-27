import Link from "next/link";
import Icon from "../Icon";
import { finalCta } from "../../data/about";

/** Closing call to action. Both links use the site's existing routes. */
export default function AboutCTA() {
  return (
    <section aria-labelledby="about-cta-title" className="shell pb-16">
      <div className="relative isolate overflow-hidden rounded-2xl bg-navy px-7 py-12 text-center text-white sm:px-12 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
        />
        <div className="relative">
          <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-brightgold">
            {finalCta.eyebrow}
          </p>
          <h2
            id="about-cta-title"
            className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
          >
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-7 text-white/65">
            {finalCta.copy}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={finalCta.primaryCta.href}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brightgold px-6 py-3 text-xs font-semibold text-navy transition duration-500 ease-out hover:bg-gold motion-reduce:transition-none"
            >
              {finalCta.primaryCta.label} <Icon name="arrow" size={16} />
            </Link>
            <Link
              href={finalCta.secondaryCta.href}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-xs font-medium text-white transition duration-500 ease-out hover:bg-white/10 motion-reduce:transition-none"
            >
              {finalCta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
