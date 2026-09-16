"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import Dropdown from "./Dropdown";
export default function SearchForm({
  compact = false,
  initial = {},
  mode = "stays",
}) {
  const router = useRouter();
  const [tab, setTab] = useState(mode);
  const [destination, setDestination] = useState(initial.destination || "");
  const [checkin, setCheckin] = useState(initial.checkin || "");
  const [checkout, setCheckout] = useState(initial.checkout || "");
  const [guests, setGuests] = useState(initial.guests || "2");
  const [error, setError] = useState("");
  const today = new Date().toLocaleDateString("en-CA");
  function submit(event) {
    event.preventDefault();
    if (
      tab === "stays" &&
      ((checkin && !checkout) ||
        (!checkin && checkout) ||
        (checkout && checkout <= checkin))
    ) {
      setError("Choose a check-out date after your check-in date.");
      return;
    }
    if (checkin && checkin < today) {
      setError("Choose today or a future date.");
      return;
    }
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (checkin) params.set("checkin", checkin);
    if (tab === "stays" && checkout) params.set("checkout", checkout);
    params.set("guests", guests);
    setError("");
    router.push(`/${tab}?${params.toString()}`);
  }
  return (
    <div
      className={`relative rounded-xl border border-slate/15 bg-panel text-ink ${compact ? "p-4 shadow-soft" : "p-5 shadow-search sm:p-6"}`}
    >
      {!compact && (
        <div className="mb-5 flex items-center gap-6 border-b border-slate/15">
          <button
            type="button"
            onClick={() => setTab("stays")}
            aria-pressed={tab === "stays"}
            className={`flex items-center gap-2 border-b-2 pb-3 text-xs font-medium ${tab === "stays" ? "border-gold text-navy dark:text-brightgold" : "border-transparent text-ink/50"}`}
          >
            <Icon name="bed" size={17} /> Find a stay
          </button>
          <button
            type="button"
            onClick={() => setTab("attraction")}
            aria-pressed={tab === "attraction"}
            className={`flex items-center gap-2 border-b-2 pb-3 text-xs font-medium ${tab === "attraction" ? "border-gold text-navy dark:text-brightgold" : "border-transparent text-ink/50"}`}
          >
            <Icon name="temple" size={17} /> Find an experience
          </button>
          <span className="ml-auto hidden text-[10px] text-ink/45 sm:block">
            A beautiful journey starts here.
          </span>
        </div>
      )}
      <form
        onSubmit={submit}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.85fr_auto]"
      >
        <div className="flex items-center gap-3 rounded-lg border border-slate/25 px-3 py-3">
          <Icon name="pin" className="text-slate" />
          <span className="min-w-0 flex-1">
            <span className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-ink/60">
              Where to?
            </span>
            <Dropdown
              label="Destination"
              variant="inline"
              value={destination}
              onChange={setDestination}
              options={[
                { value: "", label: "Explore Cambodia" },
                ...["Siem Reap", "Phnom Penh", "Koh Rong", "Kampot"].map(
                  (d) => ({ value: d, label: d }),
                ),
              ]}
            />
          </span>
        </div>
        <label className="flex items-center gap-3 rounded-lg border border-slate/25 px-3 py-3">
          <Icon name="calendar" className="text-slate" size={18} />
          <span className="min-w-0 flex-1">
            <span className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-ink/60">
              {tab === "stays" ? "Check-in" : "Experience date"}
            </span>
            <input
              aria-label={tab === "stays" ? "Check-in" : "Experience date"}
              type="date"
              min={today}
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              className="w-full bg-transparent text-[11px] outline-none"
            />
          </span>
        </label>
        {tab === "stays" ? (
          <label className="flex items-center gap-3 rounded-lg border border-slate/25 px-3 py-3">
            <Icon name="calendar" className="text-slate" size={18} />
            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-ink/60">
                Check-out
              </span>
              <input
                aria-label="Check-out"
                type="date"
                min={checkin || today}
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                className="w-full bg-transparent text-[11px] outline-none"
              />
            </span>
          </label>
        ) : (
          <div className="hidden items-center rounded-lg border border-slate/25 px-4 text-xs text-ink/60 lg:flex">
            Make a little room for wonder.
          </div>
        )}
        <div className="flex items-center gap-3 rounded-lg border border-slate/25 px-3 py-3">
          <Icon name="users" className="text-slate" size={18} />
          <span className="min-w-0 flex-1">
            <span className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-ink/60">
              Travelers
            </span>
            <Dropdown
              label="Travelers"
              variant="inline"
              value={guests}
              onChange={setGuests}
              options={[1, 2, 3, 4, 5, 6].map((n) => ({
                value: String(n),
                label: `${n} ${n === 1 ? "guest" : "guests"}`,
              }))}
            />
          </span>
        </div>
        <button
          type="submit"
          className="button-primary gap-2 px-7 sm:col-span-2 lg:col-span-1"
        >
          <Icon name="search" size={17} /> Search
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-xs text-red-600 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
