"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { MoveHorizontal, Instagram, X, ChevronRight, ChevronLeft, Maximize2, Share2, Download, Play, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { GALLERY, type GalleryItem } from "@/lib/gallery";
import { CONTACT } from "@/lib/site";
import { SectionHeader } from "./section-header";

/** تبدیل رقم به فارسی */
const fa = (n: number) => n.toLocaleString("fa-IR");

/** رونوشتِ متن دلخواه — با بازگشت execCommand برای مرورگرهای بدون مجوز/قدیمی‌تر */
function copyText(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  if (!ok) throw new Error("copy failed");
}

/**
 * Horizontal cinematic gallery.
 * Desktop: pinned section where vertical scroll drives horizontal travel (RTL).
 * Mobile: native horizontal snap-scroll strip.
 * Both: click a frame → cinematic lightbox with keyboard navigation.
 */
export function Gallery() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* پیوند عمیق: ?frame=N (۱-مبنا) — هنگام بارگذاری، لایت‌باکس روی همان قاب باز می‌شود.
     پس از settle شدن انیمیشن‌های آغازین (پیش‌بارگذار + ریویل‌ها) اجرا می‌شود.
     بدون useSearchParams — خواندنِ رویدادمان از window، بدون نیاز به Suspense. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = Number.parseInt(params.get("frame") ?? "", 10);
    if (!Number.isFinite(raw) || raw < 1 || raw > GALLERY.images.length) return;
    const t = window.setTimeout(() => setLightbox(raw - 1), 900);
    return () => window.clearTimeout(t);
  }, []);

  if (isDesktop === null) return <section id="gallery" aria-label="گالری" className="relative py-24" />;
  return (
    <>
      {isDesktop ? <HorizontalGallery onOpen={setLightbox} /> : <SnapGallery onOpen={setLightbox} />}
      <Lightbox index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />
    </>
  );
}

/** هم‌گام‌سازیِ نشانی با قابِ باز — باز: ?frame=N (۱-مبنا، هم‌شمارِ شمارندهٔ فارسی)،
    جابه‌جایی: به‌روزرسانی، بستن: پاک‌کردنِ کوئری (هم‌الگویِ دروازهٔ لغو عضویت). */
function syncFrameParam(index: number | null) {
  if (index === null) {
    window.history.replaceState(null, "", window.location.pathname);
  } else {
    window.history.replaceState(null, "", `?frame=${index + 1}`);
  }
}

/* ———————————————— desktop: pinned horizontal ———————————————— */

function HorizontalGallery({ onOpen }: { onOpen: (i: number) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setTravel(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 800); // re-measure after images settle
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef });
  /* در چیدمانِ RTL، نخستین کارت سمتِ راست است و ادامهٔ محتوا به چپِ دیدگاه
     بیرون می‌زند؛ برای آشکارشدنِ آن‌ها باید ریِل به «راست» سفر کند (x مثبت).
     (x منفی جهتِ LTR است و محتوا را از دید دور می‌کند.) */
  const rawX = useTransform(scrollYProgress, [0.02, 0.98], [0, travel]);
  const x = useSpring(rawX, { stiffness: 90, damping: 24, mass: 0.55 });
  const progressScale = useTransform(scrollYProgress, [0.02, 0.98], [0.04, 1]);
  /* درصدِ سفر — مقدارِ خامِ زنده برای نمایشِ رقم فارسی */
  const [progressRatio, setProgressRatio] = useState(0);
  useEffect(() => {
    const unsub = progressScale.on("change", (v) => setProgressRatio(v));
    return () => unsub();
  }, [progressScale]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      aria-label="گالری تصاویر"
      style={{ height: reduced ? "auto" : `${Math.max(220, Math.round((travel / window.innerWidth) * 100))}vh` }}
      /* ⚠️ overflow-hidden اینجا ممنوع! stickyِ فرزندِ مستقیم را می‌شکند
         (nearest-scrollport می‌شود خودِ section که هرگز اسکرول نمی‌شود).
         برشِ ریِل در ظرفِ stickyِ داخلی انجام می‌شود. */
      className="relative"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-10 pb-8">
          <SectionHeader number={GALLERY.number} label={GALLERY.label} title={GALLERY.title} className="!mb-0" />
        </div>

        <motion.div
          ref={trackRef}
          style={reduced ? undefined : { x }}
          className="flex w-max items-end gap-6 pr-10"
        >
          {GALLERY.images.map((img, i) => (
            <GalleryCard key={img.src.src} img={img} index={i} tall={i % 2 === 0} onOpen={onOpen} />
          ))}
          <EndCard />
        </motion.div>

        <div className="mx-auto mt-10 flex w-full max-w-7xl items-center justify-between gap-6 px-10">
          <span className="flex items-center gap-2 text-[11px] tracking-[0.25em] text-muted-foreground">
            <MoveHorizontal className="h-4 w-4 -scale-x-100 text-gold/70" />
            {GALLERY.hint}
          </span>
          {/* درصدِ پیشرفتِ سفر — رقم فارسی، زنده از اسکرول */}
          <span aria-hidden className="hidden shrink-0 font-amiri text-[12px] tabular-nums text-gold/60 lg:block">
            {fa(Math.round(Math.min(1, Math.max(0, progressRatio)) * 100))}٪
          </span>
          <span className="hidden h-px w-40 overflow-hidden bg-ivory/15 lg:block">
            <motion.span style={{ scaleX: progressScale }} className="block h-full origin-right bg-gold" />
          </span>
        </div>
      </div>
    </section>
  );
}

