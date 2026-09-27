import Link from "next/link";
import Brand from "./Brand";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-slate-800 dark:bg-navy dark:text-ivory transition-colors duration-300">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          {/* Automatically handles light/dark mode via CSS or props */}
          <Brand />
          <p className="mt-4 max-w-[255px] text-xs leading-7 text-slate-600 dark:text-ivory/60">
            Extraordinary places. Meaningful journeys.
            <br />
            Your Cambodia, beautifully discovered.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[10px] tracking-wide text-slate-500 dark:text-ivory/60">
            <Icon name="pin" size={14} /> Made with love in Cambodia
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-xs font-semibold text-slate-900 dark:text-ivory">
            Find your next journey
          </h2>
          <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-ivory/60">
            <Link
              href="/stays"
              className="hover:text-amber-600 dark:hover:text-brightgold transition-colors"
            >
              Places to stay
            </Link>
            <Link
              href="/attraction"
              className="hover:text-amber-600 dark:hover:text-brightgold transition-colors"
            >
              Things to experience
            </Link>
            <Link
              href="/stays?destination=Siem+Reap"
              className="hover:text-amber-600 dark:hover:text-brightgold transition-colors"
            >
              Discover Siem Reap
            </Link>
            <Link
              href="/stays?destination=Koh+Rong"
              className="hover:text-amber-600 dark:hover:text-brightgold transition-colors"
            >
              Island escapes
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-xs font-semibold text-slate-900 dark:text-ivory">
            Get to know Vireyak
          </h2>
          <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-ivory/60">
            <Link
              href="/about"
              className="hover:text-amber-600 dark:hover:text-brightgold transition-colors"
            >
              Our story
            </Link>
            <Link
              href="/about#travel-thoughtfully"
              className="hover:text-amber-600 dark:hover:text-brightgold transition-colors"
            >
              Travel thoughtfully
            </Link>
            <Link
              href="/about#questions"
              className="hover:text-amber-600 dark:hover:text-brightgold transition-colors"
            >
              Frequently asked questions
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-xs font-semibold text-slate-900 dark:text-ivory">
            A little closer to your next trip
          </h2>
          <p className="text-xs leading-6 text-slate-600 dark:text-ivory/60">
            Find a place that feels like you.
            <br />
            Let the journey begin.
          </p>
          <Link
            href="/stays"
            className="mt-5 inline-flex items-center gap-3 text-xs text-amber-600 dark:text-brightgold font-medium"
          >
            Explore Cambodia <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-white/10">
        <div className="shell flex flex-col justify-between gap-3 py-5 text-[10px] text-slate-500 dark:text-ivory/50 sm:flex-row">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Vireyak. A world of wonder, closer to
            home.
          </p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Icon name="" size={13} /> English
            </span>
            <span>USD · $</span>
            <span>Booking preview</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
