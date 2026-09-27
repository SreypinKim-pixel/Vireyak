import Link from "next/link";
import Brand from "./Brand";
import Icon from "./Icon";
export default function Footer() {
  return (
    <footer className="border-t border-slate/15 bg-panel text-ink transition-colors duration-300 dark:bg-navy dark:text-ivory">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Brand />
          <p className="mt-4 max-w-[255px] text-xs leading-7 text-ink/65 dark:text-ivory/60">
            Extraordinary places. Meaningful journeys.
            <br />
            Your Cambodia, beautifully discovered.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[10px] tracking-wide text-ink/65 dark:text-ivory/60">
            <Icon name="pin" size={14} /> Made with love in Cambodia
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold">Find your next journey</h2>
          <div className="flex flex-col gap-3 text-xs text-ink/65 dark:text-ivory/60">
            <Link
              href="/stays"
              className="transition-colors hover:text-indigo dark:hover:text-brightgold"
            >
              Places to stay
            </Link>
            <Link
              href="/attraction"
              className="transition-colors hover:text-indigo dark:hover:text-brightgold"
            >
              Things to experience
            </Link>
            <Link
              href="/stays?destination=Siem+Reap"
              className="transition-colors hover:text-indigo dark:hover:text-brightgold"
            >
              Discover Siem Reap
            </Link>
            <Link
              href="/stays?destination=Koh+Rong"
              className="transition-colors hover:text-indigo dark:hover:text-brightgold"
            >
              Island escapes
            </Link>
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold">Get to know Vireyak</h2>
          <div className="flex flex-col gap-3 text-xs text-ink/65 dark:text-ivory/60">
            <Link
              href="/about"
              className="transition-colors hover:text-indigo dark:hover:text-brightgold"
            >
              Our story
            </Link>
            <Link
              href="/about#travel-thoughtfully"
              className="transition-colors hover:text-indigo dark:hover:text-brightgold"
            >
              Travel thoughtfully
            </Link>
            <Link
              href="/about#questions"
              className="transition-colors hover:text-indigo dark:hover:text-brightgold"
            >
              Frequently asked questions
            </Link>
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold">
            A little closer to your next trip
          </h2>
          <p className="text-xs leading-6 text-ink/65 dark:text-ivory/60">
            Find a place that feels like you.
            <br />
            Let the journey begin.
          </p>
          <Link
            href="/stays"
            className="mt-5 inline-flex items-center gap-3 text-xs text-indigo dark:text-brightgold"
          >
            Explore Cambodia <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
      <div className="border-t border-slate/20 dark:border-white/10">
        <div className="shell flex flex-col justify-between gap-3 py-5 text-[10px] text-ink/60 dark:text-ivory/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Vireyak. A world of wonder, closer to
            home.
          </p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Icon name="globe" size={13} /> English
            </span>
            <span>USD · $</span>
            <span>Booking preview</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
