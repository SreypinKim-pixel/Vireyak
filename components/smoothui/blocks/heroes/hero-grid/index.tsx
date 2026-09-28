"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TypingAnimation } from "@/registry/magicui/typing-animation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, MapPin, Star } from "lucide-react";

const destinations = [
  {
    id: "siem-reap",
    name: "SIEM REAP",
    location: "Siem Reap, Cambodia",
    category: "Heritage",
    description:
      "Discover ancient temples, peaceful landscapes, and the timeless beauty of Cambodia's cultural heart.",
    background: "/images/hero-angkor.png",
    image: "/images/angkor.jpg",
    accent: "#D4AF37",
  },
  {
    id: "koh-rong",
    name: "KOH RONG",
    location: "Sihanoukville, Cambodia",
    category: "Island Escape",
    description:
      "Escape to turquoise waters, tropical beaches, and quiet island moments surrounded by nature.",
    background: "/images/island.jpg",
    image: "/images/island.jpg",
    accent: "#F3CD5F",
  },
  {
    id: "kampot",
    name: "KAMPOT",
    location: "Kampot, Cambodia",
    category: "Nature",
    description:
      "Slow down among riverside views, green mountains, local food, and Cambodia's relaxed countryside.",
    background: "/images/river.jpg",
    image: "/images/river.jpg",
    accent: "#D4AF37",
  },
  {
    id: "phnom-penh",
    name: "PHNOM PENH",
    location: "Phnom Penh, Cambodia",
    category: "City Life",
    description:
      "Experience Cambodia's vibrant capital through its riverside, architecture, food, and culture.",
    background: "/images/palace.jpg",
    image: "/images/palace.jpg",
    accent: "#F3CD5F",
  },
  {
    id: "kirirom",
    name: "KIRIROM",
    location: "Kampong Speu, Cambodia",
    category: "Nature Retreat",
    description:
      "Unwind at Romhaey Kirirom Resort by EHM, surrounded by forest and mountain views, with family rooms and private balconies for a peaceful escape.",
    background: "/images/kirirom-resort.jpg",
    image: "/images/kirirom-resort.jpg",
    href: "https://www.tripadvisor.com/Hotel_Review-g729357-d27757353-Reviews-Romhaey_Kirirom_Resort_By_Ehm-Kampong_Speu_Kampong_Speu_Province.html",
    accent: "#D4AF37",
  },
];

