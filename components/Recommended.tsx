import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { MapPin } from "lucide-react";

const destinations = [
  {
    id: "siem-reap",
    name: "SIEM REAP",
    location: "Siem Reap, Cambodia",
    category: "Heritage",
    description:
      "Discover ancient temples, peaceful landscapes, and the timeless beauty of Cambodia's cultural heart.",
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
    image: "/images/kirirom-resort.jpg",
    href: "https://www.tripadvisor.com/Hotel_Review-g729357-d27757353-Reviews-Romhaey_Kirirom_Resort_By_Ehm-Kampong_Speu_Kampong_Speu_Province.html",
    accent: "#D4AF37",
  },
];

export default function Recommended() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDestination = destinations[activeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % destinations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const href =
    activeDestination.href ||
    `/stays?destination=${encodeURIComponent(
      activeDestination.name
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    )}`;

  return (
    <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeDestination.id}
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -120 }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-[min(370px,calc(100vw-48px))]"
        >
          <Link href={href} className="block text-left">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
              <div className="relative h-[420px] overflow-hidden">
                <img
                  src={activeDestination.image}
                  alt={activeDestination.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D15] via-[#0E0D15]/20 to-transparent" />

                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#0E0D15]/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {activeDestination.category}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="flex items-center gap-1.5 text-xs text-white/60">
                    <MapPin size={12} />
                    {activeDestination.location}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {activeDestination.name}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
