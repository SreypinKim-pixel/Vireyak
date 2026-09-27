import Icon from "../Icon";
import { aboutIntro } from "../../data/about";

/** Explains what Vireyak is, who it serves, and why Cambodia is the focus. */
export default function AboutIntro() {
  return (
    <section id="about-vireyak" className="shell scroll-mt-8 py-14 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div>
          <p className="eyebrow mb-3">{aboutIntro.eyebrow}</p>
          <h2 className="section-title">{aboutIntro.title}</h2>
          <p className="mt-5 text-sm leading-8 text-ink/65">
            {aboutIntro.lead}
          </p>
          <p className="mt-6 rounded-xl bg-gold/10 p-5 text-[11px] leading-6 text-ink/60">
            {aboutIntro.note}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {aboutIntro.pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="flex h-full flex-col rounded-xl border border-slate/15 bg-panel p-6 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold">
                <Icon name={pillar.icon} size={20} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-navy dark:text-ivory">
                {pillar.title}
              </h3>
              <p className="mt-3 text-[11px] leading-6 text-ink/60">
                {pillar.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
