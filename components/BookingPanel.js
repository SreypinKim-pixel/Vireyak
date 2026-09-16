"use client";
import { useState } from "react";
import Icon from "./Icon";
import Dropdown from "./Dropdown";
export default function BookingPanel({ item, kind, initial = {} }) {
  const [date, setDate] = useState(
    typeof initial.checkin === "string" ? initial.checkin : "",
  );
  const [end, setEnd] = useState(
    typeof initial.checkout === "string" ? initial.checkout : "",
  );
  const [guests, setGuests] = useState(
    Math.max(1, Math.min(item.capacity || 6, Number(initial.guests) || 2)),
  );
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const nights =
    date && end
      ? Math.max(0, Math.round((Date.parse(end) - Date.parse(date)) / 86400000))
      : 0;
  const today = new Date().toLocaleDateString("en-CA");
  function submit(e) {
    e.preventDefault();
    if (date < today || (kind === "stays" && nights < 1)) {
      setReady(false);
      setMessage("Choose a future stay with check-out after check-in.");
      return;
    }
    setReady(true);
    setMessage(
      "Your trip preview is ready. Reservations are not open yet — no booking or payment has been made.",
    );
  }
  return (
    <div className="sticky top-6 rounded-xl border border-slate/20 bg-panel p-6 shadow-soft">
      <div className="flex items-end gap-2">
        <span className="text-3xl font-semibold text-navy dark:text-ivory">
          ${item.price}
        </span>
        <span className="mb-1 text-xs text-ink/55">
          / {kind === "stays" ? "night" : "person"}
        </span>
      </div>
      <p className="mb-6 mt-1 text-[10px] text-ink/50">
        Illustrative price · USD
      </p>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="field-label">
            {kind === "stays" ? "Check-in" : "Experience date"}
          </span>
          <input
            required
            type="date"
            aria-label={kind === "stays" ? "Check-in" : "Experience date"}
            min={today}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setReady(false);
              setMessage("");
            }}
            className="field"
          />
        </label>
        {kind === "stays" && (
          <label className="block">
            <span className="field-label">Check-out</span>
            <input
              required
              type="date"
              aria-label="Check-out"
              min={date || today}
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
                setReady(false);
                setMessage("");
              }}
              className="field"
            />
          </label>
        )}
        <div className="block">
          <span className="field-label">Travelers</span>
          <Dropdown
            label="Travelers"
            value={guests}
            onChange={(value) => {
              setGuests(Number(value));
              setReady(false);
              setMessage("");
            }}
            options={Array.from(
              { length: item.capacity || 6 },
              (_, i) => i + 1,
            ).map((n) => ({
              value: String(n),
              label: `${n} ${n === 1 ? "guest" : "guests"}`,
            }))}
          />
        </div>
        {(kind !== "stays" || nights > 0) && (
          <div className="flex items-center justify-between border-t border-slate/20 pt-4 text-xs">
            <span>
              {kind === "stays" ? `${nights} nights` : `${guests} travelers`} ·
              estimated subtotal
            </span>
            <strong>
              ${item.price * (kind === "stays" ? nights : guests)}
            </strong>
          </div>
        )}
        <button className="button-primary w-full" type="submit">
          Preview your trip <Icon name="arrow" size={16} />
        </button>
        <p className="text-center text-[9px] text-ink/50">
          No payment required. Taxes and fees not calculated.
        </p>
      </form>
      {message && (
        <div
          role="status"
          className={`mt-5 rounded-lg p-4 text-xs leading-6 ${ready ? "bg-gold/10" : "bg-red-500/10"}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
