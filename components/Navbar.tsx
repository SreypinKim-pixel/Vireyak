"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import Brand from "./Brand";
import Icon from "./Icon";
const links = [
  ["Home", "/"],
  ["Stays", "/stays"],
  ["Attraction", "/attraction"],
  ["About", "/about"],
];
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}
const getTheme = () => document.documentElement.classList.contains("dark");
const getServerTheme = () => false;

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState(path);
  const dark = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  if (path !== previousPath) {
    setPreviousPath(path);
    setOpen(false);
  }
  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("vireyak-theme", next ? "dark" : "light");
    } catch {}
  }
  return (
    <header className="relative z-40 border-b border-slate/15 bg-surface">
      <div className="shell flex h-[88px] items-center justify-between gap-4">
        <Brand />
        <nav
          aria-label="Main navigation"
          className="hidden h-full items-center gap-9 md:flex"
        >
          {links.map(([label, href]) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full items-center text-xs font-medium transition hover:text-indigo dark:hover:text-brightgold ${active ? "text-navy dark:text-brightgold after:absolute after:bottom-5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-gold" : "text-ink/60"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 lg:gap-5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full p-2 text-ink/60 transition hover:bg-slate/10"
          >
            <Icon name={dark ? "sun" : "moon"} size={18} />
          </button>
          <span className="hidden h-5 w-px bg-slate/25 lg:block" />
          <Link href="/login" className="hidden text-xs font-medium sm:block">
            Log in
          </Link>
          <Link
            href="/register"
            className="button-primary min-h-10 px-4 py-2 text-[11px] sm:px-5"
          >
            Sign up <Icon name="arrow" size={15} />
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 md:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full border-b border-slate/20 bg-surface px-6 pb-5 shadow-soft md:hidden"
        >
          {[...links, ["Log in", "/login"]].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm hover:bg-slate/10"
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
