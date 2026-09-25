import { ShieldCheck, Map, Headphones, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Experiences",
    description: "Discover carefully selected places across Cambodia.",
  },
  {
    icon: Map,
    title: "Explore Cambodia",
    description: "From ancient temples to peaceful coastal escapes.",
  },
  {
    icon: Headphones,
    title: "Travel Support",
    description: "Helpful guidance whenever you need it.",
  },
  {
    icon: Sparkles,
    title: "Curated For You",
    description: "Travel ideas matched to your style and interests.",
  },
];

export default function FeatureStrip() {
  return (
    <section
      aria-label="Why travel with Vireyak"
      className="bg-surface py-12 sm:py-16"
    >
      <div className="shell grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <Reveal
              key={feature.title}
              delay={index * 0.1}
              className="group rounded-2xl border border-ink/10 bg-panel p-5 shadow-sm transition-shadow duration-300 hover:shadow-soft"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink/5 text-gold transition-colors duration-300 group-hover:bg-navy group-hover:text-brightgold">
                  <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
                </div>

                <div>
                  <h3 className="font-semibold text-ink">{feature.title}</h3>

                  <p className="mt-1 text-sm leading-5 text-ink/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
