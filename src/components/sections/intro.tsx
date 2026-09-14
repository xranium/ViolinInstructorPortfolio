"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { INTRO } from "@/lib/site";
import { IMG } from "@/lib/images";
import { SectionHeader } from "./section-header";
import { MaskedImage } from "@/components/motion/masked-image";
import { Reveal } from "@/components/motion/reveal";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      const id = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(id);
    }
    const duration = 1600;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  const fa = String(display).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  return (
    <span ref={ref} className="font-display text-4xl font-extrabold text-gold md:text-5xl">
      {fa}
      {suffix}
    </span>
  );
}

export function Intro() {
  return (
    <section id="intro" aria-label="معرفی" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeader number={INTRO.number} label={INTRO.label} title={INTRO.title} />

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* editorial image */}
          <MaskedImage
            src={IMG.hands}
            alt={INTRO.imageCaption}
            className="relative aspect-[4/3] w-full"
            inset={14}
            parallax={36}
            caption={INTRO.imageCaption}
            sizes="(max-width: 1024px) 92vw, 42vw"
          />

          {/* text column */}
          <div className="lg:pt-6">
            <Reveal>
              <p className="text-lg leading-[2.2] text-ivory/95 md:text-xl md:leading-[2.2] md:text-ivory/85">
                {INTRO.lead}
              </p>
            </Reveal>
            <div className="mt-8 space-y-6">
              {INTRO.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.12 * (i + 1)}>
                  <p className="text-[15px] leading-[2.15] text-ivory/80 md:text-ivory/65">{p}</p>
                </Reveal>
              ))}
            </div>

            {/* stats */}
            <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {INTRO.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.1} direction="up" distance={30}>
                  <div className="border-t border-gold/15 pt-5">
                    <Counter value={s.value} suffix={s.suffix} />
                    <p className="mt-2.5 text-[12px] leading-5 text-muted-foreground">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
