import Link from "next/link";
import Icon from "../components/Icon";
import SearchForm from "../components/SearchForm";
import TravelCard from "../components/TravelCard";
import { destinations, stays, attractions } from "../data/travel";
export default function HomePage() {
  return (
    <>
      <section className="relative isolate min-h-[490px] bg-navy pb-28 pt-16 text-white sm:min-h-[520px] sm:pt-20">
        <img
          src="/images/angkor.jpg"
          alt="The ancient towers of Angkor Wat in Cambodia"
          width="1920"
          height="1080"
          fetchPriority="high"
          className="hero-image absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight/80 via-navy/45 to-midnight/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight/35 to-transparent" />
        <div className="shell reveal">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[9px] font-medium uppercase tracking-[0.22em] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brightgold" /> The
            kingdom of wonder awaits
          </div>
          <h1 className="max-w-[640px] text-[42px] font-semibold leading-[1.15] tracking-[-0.055em] sm:text-[60px]">
            Some journeys
            <br />
            stay with you.<span className="text-brightgold"> Forever.</span>
          </h1>
          <p className="mt-5 max-w-[425px] text-xs leading-7 text-white/80 sm:text-sm">
            Extraordinary stays. Unforgettable experiences.
            <br />
            Discover the Cambodia you&apos;ve been dreaming of.
          </p>
          <div className="mt-7 flex items-center gap-3 text-[10px] text-white/75">
            <span className="h-px w-7 bg-brightgold" /> Go beyond the ordinary.
            Go Vireyak.
          </div>
        </div>
        <div className="absolute bottom-24 right-10 hidden items-center gap-2 text-[10px] text-white/85 lg:flex">
          <Icon name="pin" size={15} />
          <div>
            Angkor Wat
            <span className="block text-[8px] text-white/60">
              Siem Reap, Cambodia
            </span>
          </div>
        </div>
      </section>
      <div className="shell relative z-10 -mt-20">
        <SearchForm />
      </div>
      <div className="shell">
        <div className="grid grid-cols-1 gap-6 border-b border-slate/20 py-7 sm:grid-cols-3 sm:gap-8">
          {[
            [
              "shield",
              "Thoughtfully selected",
              "Places with a little something special.",
            ],
            [
              "temple",
              "Cambodia, from the inside",
              "Discover more than the guidebook.",
            ],
            [
              "heart",
              "Your kind of journey",
              "From little escapes to big adventures.",
            ],
          ].map(([icon, title, copy]) => (
            <div
              key={title}
              className="flex items-center gap-3 sm:justify-center"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
                <Icon name={icon} size={21} />
              </div>
              <div>
                <h2 className="text-[11px] font-semibold text-navy dark:text-ivory">
                  {title}
                </h2>
                <p className="mt-1 text-[9px] text-ink/55">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section className="shell py-12 sm:py-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2.5">
              One country. Endless possibilities.
            </p>
            <h2 className="section-title">
              Where will your curiosity take you?
            </h2>
            <p className="mt-3 text-xs text-ink/55">
              Ancient temples, island mornings, and everything in between.
            </p>
          </div>
          <Link
            href="/stays"
            className="flex items-center gap-2 text-[11px] font-medium text-indigo dark:text-brightgold"
          >
            Explore destinations <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <Link
              key={d.name}
              href={`/stays?destination=${encodeURIComponent(d.name)}`}
              className="group relative isolate aspect-[0.91] overflow-hidden rounded-xl bg-navy sm:aspect-[1.02]"
            >
              <img
                src={d.image}
                alt={
                  d.name === "Siem Reap"
                    ? "Angkor Wat temple"
                    : `${d.name} travel inspiration`
                }
                width="600"
                height="650"
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight/80 via-midnight/5 to-transparent" />
              {i === 0 && (
                <span className="absolute left-4 top-4 rounded bg-ivory/95 px-2.5 py-1.5 text-[8px] font-medium text-navy">
                  A timeless favorite
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-white/70">
                  {d.tag}
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {d.name}
                  </h3>
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-white/40 text-white transition group-hover:bg-white group-hover:text-navy">
                    <Icon name="arrow" size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-y border-slate/10 bg-slate/[0.045] py-12 sm:py-14">
        <div className="shell">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2.5">Check in. Switch off.</p>
              <h2 className="section-title">Find your somewhere special</h2>
              <p className="mt-3 text-xs text-ink/55">
                A few beautiful places to call home, even just for a night.
              </p>
            </div>
            <Link
              href="/stays"
              className="hidden items-center gap-2 text-[11px] font-medium text-indigo dark:text-brightgold sm:flex"
            >
              View all stays <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stays.slice(0, 4).map((item) => (
              <TravelCard key={item.id} item={item} />
            ))}
          </div>
          <Link href="/stays" className="button-outline mt-6 sm:hidden">
            View all stays <Icon name="arrow" size={15} />
          </Link>
        </div>
      </section>
      <section className="shell py-12 sm:py-16">
        <div className="relative isolate grid overflow-hidden rounded-2xl bg-navy text-white md:grid-cols-2">
          <div className="relative min-h-[240px] md:order-2">
            <img
              src="/images/angkor.jpg"
              alt="Ancient Khmer temple architecture at Angkor Wat"
              width="800"
              height="600"
              loading="lazy"
              className="absolute h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent md:bg-gradient-to-r md:from-navy md:via-navy/10" />
          </div>
          <div className="px-7 py-10 sm:p-12 md:order-1">
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-brightgold">
              More than a destination
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight">
              Feel the wonder.
              <br />
              Find your Cambodia.
            </h2>
            <p className="mt-4 max-w-[350px] text-xs leading-7 text-white/65">
              Chase the first light over Angkor. Wander a little further. Share
              a story with someone new. The best part of the journey is how it
              makes you feel.
            </p>
            <Link
              href="/attraction"
              className="mt-7 inline-flex items-center gap-3 rounded-lg bg-brightgold px-5 py-3 text-[11px] font-semibold text-navy transition hover:bg-gold"
            >
              Explore experiences <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="shell pb-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2.5">Make memories, not just plans</p>
            <h2 className="section-title">
              A little adventure goes a long way
            </h2>
          </div>
          <Link
            href="/attraction"
            className="hidden items-center gap-2 text-[11px] font-medium text-indigo dark:text-brightgold sm:flex"
          >
            All experiences <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {attractions.map((item) => (
            <TravelCard key={item.id} item={item} kind="attraction" />
          ))}
        </div>
      </section>
      <section className="border-t border-gold/20 bg-gold/[0.07]">
        <div className="shell flex flex-col items-start justify-between gap-6 py-9 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <Icon name="spark" size={34} className="text-gold" />
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-navy dark:text-ivory">
                Your next chapter starts here.
              </h2>
              <p className="mt-2 text-xs text-ink/55">
                A new view. A slower morning. A story worth telling.
              </p>
            </div>
          </div>
          <Link href="/stays" className="button-primary">
            Find your escape <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
