"use client";
import { useState } from "react";
import Link from "next/link";
export default function Brand({
  light = false,
  logoSrc = null,
}: {
  light?: boolean;
  logoSrc?: string | null;
}) {
  const [failed, setFailed] = useState(false);
  if (logoSrc && !failed) {
    return (
      <Link
        href="/"
        aria-label="Vireyak home"
        className="inline-flex shrink-0 items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <img
          src={logoSrc}
          onError={() => setFailed(true)}
          alt="Vireyak"
          width={2001}
          height={786}
          className={`h-auto w-[110px] min-[375px]:w-[130px] sm:w-[170px] lg:w-[190px] ${light ? "invert hue-rotate-180" : "dark:invert dark:hue-rotate-180"}`}
        />
      </Link>
    );
  }
  return (
    <Link
      href="/"
      aria-label="Vireyak home"
      className={`inline-flex items-center gap-2 text-[27px] font-bold tracking-[-1.4px] ${light ? "text-ivory" : "text-navy dark:text-ivory"}`}
    >
      Vireyak<span className="ml-[-3px] text-gold">.</span>
    </Link>
  );
}
