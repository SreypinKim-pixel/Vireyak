import Link from "next/link";
// Set logoSrc to a local image path when the final brand mark is ready.
export default function Brand({ light = false, logoSrc = null }) {
  return (
    <Link
      href="/"
      aria-label="Vireyak home"
      className={`inline-flex items-center gap-2 text-[27px] font-bold tracking-[-1.4px] ${light ? "text-ivory" : "text-navy dark:text-ivory"}`}
    >
      {logoSrc ? <img src={logoSrc} alt="" width="34" height="34" /> : null}
      Vireyak<span className="ml-[-3px] text-gold">.</span>
    </Link>
  );
}
