"use client";
import { useState } from "react";
import SectionHeading from "./SectionHeading";
import DestinationImage from "./DestinationImage";
import { regions } from "@/lib/cam-trip";

export default function ProvinceLookup() {
  const [provinceId, setProvinceId] = useState("1");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [province, setProvince] = useState(null);
  const [errorText, setErrorText] = useState("");

  async function lookup(e) {
    e.preventDefault();
    if (status === "loading") return;
    const id = provinceId.trim();
    if (!/^\d{1,6}$/.test(id) || Number(id) < 1) {
      setStatus("error");
      setErrorText("Enter a positive province ID, for example 1 or 11.");
      setProvince(null);
      return;
    }
    setStatus("loading");
    setProvince(null);
    setErrorText("");
    try {
      const response = await fetch(`/api/provinces/${id}`);
      if (!response.ok) {
        const message =
          response.status >= 500
            ? "The province service is currently unavailable. Please try again later."
            : "Province not found. Check the ID and try again.";
        setStatus("error");
        setErrorText(message);
        return;
      }
      const payload = await response.json();
      setProvince(payload.data);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorText(
        "Could not reach the province service. Check your connection and try again.",
      );
    }
  }

  const name = province?.nameEn || province?.nameKh;

  return (
    <section
      aria-labelledby="province-lookup-title"
      className="border-t border-slate/15 bg-panel py-12 sm:py-16"
    >
      <div className="shell">
        <SectionHeading
          id="province-lookup-title"
          eyebrow="Live API demo"
          title="Province Lookup"
          description="Fetch a real Cambodian province by its ID, straight from the teacher CamTrip API."
        />

        <form onSubmit={lookup} noValidate className="mt-8 max-w-xl space-y-4">
          <label className="block">
            <span className="field-label">Province ID</span>
            <input
              name="province-id"
              type="number"
              min="1"
              step="1"
              value={provinceId}
              onChange={(event) => setProvinceId(event.target.value)}
              required
              placeholder="e.g. 1 for Siem Reap"
              className="field"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="button-primary w-full sm:w-auto"
          >
            View province
          </button>
          <p className="mt-2 text-[10px] leading-5 text-ink/55">
            Calls{" "}
            <code className="break-all">
              GET https://cam-trip.cheat.casa/api/provinces/
              {provinceId || "[id]"}
            </code>{" "}
            on submit. Try 1 (Siem Reap), 11 (Phnom Penh), or 22 (Kampot).
          </p>
        </form>

        {status === "loading" && (
          <p
            data-testid="province-loading"
            role="status"
            className="mt-8 text-sm text-ink/60"
          >
            Loading province {provinceId} from the CamTrip API…
          </p>
        )}

        {status === "error" && (
          <p
            data-testid="province-error"
            role="alert"
            className="mt-8 rounded-lg border border-red-600/40 bg-red-600/5 p-4 text-xs leading-6 text-red-600 dark:text-red-400"
          >
            {errorText}
          </p>
        )}

        {status === "success" && province && (
          <article
            data-testid="province-result"
            className="mt-8 overflow-hidden rounded-2xl border border-slate/20 bg-surface shadow-soft"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <DestinationImage
                src={province.imageUrl}
                alt={`${name} province photo`}
                width={800}
                height={450}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-navy dark:text-ivory">
                {name}
              </h3>
              <p className="mt-1 text-sm text-ink/60">{province.nameKh}</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div>
                  <dt className="text-ink/50">Region</dt>
                  <dd className="mt-0.5 font-medium">
                    {regions[province.region] || province.region}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink/50">Attractions</dt>
                  <dd className="mt-0.5 font-medium">
                    {province.attractionCount ?? "unavailable"}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-[10px] leading-5 text-ink/55">
                Live data from the teacher CamTrip API —{" "}
                <code className="break-all">
                  GET /api/provinces/{province.id}
                </code>
              </p>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
