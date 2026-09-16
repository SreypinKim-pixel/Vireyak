import Link from "next/link";
import Brand from "./Brand";
import Icon from "./Icon";
export default function Footer() {
  return (
    <footer className="bg-navy text-ivory">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Brand light />
          <p className="mt-4 max-w-[255px] text-xs leading-7 text-ivory/60">
            Extraordinary places. Meaningful journeys.
            <br />
            Your Cambodia, beautifully discovered.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[10px] tracking-wide text-ivory/60">
            <Icon name="pin" size={14} /> Made with love in Cambodia
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold">Find your next journey</h2>
          <div className="flex flex-col gap-3 text-xs text-ivory/60">
            <Link href="/stays" className="hover:text-brightgold">
              Places to stay
            </Link>
            <Link href="/attraction" className="hover:text-brightgold">
              Things to experience
            </Link>
            <Link
              href="/stays?destination=Siem+Reap"
              className="hover:text-brightgold"
            >
              Discover Siem Reap
            </Link>
            <Link
              href="/stays?destination=Koh+Rong"
              className="hover:text-brightgold"
            >
              Island escapes
            </Link>
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold">Get to know Vireyak</h2>
          <div className="flex flex-col gap-3 text-xs text-ivory/60">
            <Link href="/about" className="hover:text-brightgold">
              Our story
            </Link>
            <Link
              href="/about#travel-thoughtfully"
              className="hover:text-brightgold"
            >
              Travel thoughtfully
            </Link>
            <Link href="/about#questions" className="hover:text-brightgold">
              Frequently asked questions
            </Link>
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold">
            A little closer to your next trip
          </h2>
          <p className="text-xs leading-6 text-ivory/60">
            Find a place that feels like you.
            <br />
            Let the journey begin.
          </p>
          <Link
            href="/stays"
            className="mt-5 inline-flex items-center gap-3 text-xs text-brightgold"
          >
            Explore Cambodia <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col justify-between gap-3 py-5 text-[10px] text-ivory/50 sm:flex-row">
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
