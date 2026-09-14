"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useMotionValue } from "framer-motion";
import { ChevronRight, Send, MessageCircle, MessageSquareHeart } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site";
import { SectionHeader } from "./section-header";
import { Reveal } from "@/components/motion/reveal";
import { Corners } from "@/components/motion/corners";

/** فاصلهٔ پیشرویِ خودکارِ نقل‌قول‌ها (میلی‌ثانیه) */
const AUTOPLAY_MS = 7000;

/**
 * «کشیدن» با Pointer Events:
 * تغییرِ نظر فقط با حرکتِ افقیِ ≥ ۴۸px که بر عمودش غالب باشد (|dx| > |dy|×۱.۵)؛
 * بازخوردِ دیداریِ کشیدن از ۲۴px آغاز می‌شود و با ضریبِ ۰.۲۵ تا سقفِ ۶۰px انگشت را دنبال می‌کند.
 */
const SWIPE_COMMIT_PX = 48;
const DRAG_START_PX = 24;
const DRAG_FOLLOW = 0.25;
const DRAG_MAX_PX = 60;

/** شکلِ واحدِ یک نظر — همهٔ نظرات از TESTIMONIALS.items در src/lib/site.ts خوانده می‌شوند */
interface QuoteItem {
  quote: string;
  name: string;
  role: string;
}

/** آیکنِ هر پیام‌رسان — کلیدها باید با idهای TESTIMONIALS.share.channels یکی باشند */
const CHANNEL_ICONS = {
  telegram: Send,
  whatsapp: MessageCircle,
  bale: MessageSquareHeart,
} as const;

/**
 * «کاهشِ حرکت» — برخلافِ هوکِ فریمر که فقط لحظهٔ mount را می‌خواند،
 * به تغییرِ زندهٔ تنظیماتِ سیستم هم واکنش نشان می‌دهد.
 */
function useLiveReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    const t = window.setTimeout(sync, 0);
    mq.addEventListener("change", sync);
    return () => {
      window.clearTimeout(t);
      mq.removeEventListener("change", sync);
    };
  }, []);
  return reduced;
}

const fa = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/**
 * Testimonials — نظراتِ هنرجویان:
 *  · نظرات ایستا از site.ts (مدیریتِ دستی — افزودن/ویرایش در همان فایل)؛
 *  · پیشرویِ خودکار با کنترلِ دستی، کشیدنِ لمسی و کلیدهای جهت‌دار؛
 *  · دعوت به اشتراک‌گذاریِ تجربه از سه پیام‌رسان (تلگرام / واتس‌اپ / بله).
 */
