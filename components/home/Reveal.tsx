"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Reveal({
  children,
  delay = 0,
  ...props
}: import("motion/react").HTMLMotionProps<"div"> & { delay?: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={false}
      whileInView={
        reducedMotion ? undefined : { opacity: [0.7, 1], y: [16, 0] }
      }
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
