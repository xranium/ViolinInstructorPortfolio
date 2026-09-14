"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TIMELINE } from "@/lib/site";
import { SectionHeader } from "./section-header";

/** تبدیل رقم به فارسی */
const fa = (n: number) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/** فیلتر موضوعی خط‌زمان — «همه» + برچسب‌های یکتا به ترتیبِ ظهور */
const FILTERS = ["همه", ...Array.from(new Set(TIMELINE.items.map((i) => i.tag)))];

/** مسیرِ ریل (خط طلایی) بر اساسِ اندازهٔ صفحه — منطقِ مشترکِ ریل و گره */
const railOffset = "right-[19px] md:right-[calc(3.5rem+19px)]";

/**
 * Cinematic vertical timeline — a golden "string" draws itself downward
 * as you scroll, milestones light up progressively. Filterable by tag.
 */
export function Timeline() {
  const [filter, setFilter] = useState<string>("همه");
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });

  const rawHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineHeight = useSpring(rawHeight, { stiffness: 60, damping: 20 });

  const items = useMemo(
    () => (filter === "همه" ? TIMELINE.items : TIMELINE.items.filter((i) => i.tag === filter)),
    [filter],
  );

  return (
    <section id="achievements" aria-label="دستاوردها" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeader number={TIMELINE.number} label={TIMELINE.label} title={TIMELINE.title} />

        {/* فیلتر موضوعی — قرص‌های لبه‌تیزِ هم‌خانوادهٔ فیلترهای پنل مدیر */}
        <div role="tablist" aria-label="فیلتر موضوعی مسیر" className="mt-10 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f;
            const count = f === "همه" ? TIMELINE.items.length : TIMELINE.items.filter((i) => i.tag === f).length;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 border px-3.5 py-3.5 text-[11px] transition-colors duration-500 ${
                  active
                    ? "border-gold/70 bg-gold/15 text-gold"
                    : "border-gold/20 text-ivory/50 hover:border-gold/40 hover:text-ivory/80"
                }`}
              >
                {f}
                <span className={`font-amiri text-[10px] leading-none ${active ? "text-gold/80" : "text-ivory/30"}`}>
                  {fa(count)}
                </span>
              </button>
            );
          })}
        </div>

        <div ref={ref} className="relative mt-16 overflow-x-clip md:mt-20">
          {/* the golden string (rail) — placed on the right for RTL reading flow */}
          <div aria-hidden className={`absolute top-0 h-full w-px bg-ivory/10 ${railOffset}`}>
            <motion.div
              style={{ height: reduced ? "100%" : lineHeight }}
              className="w-full origin-top bg-gradient-to-b from-gold/90 via-gold/60 to-gold/30"
            />
          </div>

          <ol className="space-y-14 md:space-y-20">
            {items.map((item, i) => (
              <TimelineItem key={item.year} item={item} index={i} reduced={reduced} />
            ))}
          </ol>

          {/* یادداشتِ دمِ فیلتر — وقتی چیزی جز «همه» برجسته است */}
          {filter !== "همه" && (
            <p className="mt-10 flex items-center gap-2 text-[11px] tracking-[0.15em] text-gold/60">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {fa(items.length)} ایستگاه از روایتِ {filter}
              <button
                type="button"
                onClick={() => setFilter("همه")}
                className="link-sweep mr-2 border-b border-gold/40 pb-0.5 text-[11px] text-gold/80 transition-colors hover:text-gold-bright"
              >
                دیدنِ همه
              </button>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  item,
  index,
  reduced,
}: {
  item: (typeof TIMELINE.items)[number];
  index: number;
  reduced: boolean | null;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "start 0.45"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.28, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -36, 0]);

  return (
    <motion.li
      ref={ref}
      style={{ opacity: reduced ? 1 : opacity }}
      className="group relative pr-14 md:pr-[calc(3.5rem+2.5rem)]"
    >
      {/* node */}
      <motion.span
        aria-hidden
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.9 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[11px] top-2.5 flex h-[17px] w-[17px] items-center justify-center md:right-[calc(3.5rem+11px)]"
      >
        <span className="absolute inset-0 rounded-full border border-gold/40 transition-all duration-700 group-hover:scale-125 group-hover:border-gold" />
        <span className="h-[5px] w-[5px] rounded-full bg-gold shadow-[0_0_12px_rgba(201,164,92,0.8)]" />
      </motion.span>

      <motion.div style={{ x: reduced ? 0 : x }} className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <span className="font-amiri text-3xl leading-none text-gold/90 transition-colors duration-500 group-hover:text-gold-bright md:text-4xl">
          {item.year}
        </span>
        <span className="border border-gold/25 px-2.5 py-0.5 text-[10px] tracking-[0.2em] text-gold/70">
          {item.tag}
        </span>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 font-display text-2xl font-bold text-ivory md:text-[1.7rem]"
      >
        <span className="hover-nudge">{item.title}</span>
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3.5 max-w-xl text-[14px] leading-[2.1] text-ivory/80 md:text-ivory/60"
      >
        {item.text}
      </motion.p>

      {/* subtle index number watermark — گرادیانِ گرمِ محو، هم‌خانوادهٔ اعدادِ سرصفحه‌ها */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 left-0 select-none bg-gradient-to-b from-ivory/[0.07] via-gold/[0.06] to-ember/[0.05] bg-clip-text font-display text-[5.5rem] font-extrabold leading-none text-transparent md:text-[7rem]"
      >
        {String(index + 1).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])}
      </span>
    </motion.li>
  );
}