export function Testimonials() {
  /* نظرات — مستقیم از site.ts؛ هیچ درخواستِ شبکه‌ای در کار نیست */
  const items = TESTIMONIALS.items as readonly QuoteItem[];

  const total = items.length;
  const [index, setIndex] = useState(0);

  /* توقفِ پیشرویِ خودکار — با هاورِ موس یا هنگامِ کشیدنِ اشاره‌گر؛ هر دو با یک پرچمِ مشترکِ «paused» */
  const [hoverPaused, setHoverPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const paused = hoverPaused || dragging;

  useEffect(() => {
    if (paused || total < 2) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, total]);

  /* نوارِ پیشرفتِ پیشرویِ خودکار — هم‌گام با تایمرِ بالا؛ با هاور یا کشیدنِ کارت منجمد می‌شود.
     هر تغییرِ «index» (دکمه، نقطه، کلید یا کشیدن) وابستگیِ افکت را عوض می‌کند و نوار از صفر آغاز می‌شود. */
  const reduced = useLiveReducedMotion();
  const progress = useMotionValue(0);
  const bar = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (reduced || total < 2) {
      bar.current?.stop();
      return;
    }
    if (paused) {
      bar.current?.pause();
      return;
    }
    /* آغازِ تازهٔ نوار — درست مثل تایمرِ هفت‌ثانیه‌ایِ بالا */
    progress.set(0);
    bar.current?.stop();
    bar.current = animate(progress, 1, { duration: AUTOPLAY_MS / 1000, ease: "linear" });
  }, [index, paused, reduced, progress, total]);

  /* توقفِ نهایی هنگامِ حذفِ بخش */
  useEffect(() => () => bar.current?.stop(), []);

  /* ——— کشیدنِ افقی (لمس/موس) ———
     نقطهٔ شروع فقط «ثبت» می‌شود و preventDefault نمی‌کنیم تا کلیک و انتخابِ متن سالم بمانند؛
     شنونده‌های move/up/cancel فقط در طولِ کشیدن روی window زنده‌اند و در پایان یا unmount حذف می‌شوند. */
  const [dragX, setDragX] = useState(0);
  const startRef = useRef<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      const s = startRef.current;
      if (!s || e.pointerId !== s.id) return;
      if (reduced) return; /* «کاهشِ حرکت»: بازخوردِ جابه‌جایی حذف می‌شود، خودِ حرکت نه */
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.abs(dx) > DRAG_START_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
        setDragX(Math.max(-DRAG_MAX_PX, Math.min(DRAG_MAX_PX, dx * DRAG_FOLLOW)));
      } else {
        setDragX(0);
      }
    };

    const onEnd = (e: PointerEvent) => {
      const s = startRef.current;
      if (!s || e.pointerId !== s.id) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      const commit = Math.abs(dx) >= SWIPE_COMMIT_PX && Math.abs(dx) > Math.abs(dy) * 1.5;
      startRef.current = null;
      setDragging(false);
      setDragX(0); /* بازگشتِ فنری — «اسلایدِ» نقل‌قول را خودِ AnimatePresence انجام می‌دهد */
      if (commit) {
        /* چیدمانِ RTL: کشیدن به «راست» (مثل ورق‌زدنِ کتابِ فارسی) = نظرِ بعدی؛ به چپ = قبلی */
        setIndex((i) => (dx > 0 ? (i + 1) % total : (i - 1 + total) % total));
      }
    };

    const onCancel = (e: PointerEvent) => {
      const s = startRef.current;
      if (!s || e.pointerId !== s.id) return;
      startRef.current = null;
      setDragging(false);
      setDragX(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [dragging, reduced, total]);

  const item = items[Math.min(index, total - 1)];

  return (
    <section id="testimonials" aria-label="نظرات هنرجویان" className="relative bg-[#0e0a06] py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <SectionHeader number={TESTIMONIALS.number} label={TESTIMONIALS.label} title={TESTIMONIALS.title} align="center" />

        <div
          className="relative mt-20 touch-pan-y md:mt-24"
          role="group"
          aria-label="نقل‌قول‌ها — با کلیدهای جهت‌دار جابه‌جا شوید"
          tabIndex={0}
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
          onPointerDown={(e) => {
            if (startRef.current) return; /* یک اشاره‌گر در هر لحظه */
            if (e.pointerType === "mouse" && e.button !== 0) return;
            startRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
            setDragging(true); /* تا رهاشدنِ اشاره‌گر، پیشرویِ خودکار می‌ایستد */
          }}
          onKeyDown={(e) => {
            /* قراردادِ RTL — همانِ لایت‌باکسِ گالری: ArrowLeft = بعدی، ArrowRight = قبلی؛ Home/End = اولی/آخری */
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setIndex((i) => (i + 1) % total);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              setIndex((i) => (i - 1 + total) % total);
            } else if (e.key === "Home") {
              e.preventDefault();
              setIndex(0);
            } else if (e.key === "End") {
              e.preventDefault();
              setIndex(total - 1);
            }
          }}
        >
          {/* giant quote mark — با هر تغییرِ نظر، نرم و آرام از نو می‌دمد */}
          <motion.span
            key={index}
            aria-hidden
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute -top-16 right-1/2 select-none font-amiri text-[8rem] leading-none text-gold/[0.08] md:right-0 md:-top-20 md:text-[11rem]"
          >
            «
          </motion.span>

          {/* پوششِ بازخوردِ کشیدن — جابه‌جاییِ نرمِ x با فنر، جدا از انیمیشنِ ورود/خروجِ خودِ نقل‌قول */}
          <motion.div
            animate={{ x: dragX }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="relative min-h-[300px] md:min-h-[260px]"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -26, filter: "blur(6px)" }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="text-center md:px-10"
              >
                <p className="font-amiri text-[22px] leading-[2.2] text-ivory/95 md:text-2xl md:leading-[2.2] md:text-ivory/90">
                  {item.quote}
                </p>
                <footer className="mt-9 flex flex-col items-center gap-2">
                  <span className="h-px w-14 bg-gold/50" />
                  <cite className="font-display text-[17px] font-bold not-italic text-ivory md:text-base">
                    {item.name}
                  </cite>
                  <span className="text-[12px] tracking-[0.2em] text-gold/70 md:text-[11px]">{item.role}</span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </motion.div>

          {/* controls */}
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              aria-label="نظر قبلی"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-all duration-500 hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>

            <span className="text-[13px] tracking-[0.3em] text-muted-foreground md:text-[12px]">
              {fa(index + 1)} / {fa(total)}
            </span>

            <button
              onClick={() => setIndex((i) => (i + 1) % total)}
              aria-label="نظر بعدی"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-all duration-500 hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-4.5 w-4.5 rotate-180" />
            </button>
          </div>

          {/* progress dots */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5" role="tablist" aria-label="انتخاب نظر">
            {items.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`نظر ${fa(i + 1)}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-700 ${
                  i === index ? "w-8 bg-gold" : "w-1.5 bg-ivory/25 hover:bg-ivory/50"
                }`}
              />
            ))}
          </div>

          {/* راهنمای کشیدن — فقط عرضِ موبایل، همیشه حاضر و کم‌رنگ */}
          <p aria-hidden="true" className="mt-5 select-none text-center text-[11px] text-ivory/40 md:hidden md:text-[10px] md:text-ivory/35">
            برای دیدن نظرهای بیشتر، انگشت خود را بکشید
          </p>

          {/* نوارِ پیشرفتِ پیشرویِ خودکار — ۷ ثانیه، از راست (RTL) */}
          {!reduced && total >= 2 && (
            <div aria-hidden className="mx-auto mt-10 h-0.5 w-40">
              <motion.div
                initial={{ scaleX: 0 }}
                style={{ scaleX: progress }}
                className="h-full w-full origin-right bg-gradient-to-l from-gold via-gold/60 to-transparent"
              />
            </div>
          )}
        </div>

        {/* ——— دعوت به اشتراک‌گذاریِ تجربه (جایگزینِ فرمِ ارسالِ نظر) ——— */}
        <ShareCta />
      </div>
    </section>
  );
}

