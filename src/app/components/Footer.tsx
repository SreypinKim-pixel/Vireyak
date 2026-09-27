"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Brand from "./Brand";
import Icon from "./Icon";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="bg-slate-300 text-slate-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Subscribe Banner Above */}
      <div className="shell pt-12 pb-8 border-b border-slate-300 dark:border-gray-800">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="relative flex items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Subscribe Our <br className="hidden sm:inline" />
              Newsletter
            </h2>

            {/* Curved Arrow Decorator */}
            <svg
              className="hidden sm:block w-20 h-10 text-amber-600 dark:text-amber-400 ml-2 -mt-2"
              viewBox="0 0 100 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            >
              <path d="M10,40 Q40,10 70,30 T90,15" />
              <polyline points="82,12 90,15 88,24" fill="none" strokeWidth="2" />
            </svg>
          </div>

          {/* Email Input & Subscribe Button Form */}
          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md items-center gap-2 sm:gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 border border-slate-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-indigo-800 hover:bg-indigo-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 px-5 py-3 text-xs sm:text-sm font-semibold text-white transition-colors shadow-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="shell grid gap-10 py-12 items-start sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div className="flex flex-col items-start justify-start">
          <div className="flex items-center leading-none">
            <Brand />
          </div>
          <p className="mt-4 max-w-[255px] text-xs leading-7 text-slate-600 dark:text-gray-400">
            Extraordinary places. Meaningful journeys.
            <br />
            Your Cambodia, beautifully discovered.
          </p>

          <div className="mt-6 flex items-center gap-2 text-[10px] tracking-wide text-slate-500 dark:text-gray-400">
            <Icon name="pin" size={14} /> Made with love in Cambodia
          </div>
          {/* Social Icons */}
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
                className="text-slate-800 dark:text-white hover:opacity-80 transition-opacity"
              >
                <Icon name="github" size={25} />
                
              </a>
            </div> 
        </div>
        

        {/* Column 1 */}
        <div>
          <h2 className="mb-5 text-m font-semibold text-slate-900 dark:text-white leading-none pt-10">
            Find your next journey
          </h2>
          <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-gray-400">
            <Link
              href="/stays"
              className="hover:text-indigo-800 dark:hover:text-white transition-colors"
            >
              Places to stay
            </Link>
            <Link
              href="/attraction"
              className="hover:text-indigo-800 dark:hover:text-white transition-colors"
            >
              Things to experience
            </Link>
            <Link
              href="/stays?destination=Siem+Reap"
              className="hover:text-indigo-800 dark:hover:text-white transition-colors"
            >
              Discover Siem Reap
            </Link>
            <Link
              href="/stays?destination=Koh+Rong"
              className="hover:text-indigo-800 dark:hover:text-white transition-colors"
            >
              Island escapes
            </Link>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h2 className="mb-5 text-m font-semibold text-slate-900 dark:text-white leading-none pt-10 ">
            Get to know Vireyak
          </h2>
          <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-gray-400">
            <Link
              href="/about"
              className="hover:text-indigo-800 dark:hover:text-white transition-colors"
            >
              Our story
            </Link>
            <Link
              href="/about#travel-thoughtfully"
              className="hover:text-indigo-800 dark:hover:text-white transition-colors"
            >
              Travel thoughtfully
            </Link>
            <Link
              href="/about#questions"
              className="hover:text-indigo-800 dark:hover:text-white transition-colors"
            >
              Frequently asked questions
            </Link>
            
            
          </div>
  
        </div>
        
        {/* off */}

         {/* Column 3 
        <div>
          <h2 className="mb-5 text-m font-semibold text-slate-900 dark:text-white leading-none pt-10">
            A little closer to your next trip
          </h2>
          <p className="text-xs leading-6 text-slate-600 dark:text-gray-400">
            Find a place that feels like you.
            <br />
            Let the journey begin.
          </p>
          <Link
            href="/stays"
            className="mt-5 inline-flex items-center gap-3 text-xs text-indigo-800 dark:text-indigo-400 font-medium"
          >
            Explore Cambodia <Icon name="arrow" size={16} />
          </Link>
        </div> */}

        {/* Contact Info Column */}
        <div>
          <h2 className="mb-5 text-m font-semibold text-slate-900 dark:text-white leading-none pt-9">
            Contact Info
          </h2>
          <div className="flex flex-col gap-3.5 text-xs text-slate-600 dark:text-gray-400">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 text-indigo-800 dark:text-indigo-400">
                <Icon name="pin" size={16} />
              </span>
              <span>Phnom Penh, Cambodia</span>
            </div>
            <a
              href="tel:+85512345678"
              className="flex items-center gap-2.5 hover:text-indigo-800 dark:hover:text-white transition-colors"
            >
              <span className="text-indigo-800 dark:text-indigo-400">
                <Icon name="phone" size={16} />
              </span>
              <span>+855 12 888 699</span>
            </a>
            <a
              href="mailto:info@vireyak.com"
              className="flex items-center gap-2.5 hover:text-indigo-800 dark:hover:text-white transition-colors"
            >
              <span className="text-indigo-800 dark:text-indigo-400">
                <Icon name="mail" size={16} />
              </span>
              <span>info@vireyak.com</span>
            </a>

            {/* Social Icons */}
            {/* <div className="mt-2 flex items-center gap-3.5"> */}
              {/* <a
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
                className="text-slate-800 dark:text-white hover:opacity-80 transition-opacity"
              >
                <Icon name="github" size={25} />
                
              </a>
            </div> */}
            <img 
                 src="/logo-white.png" 
                 alt="Vireyak White Logo" 
                  className="h-16 w-56" 
    />
            
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-300 dark:border-gray-800">
        <div className="shell flex flex-col items-center justify-between gap-4 py-5 text-[10px] text-slate-500 dark:text-gray-400 sm:flex-row">
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
