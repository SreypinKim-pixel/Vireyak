"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import Recommended from "@/components/Recommended";

export default function NotFound() {
  const router = useRouter();
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface text-ink dark:bg-[#0B1020] dark:text-white">
      <div
        aria-hidden="true"
        className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo/10 dark:bg-[#3158B8]/20 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gold/15 dark:bg-[#D4AF37]/10 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid flex-1 items-center gap-14 py-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <section className="max-w-2xl text-center lg:text-left">
            <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
              <span className="h-px w-10 bg-[#D4AF37]" />

              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo dark:text-[#F3CD5F]">
                <Compass size={15} />
                Error 404
              </span>

              <span className="h-px w-10 bg-[#D4AF37] lg:hidden" />
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-navy dark:text-white sm:text-5xl lg:text-6xl">
              Looks like you&apos;ve
              <span className="block text-[#80651d] dark:text-[#D4AF37]">
                wandered off the map.
              </span>
            </h1>

            <p className="mt-5 text-xl font-semibold text-indigo dark:text-[#F3CD5F]">
              រកទំព័រនេះមិនឃើញទេ!
            </p>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ink/65 dark:text-white/60 lg:mx-0 lg:text-lg">
              The page you&apos;re looking for doesn&apos;t exist or may have
              moved. Don&apos;t worry — there are still plenty of beautiful
              places waiting to be discovered.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="/"
                className="group inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-[#111827] shadow-[0_12px_35px_rgba(212,175,55,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F3CD5F] hover:shadow-[0_16px_40px_rgba(212,175,55,0.25)]"
              >
                Back to the map
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/attraction"
                className="inline-flex min-h-12 items-center rounded-xl border border-slate/60 dark:border-white/15 px-6 py-3.5 text-sm font-semibold"
              >
                Explore Attractions
              </Link>
              <button
                type="button"
                onClick={goBack}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate/60 bg-panel dark:border-white/15 dark:bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-navy dark:text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo/40 hover:bg-slate/10 dark:hover:border-white/25 dark:hover:bg-white/[0.09]"
              >
                <ArrowLeft size={17} />
                Go Back
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-4 lg:justify-start">
              <div className="h-px w-12 bg-slate/25 dark:bg-white/10" />

              <p className="text-xs uppercase tracking-[0.2em] text-ink/55 dark:text-white/30">
                Your next adventure is waiting
              </p>

              <div className="h-px w-12 bg-slate/25 dark:bg-white/10 lg:hidden" />
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[430px]">
              <div className="mb-6 text-center">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#80651d] dark:text-[#D4AF37]">
                  Discover Cambodia
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-navy dark:text-white sm:text-3xl">
                  Recommended Places
                </h2>

                <div className="mx-auto mt-3 flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-[#D4AF37]/50" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  <span className="h-px w-8 bg-[#D4AF37]/50" />
                </div>
              </div>

              <div>
                <Recommended />
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-center border-t border-slate/60 dark:border-white/[0.06] pt-5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-ink/50 dark:text-white/25">
            Vireyak · Explore Cambodia
          </p>
        </div>
      </div>
    </main>
  );
}