/* ————— دعوت به اشتراک‌گذاریِ تجربه —————
   دکمهٔ اصلی (ctaHref) + سه دکمهٔ پیام‌رسان: تلگرام / واتس‌اپ / بله.
   نشانی‌ها از TESTIMONIALS.share در src/lib/site.ts خوانده می‌شوند. */
function ShareCta() {
  const S = TESTIMONIALS.share;

  return (
    <Reveal className="mt-16 md:mt-20">
      <div className="relative mx-auto max-w-2xl border border-gold/20 bg-gradient-to-b from-[#141009] to-[#0e0a06] p-7 text-center md:p-10">
        <Corners />

        {/* نشانِ تزئینی */}
        <span aria-hidden className="mx-auto flex h-12 w-12 items-center justify-center border border-gold/40 bg-gold/10">
          <MessageSquareHeart className="h-5 w-5 text-gold" strokeWidth={1.5} />
        </span>

        {/* دکمهٔ اصلی — کلِ جمله، یک دعوتِ کلیکی */}
        <a
          href={S.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-label="اشتراکِ تجربه"
          className="group mt-6 block"
        >
          <h3 className="font-display text-[17px] font-bold leading-[2.1] text-ivory transition-colors duration-500 group-hover:text-gold md:text-[19px]">
            {S.title}
          </h3>
          <span
            aria-hidden
            className="mx-auto mt-5 block h-px w-16 bg-gold/50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-32 group-hover:bg-gold"
          />
        </a>

        {/* سه پیام‌رسان — تلگرام / واتس‌اپ / بله */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {S.channels.map((ch) => {
            const Icon = CHANNEL_ICONS[ch.id];
            return (
              <a
                key={ch.id}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ch.hint}
                title={ch.hint}
                data-cursor-label={ch.label}
                className="group flex min-w-36 items-center justify-center gap-2.5 border border-gold/25 px-6 py-3.5 text-[13px] tracking-wider text-ivory/85 transition-all duration-500 hover:border-gold hover:bg-gold/5 hover:text-gold"
              >
                <Icon
                  className="h-4.5 w-4.5 shrink-0 text-gold/70 transition-colors duration-500 group-hover:text-gold"
                  strokeWidth={1.5}
                />
                {ch.label}
              </a>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
