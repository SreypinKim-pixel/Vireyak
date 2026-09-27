import Icon from "../Icon";
import { whyVireyak, whyVireyakSection } from "../../data/about";

/** The four values that describe what the platform does. */
export default function WhyVireyak() {
  return (
    <section id="why-vireyak" className="shell scroll-mt-8 py-14 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-3">{whyVireyakSection.eyebrow}</p>
        <h2 className="section-title">{whyVireyakSection.title}</h2>
        <p className="mt-4 text-xs leading-7 text-ink/60">
          {whyVireyakSection.description}
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {whyVireyak.map((value) => (
          <article
            key={value.title}
            className="flex h-full flex-col rounded-xl border border-slate/15 bg-panel p-6 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-navy/[0.06] text-indigo dark:bg-white/[0.06] dark:text-brightgold">
              <Icon name={value.icon} size={21} />
            </span>
            <h3 className="mt-5 text-sm font-semibold text-navy dark:text-ivory">
              {value.title}
            </h3>
            <p className="mt-3 text-[11px] leading-6 text-ink/60">
              {value.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
