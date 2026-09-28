"use client";
import type { TravelItem, TravelKind, SearchParams } from "@/lib/travel-types";
import { useState } from "react";
import Icon from "./Icon";
import DatePicker, { parseDate } from "./DatePicker";
export default function BookingPanel({
  item,
  kind,
  initial = {},
}: {
  item: TravelItem;
  kind: TravelKind;
  initial?: SearchParams;
}) {
  const [date, setDate] = useState(
    typeof initial.checkin === "string" ? initial.checkin : "",
  );
  const [end, setEnd] = useState(
    typeof initial.checkout === "string" ? initial.checkout : "",
  );
  const [guests, setGuests] = useState(
    String(
      Math.max(1, Math.min(item.capacity || 6, Number(initial.guests) || 2)),
    ),
  );
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [confirmed, setConfirmed] = useState(false);
  const nights =
    date && end
      ? Math.max(0, Math.round((Date.parse(end) - Date.parse(date)) / 86400000))
      : 0;
  const today = new Date().toLocaleDateString("en-CA");
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setConfirmed(false);
    const dateLabel = kind === "stays" ? "Check-in" : "Experience date";
    const travelerCount = Number(guests);
    let error = "";
    let field = dateLabel;
    if (!date.trim()) {
      error = `Please select your ${dateLabel.toLowerCase()} before previewing your trip.`;
    } else if (!parseDate(date)) {
      error = `Please enter a valid ${dateLabel.toLowerCase()} in YYYY-MM-DD format.`;
    } else if (date < today) {
      error = `Your ${dateLabel.toLowerCase()} must be today or a future date.`;
    } else if (kind === "stays" && (!parseDate(end) || nights < 1)) {
      field = "Check-out";
      error = !end.trim()
        ? "Please select your check-out date."
        : !parseDate(end)
          ? "Please enter a valid check-out date in YYYY-MM-DD format."
          : "Check-out must be after your check-in date.";
    } else if (
      !guests.trim() ||
      !Number.isInteger(travelerCount) ||
      travelerCount < 1 ||
      travelerCount > (item.capacity || 6)
    ) {
      field = "Travelers";
      error = `Please enter a whole number of travelers between 1 and ${item.capacity || 6}.`;
    }
    if (error) {
      setReady(false);
      setMessage(error);
      e.currentTarget
        .querySelector<HTMLInputElement>(`input[aria-label="${field}"]`)
        ?.focus();
      return;
    }
    setReady(true);
    setMessage("Continue to payment");
  }
  return (
    <div className="sticky top-6 rounded-xl border border-slate/60 dark:border-slate/20 bg-panel p-6 shadow-soft">
      <div className="flex items-end gap-2">
        <span className="text-3xl font-semibold text-navy dark:text-ivory">
          ${item.price}
        </span>
        <span className="mb-1 text-xs text-ink/55">
          / {kind === "stays" ? "night" : "person"}
        </span>
      </div>
      <p className="mb-6 mt-1 text-xs text-ink/50">
        Illustrative price · USD
      </p>
      <form onSubmit={submit} noValidate className="space-y-4">
        <label className="block">
          <span className="field-label">
            {kind === "stays" ? "Check-in" : "Experience date"}
          </span>
          <DatePicker
            required
            label={kind === "stays" ? "Check-in" : "Experience date"}
            min={today}
            value={date}
            from={date}
            to={end}
            onChange={(value) => {
              setDate(value);
              setReady(false);
              setMessage("");
            }}
            onRangeChange={
              kind === "stays"
                ? (start, finish) => {
                    setDate(start);
                    setEnd(finish);
                    setReady(false);
                    setMessage("");
                  }
                : undefined
            }
            className="field"
          />
        </label>
        {kind === "stays" && (
          <label className="block">
            <span className="field-label">Check-out</span>
            <DatePicker
              required
              label="Check-out"
              min={today}
              value={end}
              from={date}
              to={end}
              onChange={(value) => {
                setEnd(value);
                setReady(false);
                setMessage("");
              }}
              onRangeChange={(start, finish) => {
                setDate(start);
                setEnd(finish);
                setReady(false);
                setMessage("");
              }}
              className="field"
            />
          </label>
        )}
        <div className="block">
          <span className="field-label">Travelers</span>
          <input
            aria-label="Travelers"
            type="number"
            inputMode="numeric"
            min={1}
            max={item.capacity || 6}
            step={1}
            required
            className="field"
            value={guests}
            onChange={(event) => {
              setGuests(event.target.value);
              setReady(false);
              setMessage("");
            }}
          />
        </div>
        {(kind !== "stays" || nights > 0) && (
          <div className="flex items-center justify-between border-t border-slate/60 dark:border-slate/20 pt-4 text-xs">
            <span>
              {kind === "stays" ? `${nights} nights` : `${guests} travelers`} ·
              estimated subtotal
            </span>
            <strong>
              ${item.price * (kind === "stays" ? nights : Number(guests))}
            </strong>
          </div>
        )}
        <button className="button-primary w-full" type="submit">
          Preview your trip <Icon name="arrow" size={16} />
        </button>
        <p className="text-center text-xs text-ink/50">
          No payment required. Taxes and fees not calculated.
        </p>
      </form>
      {message && !confirmed && (
        <div
          role={ready ? "status" : "alert"}
          className={`mt-5 rounded-lg p-4 leading-6 ${ready ? "flex items-center gap-3 border-2 border-gold bg-gold/20 text-sm font-bold text-navy dark:text-brightgold" : "border border-red-600/40 bg-red-500/10 text-sm font-medium text-red-700 dark:text-red-300"}`}
        >
          {ready && <Icon name="arrow" size={20} className="shrink-0" />}
          <span>{message}</span>
        </div>
      )}
      {ready && (
        <section
          className="mt-5 rounded-lg border border-slate/60 p-4"
          aria-label="Demo checkout"
        >
          <h2 className="text-base font-semibold">Your trip summary</h2>
          <dl className="mt-3 space-y-2 text-xs leading-6">
            <div>
              <dt className="text-ink/60">Destination</dt>
              <dd className="font-medium">{item.name}</dd>
            </div>
            <div>
              <dt className="text-ink/60">Dates</dt>
              <dd>
                {date}
                {kind === "stays" ? ` → ${end} (${nights} nights)` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-ink/60">Travelers</dt>
              <dd>{guests}</dd>
            </div>
            <div className="flex justify-between border-t border-slate/60 pt-2">
              <dt>Demo subtotal</dt>
              <dd className="font-semibold">
                {(
                  item.price * (kind === "stays" ? nights : Number(guests))
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </dd>
            </div>
          </dl>
          {confirmed ? (
            <div
              role="status"
              className="mt-4 flex items-center gap-3 rounded-lg border-2 border-green-600 bg-green-100 p-4 text-sm font-bold leading-6 text-green-900 dark:border-green-400 dark:bg-green-950 dark:text-green-200"
            >
              <Icon name="check" size={22} className="shrink-0" />
              <p>Payment successful</p>
            </div>
          ) : (
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setConfirmed(true);
              }}
            >
              <fieldset>
                <legend className="field-label">Demo payment method</legend>
                <div className="space-y-2">
                  {[
                    { value: "card", label: "Credit / debit card (demo)" },
                    { value: "aba", label: "ABA Pay (demo)" },
                    { value: "bakong", label: "KHQR / Bakong (demo)" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-slate/60 px-3 py-2 text-xs has-[:checked]:border-gold has-[:checked]:bg-gold/10"
                    >
                      <input
                        type="radio"
                        name="demo-payment"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                        className="accent-indigo"
                      />
                      {method.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" className="button-primary w-full">
                Confirm booking <Icon name="check" size={16} />
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}