export default function HeroGrid() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeDestination = destinations[activeIndex];

  // Auto change destination
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % destinations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      aria-label="Explore Cambodia destinations"
      className="relative isolate min-h-[780px] overflow-hidden bg-[#0E0D15]"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <AnimatePresence mode="sync">
        <motion.div
          key={activeDestination.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.1 },
            scale: { duration: 7, ease: "easeOut" },
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${activeDestination.background})`,
          }}
        />
      </AnimatePresence>

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E0D15]/70 via-[#0E0D15]/40 to-[#0E0D15]/10 dark:from-[#0E0D15]/60 dark:via-[#0E0D15]/45" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D15]/60 via-transparent to-[#0E0D15]/20" />

      {/* =========================================================
          DECORATIVE GOLD GLOW
      ========================================================= */}

      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#D4AF37]/10 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#3D5387]/20 blur-[130px]"
      />

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative z-10 mx-auto flex min-h-[780px] max-w-[1500px] items-center px-6 pb-52 pt-20 sm:px-10 lg:px-16 lg:pt-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDestination.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Small label */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#D4AF37]" />

                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F3CD5F]">
                    {activeDestination.category}
                  </span>
                </div>

                {/* Destination */}
                <h1 className="text-[clamp(2.25rem,6vw,5.5rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-white">
                  <TypingAnimation
                    delay={0.5}
                    step={0.05}
                    cursor={null}
                    respectReducedMotion={false}
                  >
                    {activeDestination.name}
                  </TypingAnimation>
                </h1>

                {/* Location */}
                <div className="mt-5 flex items-center gap-2 text-sm text-white/65">
                  <MapPin size={15} className="text-[#F3CD5F]" />

                  {activeDestination.location}
                </div>

                {/* Description */}
                <p className="mt-6 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
                  {activeDestination.description}
                </p>

                {/* Button */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <motion.div
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 15px 40px rgba(212,175,55,.25)",
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href={
                        activeDestination.href ||
                        `/stays?destination=${encodeURIComponent(activeDestination.name.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()))}`
                      }
                      className="group flex items-center gap-3 rounded-xl bg-[#D4AF37] px-7 py-4 text-sm font-bold text-[#182346]"
                    >
                      Explore destination
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </motion.div>

                  <Link
                    href="/attraction"
                    className="rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    View experiences
                  </Link>
                </div>

                {/* Rating */}
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <Avatar src="https://i.pravatar.cc/80?img=12" />
                    <Avatar src="https://i.pravatar.cc/80?img=32" />
                    <Avatar src="https://i.pravatar.cc/80?img=47" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          fill="#D4AF37"
                          className="text-[#D4AF37]"
                        />
                      ))}
                    </div>

                    <p className="mt-1 text-xs text-white/55">
                      Loved by travelers exploring Cambodia
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* =====================================================
              DESTINATION CARDS
          ===================================================== */}

          <div className="relative h-[500px]">
            <div className="absolute inset-0 flex items-center justify-end">
              <div className="relative h-[460px] w-full max-w-[680px]">
                {destinations.map((destination, index) => {
                  const offset =
                    (index - activeIndex + destinations.length) %
                    destinations.length;

                  const isActive = index === activeIndex;

                  let x = 0;
                  let scale = 1;
                  let opacity = 1;
                  let zIndex = 20;

                  if (offset === 0) {
                    x = 0;
                    scale = 1;
                    opacity = 1;
                    zIndex = 30;
                  } else if (offset === 1) {
                    x = 210;
                    scale = 0.86;
                    opacity = 0.8;
                    zIndex = 20;
                  } else if (offset === 2) {
                    x = 380;
                    scale = 0.72;
                    opacity = 0.55;
                    zIndex = 10;
                  } else {
                    x = 470;
                    scale = 0.62;
                    opacity = 0;
                    zIndex = 0;
                  }

                  return (
                    <motion.button
                      type="button"
                      aria-label={`Show ${destination.name}`}
                      aria-pressed={isActive}
                      tabIndex={offset > 2 ? -1 : 0}
                      aria-hidden={offset > 2}
                      style={{ pointerEvents: offset > 2 ? "none" : "auto" }}
                      key={destination.id}
                      animate={{
                        x,
                        scale,
                        opacity,
                        zIndex,
                      }}
                      transition={{
                        duration: 0.75,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onClick={() => setActiveIndex(index)}
                      className="absolute left-0 top-5 w-[min(330px,calc(100vw-48px))] cursor-pointer text-left sm:w-[370px]"
                    >
                      <div
                        className={`relative overflow-hidden rounded-[2rem] border backdrop-blur-xl ${
                          isActive
                            ? "border-white/30 shadow-[0_30px_80px_rgba(0,0,0,.45)]"
                            : "border-white/15"
                        }`}
                      >
                        {/* Image */}
                        <div className="relative h-[420px] overflow-hidden">
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className={`h-full w-full object-cover transition-transform duration-700 ${
                              isActive ? "scale-105" : "scale-100"
                            }`}
                          />

                          {/* Image overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D15] via-[#0E0D15]/20 to-transparent" />

                          {/* Category */}
                          <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#0E0D15]/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                            {destination.category}
                          </div>

                          {/* Bookmark */}
                          <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md">
                            <Star size={15} />
                          </div>

                          {/* Card information */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <p className="flex items-center gap-1.5 text-xs text-white/60">
                              <MapPin size={12} />
                              {destination.location}
                            </p>

                            <h3 className="mt-2 text-3xl font-bold text-white">
                              {destination.name}
                            </h3>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Star
                                  size={14}
                                  fill={destination.accent}
                                  className="text-[#D4AF37]"
                                />

                                <span className="text-xs font-semibold text-white">
                                  Featured destination
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          SIDE INDICATOR
      ========================================================= */}

      <div className="absolute bottom-28 left-8 z-20 hidden items-center gap-3 lg:flex">
        <div className="h-24 w-px bg-white/20">
          <motion.div
            key={activeDestination.id}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 3 }}
            className="w-full bg-[#D4AF37]"
          />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
            Discover
          </p>

          <p className="mt-1 text-sm font-semibold text-white">Cambodia</p>
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   AVATAR
=============================================================== */

function Avatar({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      className="h-8 w-8 rounded-full border-2 border-[#0E0D15] object-cover"
    />
  );
}
