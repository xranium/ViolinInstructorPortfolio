"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { HERO } from "@/lib/site";
import { IMG } from "@/lib/images";
import { SplitWords } from "@/components/motion/split-words";
import { Magnetic } from "@/components/motion/magnetic";

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // cinematic depth: portrait drifts & dims as you scroll away
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-42%"]);
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      aria-label={HERO.overline}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* ambient warm glow */}
      <div
        aria-hidden
        className="absolute -left-1/4 top-1/4 h-[60vmin] w-[60vmin] rounded-full opacity-[0.22] blur-[110px]"
        style={{ background: "radial-gradient(circle, #8f6e3b 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="absolute -right-1/4 bottom-0 h-[50vmin] w-[50vmin] rounded-full opacity-[0.14] blur-[100px]"
        style={{ background: "radial-gradient(circle, #c9a45c 0%, transparent 65%)" }}
      />

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pb-24 pt-32 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pb-16 lg:pt-24">
        {/* ——— Text column ——— */}
        <motion.div style={{ y: reduced ? 0 : textY, opacity: reduced ? 1 : fade }} className="relative order-2 lg:order-1">
          {/* vertical side text */}
          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1.2 }}
            className="text-vertical absolute -left-6 top-8 hidden select-none text-[10px] tracking-[0.5em] text-gold/45 xl:block"
          >
            {HERO.verticalText}
          </motion.span>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex items-center gap-3 text-[11px] tracking-[0.3em] text-gold/80"
          >
            <span className="inline-block h-px w-10 bg-gold/50" />
            {HERO.overline}
          </motion.p>

          <h1 className="font-display text-[13vw] font-extrabold leading-[1.06] text-ivory sm:text-6xl md:text-7xl xl:text-[5.4rem]">
            <SplitWords as="span" text={HERO.titleLines[0]} delay={0.75} className="block" from="bottom" />
            <SplitWords
              as="span"
              text={HERO.titleLines[1]}
              delay={1.1}
              className="block"
              from="bottom"
              accentWord={HERO.accentWord}
              accentClassName="shimmer-gold"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-xl text-[16px] leading-[2.1] text-ivory/90 md:text-base md:text-ivory/75"
          >
            {HERO.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <button
                onClick={() => go("teaching")}
                data-cursor-label="کلاس‌ها"
                className="group relative overflow-hidden border border-gold/50 bg-gold px-8 py-3.5 text-sm tracking-wider text-ink transition-colors duration-500"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-ivory">
                  {HERO.primaryCta}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0"
                />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => go("contact")}
                data-cursor-label="تماس"
                className="group flex items-center gap-2.5 px-2 py-3.5 text-sm tracking-wider text-ivory/80 transition-colors hover:text-gold"
              >
                <span className="h-px w-8 bg-ivory/40 transition-all duration-500 group-hover:w-12 group-hover:bg-gold" />
                {HERO.secondaryCta}
              </button>
            </Magnetic>
          </motion.div>

          {/* meta row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 1 }}
            className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] tracking-[0.2em] text-muted-foreground"
          >
            <span>{HERO.metaLeft}</span>
            <span className="hidden h-3 w-px bg-gold/25 sm:block" />
            <span className="text-gold/70">{HERO.metaRight}</span>
          </motion.div>
        </motion.div>

        {/* ——— Portrait column ——— */}
        <motion.div
          initial={{ clipPath: "inset(12% 12% 12% 12%)", opacity: 0 }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 mx-auto w-full max-w-sm self-center lg:order-2 lg:max-w-none"
        >
          <motion.div
            style={{ y: reduced ? 0 : imgY, scale: reduced ? 1 : imgScale, opacity: reduced ? 1 : imgOpacity }}
            className="relative aspect-[3/4] overflow-hidden"
          >
            <motion.div
              initial={{ scale: 1.18 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={IMG.hero}
                alt={HERO.portraitAlt}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover object-top"
              />
            </motion.div>
            {/* grade + vignette on portrait */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/25" />
            <div aria-hidden className="absolute inset-0 bg-gold opacity-[0.07] mix-blend-overlay" />
            {/* frame line */}
            <div aria-hidden className="absolute inset-3 border border-ivory/10" />
          </motion.div>

          {/* caption plate */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-5 -left-4 hidden border-r-2 border-gold bg-ink/90 px-4 py-3 backdrop-blur-sm md:block lg:-left-10"
          >
            <p className="font-amiri text-sm leading-7 text-ivory/90"></p>
          </motion.div>
        </motion.div>
      </div>  

      {/* ——— scroll indicator ——— */}
      <motion.button
        onClick={() => go("intro")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        style={{ opacity: reduced ? 1 : fade }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-label="اسکرول به پایین"
      >
        <span className="text-[10px] tracking-[0.4em] text-ivory/50">{HERO.scrollHint}</span>
        <span className="scroll-line" />
      </motion.button>
    </section>
  );
}
