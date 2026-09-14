"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AudioLines } from "lucide-react";
import { PLAYABLE_STRINGS } from "@/lib/site";
import { playBowed, type Voice } from "@/lib/audio";

/* ————— کامپوننت: نوارِ سیم‌های تعاملی ————— */

/**
 * چهار سیمِ بازِ ویولن (می، لا، رِ، سل) — با لمس یا عبور اشاره‌گر،
 * صدای آرشه‌مانندِ سنتز‌شده به گوش می‌رسد و سیم به لرزش می‌افتد.
 */
export function PlayableStrings() {
  const [active, setActive] = useState<number | null>(null);
  const voices = useRef<Map<number, Voice>>(new Map());
  const lastTrigger = useRef<number[]>([]);
  const reduced = useReducedMotion();

  const play = useCallback(
    (i: number) => {
      const now = performance.now();
      // جلوگیری از تریگرِ پشت‌سرهمِ همان سیم
      if (now - (lastTrigger.current[i] ?? 0) < 220) return;
      lastTrigger.current[i] = now;

      voices.current.get(i)?.stop();
      const s = PLAYABLE_STRINGS.strings[i];
      voices.current.set(i, playBowed(s.freq, { dur: 1.4 }));

      if (!reduced) {
        setActive(i);
        window.setTimeout(() => setActive((cur) => (cur === i ? null : cur)), 850);
      }
    },
    [reduced],
  );

  useEffect(
    () => () => {
      voices.current.forEach((v) => v.stop());
      voices.current.clear();
    },
    [],
  );

  return (
    <section
      aria-label={PLAYABLE_STRINGS.ariaLabel}
      className="playable-strings relative border-y border-gold/10 bg-[#0d0906]/70 py-10 md:py-14"
    >
      {/* هالهٔ گرم */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse 60% 100% at 50% 50%, #c9a45c 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl px-5 md:px-10">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-1.5 text-center"
        >
          <span className="flex items-center gap-2.5 text-[10px] tracking-[0.4em] text-gold/70">
            <AudioLines className="h-3.5 w-3.5" strokeWidth={1.5} />
            {PLAYABLE_STRINGS.hint}
          </span>
          <p className="text-[11px] text-ivory/45">{PLAYABLE_STRINGS.subhint}</p>
        </motion.header>

        <div className="mt-8 space-y-1">
          {PLAYABLE_STRINGS.strings.map((s, i) => {
            const isActive = active === i;
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => play(i)}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") play(i);
                }}
                aria-label={`سیمِ ${s.note} — برای شنیدن صدا لمس کنید`}
                data-cursor-label={`سیمِ ${s.note}`}
                className="group flex h-12 w-full items-center gap-4 px-1 md:h-13 md:gap-6"
              >
                {/* نام نُت — سمت راست (آغاز خوانش) */}
                <span
                  className={`w-10 shrink-0 text-right font-amiri text-lg transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-ivory/35 group-hover:text-gold/80"
                  }`}
                >
                  {s.note}
                </span>

                {/* سیم */}
                <span className="relative flex-1">
                  <span
                    aria-hidden
                    className={`ps-line ${isActive ? "ps-plucking" : ""}`}
                    style={{ animationDuration: "0.85s" }}
                  />
                  {/* نقطهٔ لمس */}
                  <span
                    aria-hidden
                    className={`absolute top-1/2 right-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold transition-all duration-500 ${
                      isActive ? "scale-150 opacity-100 shadow-[0_0_12px_rgba(201,164,92,0.9)]" : "scale-0 opacity-0"
                    }`}
                  />
                </span>

                {/* فرکانس — سمت چپ */}
                <span
                  dir="ltr"
                  className={`w-16 shrink-0 text-left text-[10px] tracking-[0.15em] transition-colors duration-300 ${
                    isActive ? "text-gold/80" : "text-ivory/25 group-hover:text-gold/50"
                  }`}
                >
                  {s.label} · {Math.round(s.freq)}Hz
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
