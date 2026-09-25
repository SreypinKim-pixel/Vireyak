import { Search, Compass, MapPinned } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "Explore destinations, resorts and experiences across Cambodia.",
  },
  {
    number: "02",
    icon: Compass,
    title: "Choose",
    description: "Find the places and activities that match your travel style.",
  },
  {
    number: "03",
    icon: MapPinned,
    title: "Experience",
    description: "Start your journey and create memories worth bringing home.",
  },
];

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="bg-surface py-12 sm:py-16"
    >
      <div className="shell">
        <Reveal>
          <SectionHeading
            id="how-it-works-heading"
            eyebrow="Simple & Seamless"
            title="Your Journey in 3 Easy Steps"
            description="From inspiration to exploration, Vireyak keeps your journey simple."
            centered
          />
        </Reveal>

        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-12 hidden border-t border-dashed border-gold/40 md:block"
          />

          <ol className="grid gap-10 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li key={step.number} className="relative z-10 text-center">
                  <Reveal delay={index * 0.15}>
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-8 border-surface bg-navy text-brightgold shadow-xl shadow-navy/20 motion-safe:transition-transform motion-safe:hover:rotate-6 motion-safe:hover:scale-105">
                      <Icon size={30} aria-hidden="true" />
                    </div>

                    <span
                      aria-hidden="true"
                      className="mt-5 block text-xs font-bold tracking-widest text-gold"
                    >
                      {step.number}
                    </span>

                    <h3 className="mt-2 text-xl font-semibold text-ink">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink/60">
                      {step.description}
                    </p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
