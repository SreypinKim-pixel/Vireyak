"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./hero-grid.module.css";

const CELL_SIZE = 120;
const COLORS = [
  "oklch(0.72 0.2 352.53)",
  "#A764FF",
  "#4B94FD",
  "#FD4B4E",
  "#FF8743",
];

function SubGrid() {
  const [cellColors, setCellColors] = useState([null, null, null, null]);
  const leaveTimeouts = useRef([null, null, null, null]);

  useEffect(() => {
    const timeouts = leaveTimeouts.current;
    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, []);

  function handleHover(index) {
    clearTimeout(leaveTimeouts.current[index]);
    // This runs only on pointer entry, after render.
    // eslint-disable-next-line react-hooks/purity
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setCellColors((previous) =>
      previous.map((value, i) => (i === index ? color : value)),
    );
  }

  function handleLeave(index) {
    clearTimeout(leaveTimeouts.current[index]);
    leaveTimeouts.current[index] = setTimeout(() => {
      setCellColors((previous) =>
        previous.map((value, i) => (i === index ? null : value)),
      );
      leaveTimeouts.current[index] = null;
    }, 120);
  }

  return (
    <div className={styles.subgrid}>
      {cellColors.map((color, index) => (
        <div
          key={index}
          className={styles.cell}
          onPointerEnter={() => handleHover(index)}
          onPointerLeave={() => handleLeave(index)}
          style={{ backgroundColor: color || "transparent" }}
        />
      ))}
    </div>
  );
}

function InteractiveGrid() {
  const containerRef = useRef(null);
  const [grid, setGrid] = useState({ columns: 0, rows: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setGrid({
        columns: Math.ceil(width / CELL_SIZE),
        rows: Math.ceil(height / CELL_SIZE),
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div aria-hidden="true" className={styles.gridContainer} ref={containerRef}>
      <div
        className={styles.mainGrid}
        style={{
          "--grid-cell-size": `${CELL_SIZE}px`,
          gridTemplateColumns: `repeat(${grid.columns}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${grid.rows}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: grid.columns * grid.rows }, (_, index) => (
          <SubGrid key={index} />
        ))}
      </div>
    </div>
  );
}

export function HeroGrid() {
  const reducedMotion = useReducedMotion();
  const entrance = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reducedMotion ? 0 : 0.6,
      delay: reducedMotion ? 0 : delay,
    },
  });

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-surface pb-36 pt-24 sm:pb-44 sm:pt-36"
    >
      <InteractiveGrid />
      <div
        className={`${styles.heroContent} pointer-events-none relative z-10 gap-6 px-5 text-left sm:px-8`}
      >
        <motion.p {...entrance()} className="eyebrow">
          The kingdom of wonder awaits
        </motion.p>
        <motion.h1
          {...entrance(0.08)}
          id="hero-title"
          className="max-w-3xl text-pretty text-4xl font-bold leading-tight tracking-tight text-navy dark:text-ivory sm:text-5xl lg:text-6xl"
        >
          Some journeys stay with you.{" "}
          <span className="text-indigo dark:text-brightgold">Forever.</span>
        </motion.h1>
        <motion.p
          {...entrance(0.15)}
          className="max-w-2xl text-sm leading-7 text-ink/65 sm:text-lg"
        >
          Extraordinary stays. Unforgettable experiences.
          <br />
          Discover the Cambodia you&apos;ve been dreaming of.
        </motion.p>
        <motion.div
          {...entrance(0.25)}
          className={`${styles.heroButtons} pointer-events-auto flex-wrap`}
        >
          <Link href="/stays" className="button-outline bg-surface shadow-sm">
            Find your escape
          </Link>
          <Link href="/attraction" className="button-primary group">
            Explore experiences{" "}
            <ArrowUpRight
              aria-hidden="true"
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroGrid;
