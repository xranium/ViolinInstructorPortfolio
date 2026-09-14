"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { FOOTER, PERSON, NAV_LINKS } from "@/lib/site";
import { Magnetic } from "@/components/motion/magnetic";

/* محیطِ حلقهٔ پیشرفتِ اسکرول روی دکمهٔ «بازگشت به بالا» — دایرهٔ r=۲۶ در viewBox ۵۶ (۲π×۲۶ ≈ ۱۶۳٫۴) */
const RING_C = 2 * Math.PI * 26;

export function Footer() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const tz = new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tehran",
      }).format(now);
      setTime(tz);
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  const { scrollYProgress } = useScroll();

  /* حلقهٔ پیشرفتِ اسکرولِ دکمهٔ «بالا» — هم‌فنرِ نوارِ پیشرفتِ بالای صفحه (راند ۱)؛
     در صدرِ صفحه خالی و در انتهای صفحه کامل می‌شود. */
  const ringProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const ringDash = useTransform(ringProgress, (v) => RING_C - v * RING_C);

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-gold/10 bg-[#0a0705]">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-10 md:pt-20">
        {/* big name finale */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display text-[13vw] font-extrabold leading-none text-ivory/[0.07] md:text-[8rem]"
          aria-hidden
        >
          {PERSON.name}
        </motion.p>

        <div className="mt-10 grid gap-10 border-t border-gold/10 pt-10 md:grid-cols-3">
          {/* brand */}
          <div>
            <p className="font-display text-lg font-bold text-ivory">{PERSON.name}</p>
            <p className="mt-2 text-[12px] leading-6 text-muted-foreground">{FOOTER.tagline}</p>
            <p className="mt-4 flex items-center gap-2 text-[11px] tracking-[0.2em] text-gold/60">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold/70" />
              اصفهان — <span className="font-amiri tabular-nums">{time}</span>
            </p>
          </div>

          {/* nav */}
          <nav aria-label="ناوبری پابرگ" className="flex flex-col items-start gap-2.5 md:items-center">
            {NAV_LINKS.slice(0, 5).map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="link-sweep text-[12px] text-ivory/80 transition-colors hover:text-gold md:text-ivory/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* back to top */}
          <div className="flex items-start justify-start md:items-center md:justify-end">
            <Magnetic strength={0.25}>
              <button
                onClick={toTop}
                data-cursor-label="بالا"
                aria-label="بازگشت به بالای صفحه"
                className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 transition-colors duration-500 hover:border-gold"
              >
                {/* حلقهٔ پیشرفتِ اسکرول — تزئینی، داخلِ دکمه و درونی‌تر از قابِ آن */}
                <svg aria-hidden viewBox="0 0 56 56" className="absolute inset-0 -rotate-90">
                  <defs>
                    <linearGradient id="top-ring-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-gold-bright)" />
                      <stop offset="50%" stopColor="var(--color-gold)" />
                      <stop offset="100%" stopColor="var(--color-ember)" />
                    </linearGradient>
                  </defs>
                  <circle cx={28} cy={28} r={26} fill="none" strokeWidth={1.5} className="stroke-gold/15" />
                  <motion.circle
                    cx={28}
                    cy={28}
                    r={26}
                    fill="none"
                    strokeWidth={1.5}
                    stroke="url(#top-ring-grad)"
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    style={{ strokeDashoffset: ringDash }}
                  />
                </svg>
                <ArrowUp className="h-5 w-5 text-gold/80 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.5} />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* نقطهٔ تزئینی بالای پابرگ */}
        <div className="flex justify-center py-1">
          <span className="h-1.5 w-1.5 rotate-45 border border-gold/40" />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gold/10 pt-6 text-[11px] text-muted-foreground/70 sm:flex-row">
          <p>{FOOTER.copyright}</p>
          <p className="flex items-center gap-2">
            <span className="h-px w-6 bg-gold/30" />
            {FOOTER.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
