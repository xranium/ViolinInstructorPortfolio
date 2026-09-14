"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * نوار پیشرفتِ اسکرول — خطِ طلاییِ نازک در لبهٔ بالای صفحه.
 * در RTL از راست پر می‌شود.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="scroll-progress fixed inset-x-0 top-0 z-[80] h-[2px] origin-right bg-gradient-to-l from-gold via-gold-bright to-gold/80 shadow-[0_0_10px_rgba(201,164,92,0.65)]"
    />
  );
}
