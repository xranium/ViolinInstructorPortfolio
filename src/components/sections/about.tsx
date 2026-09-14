"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ABOUT } from "@/lib/site";
import { IMG } from "@/lib/images";
import { SectionHeader } from "./section-header";
import { MaskedImage } from "@/components/motion/masked-image";
import { Reveal } from "@/components/motion/reveal";
import { SplitWords } from "@/components/motion/split-words";

export function About() {
  const quoteRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: quoteRef, offset: ["start end", "end start"] });
  const quoteX = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" aria-label="درباره من" className="relative overflow-hidden bg-[#0e0a06] py-28 md:py-40">
      {/* faint strings backdrop */}
      <div className="strings-field opacity-25" aria-hidden>
        <span className="string-line" />
        <span className="string-line" style={{ animationDelay: "-3s" }} />
        <span className="string-line" style={{ animationDelay: "-1.5s" }} />
        <span className="string-line" style={{ animationDelay: "-4.5s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
          {/* text column */}
          <div>
            <SectionHeader number={ABOUT.number} label={ABOUT.label} title={ABOUT.title} />

            <div className="mt-12 space-y-7">
              {ABOUT.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p className="text-[15px] leading-[2.2] text-ivory/85 md:text-ivory/70">{p}</p>
                </Reveal>
              ))}
            </div>

            {/* facts */}
            <dl className="mt-14 space-y-0 border-t border-gold/10">
              {ABOUT.facts.map((f, i) => (
                <Reveal key={f.term} delay={i * 0.12}>
                  <div className="group grid grid-cols-[110px_1fr] gap-4 border-b border-gold/10 py-5 transition-colors hover:border-gold/30 sm:grid-cols-[150px_1fr]">
                    <dt className="text-[11px] tracking-[0.25em] text-gold/80 transition-colors duration-500 group-hover:text-gold">{f.term}</dt>
                    <dd className="text-[14px] leading-8 text-ivory/80">{f.value}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          {/* editorial portrait */}
          <div className="relative">
            <MaskedImage
              src={IMG.about}
              alt={ABOUT.portraitAlt}
              className="relative mx-auto aspect-[9/14] w-full max-w-md"
              inset={16}
              parallax={56}
              sizes="(max-width: 1024px) 92vw, 44vw"
            />
            {/* signature */}
            <Reveal delay={0.4} direction="start" distance={28}>
              <div className="relative mx-auto -mt-8 flex w-full max-w-md items-center justify-end gap-4 pb-2">
                <span className="h-px w-16 bg-gold/40" />
                <span className="font-amiri text-3xl text-gold/90">{ABOUT.signature}</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* philosophical quote with parallax drift */}
        <div ref={quoteRef} className="relative mt-28 md:mt-36">
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -top-14 right-0 select-none font-amiri text-[9rem] leading-none text-gold/[0.07] md:text-[13rem]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
          >
            «
          </motion.span>
          <motion.blockquote
            style={{ x: reduced ? 0 : quoteX }}
            className="relative mx-auto max-w-3xl text-center"
          >
            <SplitWords
              as="p"
              text={ABOUT.quote}
              className="font-amiri text-2xl leading-[2] text-ivory/90 md:text-[2rem] md:leading-[2]"
              from="fade"
              stagger={0.05}
            />
            <Reveal delay={0.5}>
              <cite className="mt-8 block text-[11px] not-italic tracking-[0.35em] text-gold/70">
                — {ABOUT.signature}، در گفت‌وگو با «هنر فردا»
              </cite>
            </Reveal>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
