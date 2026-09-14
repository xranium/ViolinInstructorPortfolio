"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SplitWords } from "@/components/motion/split-words";

type Props = {
  number: string;
  label: string;
  title: string;
  className?: string;
  align?: "start" | "center";
};

export function SectionHeader({ number, label, title, className, align = "start" }: Props) {
  const reduced = useReducedMotion();
  const centered = align === "center";
  return (
    <div className={`relative ${centered ? "text-center" : ""} ${className ?? ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`mb-5 flex items-center gap-4 ${centered ? "justify-center" : ""}`}
      >
        <span className="bg-gradient-to-b from-gold-bright via-gold to-ember/70 bg-clip-text font-amiri text-lg leading-none text-transparent">
          {number}
        </span>
        <span className="h-px w-12 bg-gold/40" />
        <span className="text-[11px] font-medium tracking-[0.35em] text-gold/90">{label}</span>
      </motion.div>
      <SplitWords
        as="h2"
        text={title}
        className={`font-display text-4xl font-extrabold leading-[1.25] text-ivory md:text-5xl md:leading-[1.25] ${
          centered ? "mx-auto max-w-3xl" : "max-w-2xl"
        }`}
        from="bottom"
        stagger={0.06}
      />
      {!reduced && (
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-6 block h-px origin-right bg-gradient-to-l from-gold/50 to-transparent ${
            centered ? "mx-auto w-40" : "w-56"
          }`}
        />
      )}
    </div>
  );
}
