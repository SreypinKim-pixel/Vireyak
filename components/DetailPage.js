import Link from "next/link";
import Icon from "./Icon";
import BookingPanel from "./BookingPanel";
import TravelCard from "./TravelCard";
export default function DetailPage({ item, kind, related, initial }) {
  return (
    <div className="shell py-8 sm:py-12">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-[10px] text-ink/55"
      >
        <Link href="/">Home</Link>
        <Icon name="chevron" size={11} />
        <Link href={`/${kind}`}>
          {kind === "stays" ? "Stays" : "Attraction"}
        </Link>
        <Icon name="chevron" size={11} />
        <span>{item.destination}</span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">
            {item.type} · {item.badge}
          </p>
          <h1 className="section-title text-3xl sm:text-4xl">{item.name}</h1>
          <p className="mt-4 flex items-center gap-2 text-xs text-ink/60">
            <Icon name="pin" size={15} /> {item.destination}, Cambodia
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-medium">A little extraordinary</p>
            <p className="mt-1 text-[9px] text-ink/55">
              {item.reviews} illustrative reviews
            </p>
          </div>
          <span className="rounded-t-lg rounded-br-lg bg-navy p-3 text-lg font-semibold text-white">
            {item.rating}
          </span>
        </div>
      </div>
      <div className="relative mt-7 aspect-[16/8] overflow-hidden rounded-xl bg-navy sm:aspect-[2.7]">
        <img
          src={item.image}
          alt={`${item.name} travel inspiration`}
          width="1400"
          height="650"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-4 left-4 rounded bg-navy/75 px-3 py-2 text-[9px] text-white backdrop-blur">
          Inspiration imagery · sample listing
        </span>
      </div>
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="section-title text-2xl">
            {kind === "stays"
              ? "Make yourself at home."
              : "A moment worth making."}
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-ink/65">
            {item.description}
          </p>
          <h3 className="mb-5 mt-9 text-base font-semibold">
            {kind === "stays"
              ? "The little things that make a stay"
              : "Your experience, at a glance"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {(item.amenities || item.includes).map((a) => (
              <div
                key={a}
                className="flex items-center gap-3 rounded-lg border border-slate/20 p-4 text-xs"
              >
                <Icon name="check" size={17} className="text-gold" />
                {a}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-gold/10 p-6">
            <h3 className="flex items-center gap-2 text-xs font-semibold">
              <Icon name="shield" size={17} /> Good to know
            </h3>
            <p className="mt-3 text-xs leading-7 text-ink/65">
              {item.note ||
                "This is an example stay for exploring Vireyak. Property details, amenities, and prices are illustrative. Availability and cancellation terms have not been confirmed."}{" "}
              No reservation is created by using the trip preview.
            </p>
          </div>
        </div>
        <BookingPanel item={item} kind={kind} initial={initial} />
      </div>
      <section className="mt-16 border-t border-slate/20 pt-10">
        <h2 className="section-title mb-7">A little more inspiration</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.slice(0, 3).map((i) => (
            <TravelCard key={i.id} item={i} kind={kind} />
          ))}
        </div>
      </section>
    </div>
  );
}
