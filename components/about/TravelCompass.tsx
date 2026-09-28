import Icon from "../Icon";
import { travelCompass } from "../../data/about";

export default function TravelCompass() {
  return (
    <section
      id="travel-thoughtfully"
      className="scroll-mt-8 border-y border-slate/60 dark:border-slate/15 bg-slate/[0.045] py-14"
    >
      <div className="shell">
        <p className="eyebrow mb-3 text-center">{travelCompass.eyebrow}</p>
        <h2 className="section-title text-center">{travelCompass.title}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {travelCompass.points.map((point) => (
            <div
              key={point.title}
              className="group rounded-xl border border-slate/60 bg-panel p-7 transition duration-500 ease-out hover:-translate-y-1 hover:border-gold hover:bg-gold/10 hover:shadow-soft motion-reduce:transform-none motion-reduce:transition-none dark:border-slate/15 dark:hover:border-brightgold/60 dark:hover:bg-gold/10"
            >
              <Icon
                name={point.icon}
                className="mb-5 text-gold transition-colors duration-500 ease-out group-hover:text-indigo motion-reduce:transition-none dark:group-hover:text-brightgold"
                size={28}
              />
              <h3 className="text-base font-semibold">{point.title}</h3>
              <p className="mt-3 text-xs leading-7 text-ink/60">{point.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
