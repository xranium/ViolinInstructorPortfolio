"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * جداکنندهٔ تزئینی میان بخش‌ها —
 * طرحِ الهام‌گرفته از «صداخروج» (f-hole) ویولن در دو سو،
 * با خط‌های موییِ طلایی و لوزی‌های کوچک.
 */
export function Ornament({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scaleX: 0.6 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.9 }}
      transition={{ duration: reduced ? 0 : 1.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center justify-center gap-5 py-2 md:gap-7 ${className}`}
    >
      {/* خط مویی راست */}
      <Hairline />

      {/* لوزی کوچک */}
      <span className="h-1.5 w-1.5 rotate-45 border border-gold/50" />

      {/* f-hole راست */}
      <Fhole className="scale-x-[-1]" />

      {/* لوزی میانی — هستهٔ درخشان */}
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className="absolute inset-0 rotate-45 border border-gold/70" />
        <span className="h-0.5 w-0.5 rotate-45 bg-gold shadow-[0_0_8px_rgba(201,164,92,0.9)]" />
      </span>

      {/* f-hole چپ */}
      <Fhole />

      {/* لوزی کوچک */}
      <span className="h-1.5 w-1.5 rotate-45 border border-gold/50" />

      {/* خط مویی چپ */}
      <Hairline />
    </motion.div>
  );
}

/* ————— خط موییِ گرادیانی ————— */
function Hairline() {
  return (
    <span
      className="h-px w-16 md:w-24"
      style={{
        background:
          "linear-gradient(to left, transparent, rgba(201,164,92,0.45))",
      }}
    />
  );
}

/* ————— صداخروجِ سیلوئتی ————— */
function Fhole({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 64"
      className={`h-10 w-4 text-gold/60 md:h-12 md:w-[18px] ${className}`}
      fill="none"
      aria-hidden
    >
      {/* تنهٔ اصلی — S پیوسته */}
      <path
        d="M13 4 C 8 12, 16 18, 12 26 C 8 34, 16 40, 12 48 C 9 54, 14 58, 12 60"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* ناودانِ بالایی */}
      <circle cx="13" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.1" />
      {/* ناودانِ پایینی */}
      <circle cx="12" cy="59.5" r="1.8" stroke="currentColor" strokeWidth="1.1" />
      {/* بریدگی‌های عرضی (به سبک f-hole واقعی) */}
      <path d="M7 24 h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M13 38 h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
