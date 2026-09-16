import Link from "next/link";
import Icon from "../../components/Icon";
export const metadata = { title: "Our story" };
const questions = [
  [
    "Can I make a booking on Vireyak?",
    "Not yet. Vireyak is currently a booking website preview. You can explore sample stays and experiences, save favorites on your device, and preview a trip. No reservation or payment is made.",
  ],
  [
    "Are the prices and reviews live?",
    "Listings, accommodation names, prices, ratings, reviews, and amenities are illustrative. Destination photographs offer inspiration; they are not verified photographs of the sample properties.",
  ],
  [
    "Where are my favorites saved?",
    "Favorites are stored in this browser on your device. They do not sync to an account or another device, and clearing browser storage removes them.",
  ],
  [
    "Do I need an account to explore?",
    "No. Every destination, stay, and experience can be explored without signing in. Account registration and login are previews and are not connected to an authentication service.",
  ],
];
export default function AboutPage() {
  return (
    <>
      <section className="shell grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">
            Rooted in Cambodia. Made for discovery.
          </p>
          <h1 className="section-title text-4xl leading-tight sm:text-5xl">
            For the places.
            <br />
            For the people.
            <br />
            <span className="text-indigo dark:text-brightgold">
              For the feeling.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-8 text-ink/60">
            We believe the best journeys leave you with more than photographs.
            They leave you with a new perspective, an unexpected friendship, and
            a place you carry with you.
          </p>
          <p className="mt-4 max-w-md text-sm leading-8 text-ink/60">
            Vireyak is our invitation to discover Cambodia with curiosity. From
            the familiar silhouette of Angkor to a quiet stretch of river, there
            is always another story waiting.
          </p>
          <Link href="/stays" className="button-primary mt-7">
            Find your Cambodia <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="relative">
          <img
            src="/images/angkor.jpg"
            alt="Warm light across the ancient grounds of Angkor Wat"
            width="700"
            height="800"
            className="aspect-[1.05] w-full rounded-2xl object-cover"
          />
          <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/20 bg-navy/85 p-5 text-white backdrop-blur">
            <p className="text-xs font-medium">
              A small country. A world of wonder.
            </p>
            <p className="mt-2 text-[10px] text-white/60">
              Cambodia, through a different lens.
            </p>
          </div>
        </div>
      </section>
      <section
        id="travel-thoughtfully"
        className="scroll-mt-8 border-y border-slate/15 bg-slate/[0.045] py-14"
      >
        <div className="shell">
          <p className="eyebrow mb-3 text-center">Our compass</p>
          <h2 className="section-title text-center">
            A more meaningful way to go.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              [
                "temple",
                "Stay curious",
                "Look beyond the landmark. Take time to learn the story, respect the customs, and connect with the place you are visiting.",
              ],
              [
                "leaf",
                "Leave a lighter footprint",
                "Take it slowly, bring a reusable bottle, and treat Cambodia’s landscapes with the care they deserve.",
              ],
              [
                "heart",
                "Keep it local",
                "Seek out local craftsmanship, try something new at a neighborhood table, and let the people you meet shape your journey.",
              ],
            ].map(([icon, title, copy]) => (
              <div
                key={title}
                className="rounded-xl border border-slate/15 bg-panel p-7"
              >
                <Icon name={icon} className="mb-5 text-gold" size={28} />
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-3 text-xs leading-7 text-ink/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="questions" className="shell max-w-[850px] scroll-mt-8 py-14">
        <p className="eyebrow mb-3">A little clarity before you go</p>
        <h2 className="section-title mb-8">Good questions. Honest answers.</h2>
        <div className="divide-y divide-slate/20">
          {questions.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="cursor-pointer text-sm font-medium text-navy dark:text-ivory">
                {q}
              </summary>
              <p className="mt-4 text-xs leading-7 text-ink/65">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
