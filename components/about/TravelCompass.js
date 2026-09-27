import Icon from "../Icon";
import { travelCompass } from "../../data/about";

/**
 * The original "Our compass" guidance from the first About page. The id is
 * unchanged so the footer link /about#travel-thoughtfully still works.
 */
export default function TravelCompass() {
  return (
    <section
      id="travel-thoughtfully"
      className="scroll-mt-8 border-y border-slate/15 bg-slate/[0.045] py-14"
    >
      <div className="shell">
        <p className="eyebrow mb-3 text-center">{travelCompass.eyebrow}</p>
        <h2 className="section-title text-center">{travelCompass.title}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {travelCompass.points.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-slate/15 bg-panel p-7"
            >
              <Icon name={point.icon} className="mb-5 text-gold" size={28} />
              <h3 className="text-base font-semibold">{point.title}</h3>
              <p className="mt-3 text-xs leading-7 text-ink/60">{point.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