/* ———————————————— mobile: snap strip ———————————————— */

function SnapGallery({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <section id="gallery" aria-label="گالری تصاویر" className="relative py-24">
      <div className="px-5 md:px-10">
        <SectionHeader number={GALLERY.number} label={GALLERY.label} title={GALLERY.title} />
      </div>
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-10">
        {GALLERY.images.map((img, i) => (
          <GalleryCard key={img.src.src} img={img} index={i} tall={false} mobile onOpen={onOpen} />
        ))}
        <EndCard mobile />
      </div>
      <p className="mt-6 flex items-center gap-2 px-5 text-[11px] tracking-[0.25em] text-muted-foreground md:px-10">
        <MoveHorizontal className="h-4 w-4 -scale-x-100 text-gold/70" />
        {GALLERY.hint}
      </p>
    </section>
  );
}

/* ———————————————— card ———————————————— */

function GalleryCard({
  img,
  index,
  tall,
  mobile = false,
  onOpen,
}: {
  img: GalleryItem;
  index: number;
  tall: boolean;
  mobile?: boolean;
  onOpen: (i: number) => void;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative shrink-0 cursor-pointer overflow-hidden ${
        mobile
          ? "h-[52vh] w-[72vw] snap-center"
          : tall
            ? "h-[60vh] w-[26vw] min-w-[360px]"
            : "h-[44vh] w-[21vw] min-w-[290px]"
      }`}
      data-cursor-label="بزرگ‌نمایی"
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={img.video ? `پخش ویدیو: ${img.alt}` : `بزرگ‌نمایی: ${img.alt}`}
        data-cursor-label={img.video ? "پخش" : "بزرگ‌نمایی"}
        className="absolute inset-0 z-10 h-full w-full"
      />
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={mobile ? "72vw" : "(max-width: 1440px) 40vw, 30vw"}
        className="object-cover grayscale-[0.25] transition-all duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:grayscale-0"
      />
      {img.video && (
        <>
          {/* مرکزِ کنشِ پخش — دایرهٔ طلایی */}
          <span
            aria-hidden
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/70 bg-ink/55 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold/15">
              <Play className="h-6 w-6 -scale-x-100 text-gold" strokeWidth={1.5} fill="currentColor" />
            </span>
          </span>
          {/* برچسبِ مدت — کنارِ شمارهٔ قاب */}
          {img.duration && (
            <span
              aria-hidden
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 border border-gold/25 bg-ink/70 px-2 py-1 font-amiri text-[11px] tabular-nums text-gold/90 backdrop-blur-sm"
            >
              <Volume2 className="h-3 w-3" strokeWidth={1.5} />
              {img.duration}
            </span>
          )}
        </>
      )}
      <span aria-hidden className="absolute inset-0 bg-ink/25 transition-opacity duration-700 group-hover:opacity-0" />
      <span aria-hidden className="absolute inset-3 border border-ivory/15 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      {/* شمارهٔ قاب — رقم فارسی */}
      <span
        aria-hidden
        className="absolute bottom-4 left-4 z-10 font-amiri text-sm text-gold/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
      >
        {fa(index + 1)} / {fa(GALLERY.images.length)}
      </span>
      {/* zoom affordance — برای ویدیو، نشانِ پخش در مرکز است */}
      {!img.video && (
        <span
          aria-hidden
          className="absolute top-4 left-4 flex h-9 w-9 scale-75 items-center justify-center border border-ivory/25 bg-ink/60 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
        >
          <Maximize2 className="h-4 w-4 text-ivory/90" strokeWidth={1.5} />
        </span>
      )}
      <figcaption
        className={`pointer-events-none absolute bottom-0 right-0 left-0 bg-gradient-to-t from-ink/85 to-transparent p-5 pt-12 transition-all duration-700 ${
          mobile
            ? "pr-16" /* جا برای شماره */
            : "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        }`}
      >
        <span className="block font-display text-base font-bold text-ivory">{img.caption}</span>
      </figcaption>
    </motion.figure>
  );
}

function EndCard({ mobile = false }: { mobile?: boolean }) {
  return (
    <a
      href={CONTACT.instagramHref}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-label="اینستاگرام"
      className={`group relative flex shrink-0 flex-col items-center justify-center gap-4 border border-dashed border-gold/30 bg-[#100c07] p-8 text-center transition-colors duration-700 hover:border-gold/70 ${
        mobile ? "h-[52vh] w-[60vw] snap-center" : "h-[44vh] w-[18vw] min-w-[250px]"
      }`}
    >
      <Instagram className="h-7 w-7 text-gold/80 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.5} />
      <span className="font-display text-xl font-bold text-ivory">{GALLERY.endCard.title}</span>
      <span className="max-w-[180px] text-[12px] leading-6 text-muted-foreground">{GALLERY.endCard.desc}</span>
      <span className="mt-2 border-b border-gold/50 pb-1 text-[12px] tracking-[0.2em] text-gold">
        {GALLERY.endCard.cta}
      </span>
    </a>
  );
}

/* ———————————————— lightbox ———————————————— */

function Lightbox({
  index,
  onClose,
  onNavigate,
}: {
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const open = index !== null;
  const total = GALLERY.images.length;
  const boxRef = useRef<HTMLDivElement>(null);

  /* نشانیِ قاب هم‌گام می‌ماند (باز/جابه‌جایی/بسته) — برای هم‌رسانیِ پیوند-پذیر */
  useEffect(() => {
    if (open) syncFrameParam(index);
    return () => {
      if (open) syncFrameParam(null);
    };
  }, [open, index]);

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % total);
  }, [index, onNavigate, total]);

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + total) % total);
  }, [index, onNavigate, total]);

  // ناوبری کیبورد — در چیدمان RTL، ArrowLeft یعنی «بعدی»
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") next();
      else if (e.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, onClose]);

  // قفل اسکرول صفحه هنگام باز بودن + توقف Lenis
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    boxRef.current?.focus();
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  const current: GalleryItem | null = index !== null ? GALLERY.images[index] : null;

  /** هم‌رسانی تصویر — Web Share (پیوندِ همین قاب) یا رونوشتِ همان */
  const handleShare = useCallback(async () => {
    if (!current || index === null) return;
    const frameUrl = `${window.location.origin}${window.location.pathname}?frame=${index + 1}`;
    try {
      if (typeof navigator.share === "function") {
        await navigator
          .share({ title: current.caption, text: current.alt, url: frameUrl })
          .catch(() => {});
      } else {
        try {
          await navigator.clipboard.writeText(frameUrl);
        } catch {
          copyText(frameUrl);
        }
        toast.success("نشانی این قاب رونوشت شد");
      }
    } catch {
      toast.error("هم‌رسانی ممکن نشد");
    }
  }, [current, index]);

  /** دانلود تصویر یا ویدیو — فایل ایستای همان‌مبدأ + بازخوردِ آغاز */
  const handleDownload = useCallback(() => {
    if (!current || index === null) return;
    const isVideo = Boolean(current.video);
    toast.success(isVideo ? "دانلود ویدیو آغاز شد" : "دانلود تصویر آغاز شد", {
      description: `قاب ${fa(index + 1)} از ${fa(total)}`,
    });
    const a = document.createElement("a");
    a.href = current.video ?? current.src.src;
    a.download = `hasan-ahmadi-gallery-${index + 1}.${isVideo ? "mp4" : "jpg"}`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [current, index, total]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          key="lightbox"
          ref={boxRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.video ? `پخش ویدیو: ${current.caption}` : `نمایش تصویر: ${current.caption}`}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-md"
        >
          {/* top bar */}
          <div className="flex items-center justify-between gap-3 px-5 py-5 md:px-8">
            <span className="shrink-0 font-amiri text-lg text-gold/80" dir="rtl">
              {fa(index! + 1)} <span className="text-ivory/40">/ {fa(total)}</span>
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleShare}
                aria-label="هم‌رسانی تصویر"
                data-cursor-label="هم‌رسانی"
                className="group flex h-11 w-11 items-center justify-center border border-ivory/15 transition-colors duration-300 hover:border-gold/60 hover:bg-gold/10"
              >
                <Share2 className="h-5 w-5 text-ivory/80 transition-colors group-hover:text-gold" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                aria-label={current.video ? "دانلود ویدیو" : "دانلود تصویر"}
                data-cursor-label="دانلود"
                className="group flex h-11 w-11 items-center justify-center border border-ivory/15 transition-colors duration-300 hover:border-gold/60 hover:bg-gold/10"
              >
                <Download className="h-5 w-5 text-ivory/80 transition-colors group-hover:text-gold" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن"
                data-cursor-label="بستن"
                className="group flex h-11 w-11 items-center justify-center border border-ivory/15 transition-colors duration-300 hover:border-gold/60 hover:bg-gold/10"
              >
                <X className="h-5 w-5 text-ivory/80 transition-colors group-hover:text-gold" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* image stage */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-14 pb-6 md:px-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.src.src}
                initial={{ opacity: 0, scale: 0.96, x: 24 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full"
              >
                {current.video ? (
                  /* ویدیو — با پوسترِ همان کارت؛ بارگذاری تنها هنگامِ باز شدن قاب */
                  <video
                    key={current.video}
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    poster={current.src.src}
                    aria-label={current.alt}
                    className="h-full w-full bg-black object-contain"
                  >
                    <source src={current.video} type="video/mp4" />
                    مرورگر شما از پخشِ ویدیو پشتیبانی نمی‌کند.
                  </video>
                ) : (
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="90vw"
                    className="object-contain"
                    priority
                  />
                )}
                <span aria-hidden className="pointer-events-none absolute inset-4 border border-gold/15" />
              </motion.div>
            </AnimatePresence>

            {/* nav — در RTL «بعدی» به سمت چپ است */}
            <button
              type="button"
              onClick={prev}
              aria-label="تصویر قبلی"
              data-cursor-label="قبلی"
              className="group absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/15 bg-ink/70 backdrop-blur-sm transition-colors duration-300 hover:border-gold/60 hover:bg-gold/10 md:right-6"
            >
              <ChevronRight className="h-5 w-5 text-ivory/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-gold" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="تصویر بعدی"
              data-cursor-label="بعدی"
              className="group absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/15 bg-ink/70 backdrop-blur-sm transition-colors duration-300 hover:border-gold/60 hover:bg-gold/10 md:left-6"
            >
              <ChevronLeft className="h-5 w-5 text-ivory/80 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:text-gold" strokeWidth={1.5} />
            </button>
          </div>

          {/* caption bar */}
          <div className="flex flex-col items-center gap-1.5 px-5 pb-7 text-center">
            <span className="font-display text-lg font-bold text-ivory">{current.caption}</span>
            <span className="max-w-xl text-[11.5px] leading-6 text-ivory/45">{current.alt}</span>
            <span className="mt-2 text-[10px] tracking-[0.25em] text-gold/50">
              کلیدهای جهت‌دار برای مرور · Esc برای بستن
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
