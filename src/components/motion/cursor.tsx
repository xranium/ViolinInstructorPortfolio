"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

function subscribeMedia(callback: () => void) {
  const fine = window.matchMedia("(pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  fine.addEventListener("change", callback);
  reduced.addEventListener("change", callback);
  return () => {
    fine.removeEventListener("change", callback);
    reduced.removeEventListener("change", callback);
  };
}

/**
 * Custom cursor: a small gold dot + trailing ring that expands over interactive elements.
 * Only rendered for fine pointers without reduced-motion.
 */
export function CustomCursor() {
  const enabled = useSyncExternalStore(
    subscribeMedia,
    () =>
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], [data-cursor='hover'], input, textarea, select, label");
      setHovering(!!interactive);
      const labeled = target.closest<HTMLElement>("[data-cursor-label]");
      setLabel(labeled?.dataset.cursorLabel ?? null);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="cursor-layer pointer-events-none fixed inset-0 z-[100]">
      {/* dot */}
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-gold"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: pressed ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
      {/* trailing ring */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full border border-gold/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? (label ? 72 : 52) : 30,
          height: hovering ? (label ? 72 : 52) : 30,
          opacity: hovering ? 1 : 0.55,
          backgroundColor: label ? "rgba(201,164,92,0.92)" : "rgba(201,164,92,0)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <AnimatePresence>
          {label && hovering ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="select-none text-[10px] font-medium text-ink"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
