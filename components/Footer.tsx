"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Brand from "./Brand";
import Icon from "./Icon";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setMessage(
        "Newsletter subscriptions are not open yet. Your email has not been saved.",
      );
    }
  };

  return (
    <footer className="bg-gray-300 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="shell pt-12 pb-8 border-b border-slate/60 dark:border-gray-800">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="relative flex items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Subscribe Our <br className="hidden sm:inline" />
              Newsletter
            </h2>

            <svg
              className="hidden sm:block w-20 h-10 text-amber-600 dark:text-amber-400 ml-2 -mt-2"
              viewBox="0 0 100 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            >
              <path d="M10,40 Q40,10 70,30 T90,15" />
              <polyline
                points="82,12 90,15 88,24"
                fill="none"
                strokeWidth="2"
              />
            </svg>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md items-center gap-2 sm:gap-3"
          >
            <input
              type="email"
              aria-label="Newsletter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 border border-slate/60 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-blue-800 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 px-5 py-3 text-xs sm:text-sm font-semibold text-white transition-colors shadow-sm"
            >
              Subscribe
            </button>
          </form>
          {message && (
            <p role="status" className="text-xs">
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="shell grid gap-10 py-12 items-start sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-start justify-start">
          <div className="flex items-center leading-none">
            <Brand logoSrc="/Logo.png" />
          </div>
          <p className="mt-4 max-w-[255px] text-xs leading-7 text-gray-600 dark:text-gray-400">
            Extraordinary places. Meaningful journeys.
            <br />
            Your Cambodia, beautifully discovered.
          </p>

          <div className="mt-6 flex items-center gap-2 text-[10px] tracking-wide text-gray-500 dark:text-gray-400">
            <Icon name="pin" size={14} /> Made with love in Cambodia
          </div>

          <div className="mt-2 flex items-center gap-3.5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-[#1877F2] hover:opacity-80 transition-opacity"
            >
              <Icon name="facebook" size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#E4405F] hover:opacity-80 transition-opacity"
            >
              <Icon name="instagram" size={25} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-[#FF0000] hover:opacity-80 transition-opacity"
            >
              <Icon name="youtube" size={28} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-800 dark:text-white hover:opacity-80 transition-opacity"
            >
              <Icon name="github" size={25} />
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-m font-semibold text-gray-900 dark:text-white leading-none pt-10">
            Find your next journey
          </h2>
          <div className="flex flex-col gap-3 text-xs text-gray-600 dark:text-gray-400">
            <Link
              href="/stays"
              className="hover:text-blue-800 dark:hover:text-white transition-colors"
            >
              Places to stay
            </Link>
            <Link
              href="/attraction"
              className="hover:text-blue-800 dark:hover:text-white transition-colors"
            >
              Things to experience
            </Link>
            <Link
              href="/stays?destination=Siem+Reap"
              className="hover:text-blue-800 dark:hover:text-white transition-colors"
            >
              Discover Siem Reap
            </Link>
            <Link
              href="/stays?destination=Koh+Rong"
              className="hover:text-blue-800 dark:hover:text-white transition-colors"
            >
              Island escapes
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-m font-semibold text-gray-900 dark:text-white leading-none pt-10 ">
            Get to know Vireyak
          </h2>
          <div className="flex flex-col gap-3 text-xs text-gray-600 dark:text-gray-400">
            <Link
              href="/about"
              className="hover:text-blue-800 dark:hover:text-white transition-colors"
            >
              Our story
            </Link>
            <Link
              href="/about#travel-thoughtfully"
              className="hover:text-blue-800 dark:hover:text-white transition-colors"
            >
              Travel thoughtfully
            </Link>
            <Link
              href="/about#questions"
              className="hover:text-blue-800 dark:hover:text-white transition-colors"
            >
              Frequently asked questions
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-m font-semibold text-gray-900 dark:text-white leading-none pt-9">
            Contact Info
          </h2>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-3.5 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-blue-800 dark:text-blue-400">
                  <Icon name="pin" size={16} />
                </span>
                <span>Phnom Penh, Cambodia</span>
              </div>
              <a
                href="tel:+85512888699"
                className="flex items-center gap-2.5 hover:text-blue-800 dark:hover:text-white transition-colors"
              >
                <span className="text-blue-800 dark:text-blue-400">
                  <Icon name="phone" size={16} />
                </span>
                <span>+855 12 888 699</span>
              </a>
              <a
                href="mailto:info@vireyak.com"
                className="flex items-center gap-2.5 hover:text-blue-800 dark:hover:text-white transition-colors"
              >
                <span className="text-blue-800 dark:text-blue-400">
                  <Icon name="mail" size={16} />
                </span>
                <span>info@vireyak.com</span>
              </a>
            </div>
            <img
              src="/images/istad-logo.png"
              alt="ISTAD — Institute of Science and Technology Advanced Development"
              width={455}
              height={439}
              className="h-auto w-24 shrink-0 -translate-y-[50px] origin-top-right scale-125 object-contain sm:origin-top-left xl:scale-[1.75]"
              style={{ clipPath: "ellipse(46.3% 48% at 50% 50%)" }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate/60 dark:border-gray-800">
        <div className="shell flex flex-col items-center justify-between gap-4 py-5 text-[10px] text-gray-500 dark:text-gray-400 sm:flex-row">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Vireyak. A world of wonder, closer to
            home.
          </p>

          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Icon name="globe" size={23} /> English
            </span>
            <span>USD · $</span>
            <span>Booking preview</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
