"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Video, Users, ArrowLeft, HelpCircle } from "lucide-react";
import { TEACHING, FAQ } from "@/lib/site";
import { IMG } from "@/lib/images";
import { SectionHeader } from "./section-header";
import { MaskedImage } from "@/components/motion/masked-image";
import { Reveal } from "@/components/motion/reveal";
import { SplitWords } from "@/components/motion/split-words";
import { Magnetic } from "@/components/motion/magnetic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const formatIcons = [MapPin, Video, Users];

export function Teaching() {
  return (
    <section id="teaching" aria-label="آموزش ویولن" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeader number={TEACHING.number} label={TEACHING.label} title={TEACHING.title} />

        <div className="mt-16 grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ستونِ چپ (RTL) — سطرِ اول؛ پرسش‌ها در سطرِ دومِ همین ستون می‌آیند تا
            ستونِ sticky سمتِ راست، در spanِ دو سطر، در کلِ ارتفاعِ بخش پین بماند */}
        <div className="lg:col-start-1 lg:row-start-1">
            {/* philosophy quote */}
            <blockquote className="relative border-r-2 border-gold/60 pr-6 md:pr-8">
              <SplitWords
                as="p"
                text={TEACHING.quote}
                className="font-amiri text-xl leading-[2.1] text-ivory/90 md:text-2xl md:leading-[2.1]"
                from="fade"
                stagger={0.045}
              />
            </blockquote>

            <Reveal delay={0.15} className="mt-8">
              <p className="max-w-xl text-[15px] leading-[2.15] text-ivory/80 md:text-ivory/65">{TEACHING.lead}</p>
            </Reveal>

            {/* levels — برشِ افقی تا جهشِ ورودِ کارت‌ها (x منفیِ موقت) اسکرولِ افقیِ ناخواسته نسازد؛
                ستونِ sticky در ستونِ gridِ کناری است و از این برش اثری نمی‌گیرد */}
            <div className="mt-14 space-y-4 overflow-x-clip">
              {TEACHING.levels.map((level, i) => (
                <motion.div
                  key={level.no}
                  initial={{ opacity: 0, x: -32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden border border-gold/12 bg-[#120d08] p-6 transition-colors duration-700 hover:border-gold/35 md:p-7"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 right-0 w-[3px] origin-top scale-y-0 bg-gold transition-transform duration-700 group-hover:scale-y-100"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-4">
                      <span className="font-amiri text-2xl text-gold/70">{level.no}</span>
                      <h4 className="font-display text-xl font-bold text-ivory md:text-2xl">{level.title}</h4>
                    </div>
                    <span className="text-[11px] tracking-[0.15em] text-gold/70">{level.detail}</span>
                  </div>
                  <p className="mt-4 max-w-lg text-[13.5px] leading-[2] text-ivory/78 md:text-ivory/60">{level.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* image + formats + cta — در دسکتاپ دو سطر را span می‌کند تا sticky
              در کلِ ارتفاعِ grid (سطح‌ها + پرسش‌ها) بالای صفحه بماند */}
          <div className="space-y-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-28">
            <MaskedImage
              src={IMG.teaching}
              alt={TEACHING.imageAlt}
              className="relative aspect-[4/3] w-full"
              inset={12}
              parallax={28}
              sizes="(max-width: 1024px) 92vw, 44vw"
            />

            {/* formats */}
            <div className="grid grid-cols-3 gap-3">
              {TEACHING.formats.map((f, i) => {
                const Icon = formatIcons[i];
                return (
                  <Reveal key={f.title} delay={i * 0.1} distance={24}>
                    <div className="group flex h-full flex-col items-center gap-3 border border-gold/12 bg-[#120d08] px-3 py-6 text-center transition-colors duration-700 hover:border-gold/35">
                      <Icon className="h-5 w-5 text-gold/80 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.5} />
                      <span className="font-display text-[15px] font-bold text-ivory">{f.title}</span>
                      <span className="text-[11px] leading-5 text-muted-foreground">{f.desc}</span>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* CTA */}
            <Reveal delay={0.2}>
              <Magnetic className="block">
                <button
                  onClick={() => go("contact")}
                  data-cursor-label="رزرو"
                  className="group relative flex w-full items-center justify-between overflow-hidden border border-gold/50 px-7 py-5 transition-colors duration-500"
                >
                  <span className="z-10 flex items-center gap-3 font-display text-base font-bold text-gold transition-colors duration-500 group-hover:text-ink">
                    {TEACHING.cta}
                    <ArrowLeft className="h-4.5 w-4.5 transition-transform duration-500 group-hover:-translate-x-1.5" />
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0"
                  />
                </button>
              </Magnetic>
            </Reveal>
          </div>

          {/* ——— پرسش‌های پرتکرار ——— در دسکتاپ: سطرِ دومِ ستونِ چپ (زیر سطح‌ها)
              تا ستونِ تصویرِ sticky هم‌زمان با مرورِ پرسش‌ها هم‌چنان پین باشد.
              در موبایل: همان ترتیبِ پیشین (پس از کارتِ CTA) باقی می‌ماند. */}
          <Reveal delay={0.1} className="mt-24 md:mt-32 lg:col-start-1 lg:row-start-2 lg:mt-0">
          <div className="mb-8 flex items-center gap-4" aria-hidden>
            <HelpCircle className="h-4 w-4 text-gold/70" strokeWidth={1.5} />
            <h3 className="font-display text-2xl font-bold text-ivory md:text-3xl">{FAQ.title}</h3>
            <span className="h-px flex-1 bg-gradient-to-l from-gold/30 to-transparent" />
          </div>
          <Accordion
            type="single"
            collapsible
            dir="rtl"
            className="border-t border-gold/12 [&>div]:border-b [&>div]:border-gold/12"
          >
            {FAQ.items.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="group border-none">
                <AccordionTrigger
                  className="gap-4 px-1 py-6 text-right hover:no-underline [&>svg]:ml-0 [&>svg]:mr-auto [&[data-state=open]>svg]:text-gold"
                >
                  <span className="flex items-baseline gap-4 text-right">
                    <span className="font-amiri text-lg leading-none text-gold/60 transition-colors duration-300 group-hover:text-gold">
                      {(i + 1).toLocaleString("fa-IR")}
                    </span>
                    <span className="font-display text-[15px] font-bold leading-7 text-ivory/90 transition-colors duration-300 group-hover:text-ivory md:text-base md:leading-7">
                      {item.q}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pr-9 pb-7 md:pr-11">
                  <p className="max-w-3xl text-[13.5px] leading-[2.1] text-ivory/78 md:text-ivory/60">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
