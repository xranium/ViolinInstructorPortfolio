"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "start" | "end" | "none";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: Direction;
  once?: boolean;
  amount?: number;
  blur?: boolean;
};

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  start: { x: 1, y: 0 }, // slides in from reading start (right in RTL handled via x sign flip)
  end: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered reveal with configurable direction and blur.
 * Direction "start" slides in from the inline-start (right side in RTL).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.9,
  distance = 48,
  direction = "up",
  once = true,
  amount = 0.35,
  blur = true,
}: Props) {
  const reduced = useReducedMotion();
  const off = offsets[direction];
  // In RTL, "start" means from the right; framer x>0 moves right — so x=+distance slides in from right
  const x = off.x * distance;
  const y = off.y * distance;

  const variants: Variants = {
    hidden: reduced
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: direction === "start" ? x : x,
          y: direction === "none" ? 0 : direction === "start" || direction === "end" ? 0 : y,
          filter: blur ? "blur(8px)" : "blur(0px)",
        },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduced ? 0.3 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}
