"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { NAV_LINKS, PERSON } from "@/lib/site";
import { Magnetic } from "@/components/motion/magnetic";
import { AmbientToggle } from "@/components/motion/ambient-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  // پیگیری بخشِ فعال برای هایلایت ناوبری
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 350);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 transition-all duration-700 ${
          /* هنگام بازِ منوی موبایل، سربرگ بالای لایهٔ منو (z-[55]) می‌نشیند
             تا دکمهٔ همبرگریِ «بستن» قابل‌کلیک بماند (در بافتِ انباشتهِ z-50
             خودِ سربرگ، z-[60]ِ دکمه بی‌اثر است). */
          open ? "z-[70]" : "z-50"
        } ${
          scrolled
            ? "bg-ink/95 border-b border-gold/10 py-3 md:bg-ink/80 md:backdrop-blur-md"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-10">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              go("hero");
            }}
            className="group flex items-baseline gap-2"
          >
            <span className="font-display text-lg font-bold text-ivory transition-colors group-hover:text-gold">
              {PERSON.name}
            </span>
            <span className="hidden text-[10px] tracking-[0.25em] text-muted-foreground sm:block">
              ویولن
            </span>
          </a>

          {/* desktop nav */}
          <nav aria-label="ناوبری اصلی" className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.id);
                }}
                aria-current={active === link.id ? "true" : undefined}
                className={`group relative text-[13px] transition-[color,letter-spacing] duration-500 hover:text-ivory hover:tracking-[0.06em] ${
                  active === link.id ? "text-gold" : "text-ivory/70"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 right-0 h-px bg-gold transition-all duration-500 ${
                    active === link.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
                {/* لوزیِ طلاییِ لینکِ فعال — بیرونِ لبهٔ راستِ برچسب (آغازِ متن در RTL) */}
                <span
                  aria-hidden
                  className={`absolute -right-3.5 top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 bg-gold transition-all duration-500 ${
                    active === link.id ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* کلید صدای محیط — سنتزِ زنده در مرورگر */}
            <AmbientToggle />

            <Magnetic strength={0.3} className="hidden md:inline-block">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("contact");
                }}
                data-cursor-label="رزرو"
                className="group relative overflow-hidden border border-gold/40 px-5 py-2 text-[12px] tracking-wider text-gold transition-colors duration-500"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-ink">رزرو کلاس</span>
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0"
                />
              </a>
            </Magnetic>

            {/* mobile burger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              className="relative z-[60] flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="relative block h-4 w-6">
                <motion.span
                  animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  className="absolute right-0 top-0 h-px w-full bg-ivory"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  className="absolute right-0 top-[7px] h-px w-full bg-ivory"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -7, scaleX: 0.6 } : { rotate: 0, y: 0, scaleX: 1 }}
                  className="absolute bottom-0 right-0 h-px w-full origin-right bg-ivory"
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[55] flex flex-col justify-center bg-[#100c07] lg:hidden"
          >
            <div className="strings-field" aria-hidden>
              <span className="string-line" />
              <span className="string-line" style={{ animationDelay: "-2s" }} />
              <span className="string-line" style={{ animationDelay: "-4s" }} />
              <span className="string-line" style={{ animationDelay: "-1s" }} />
            </div>
            <nav aria-label="ناوبری موبایل" className="relative flex flex-col gap-2 px-10">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.id);
                  }}
                  className="group relative flex items-baseline justify-between border-b border-gold/10 py-4"
                >
                  <span className="font-display text-3xl font-bold text-ivory transition-colors group-hover:text-gold">
                    {link.label}
                  </span>
                  <span className="text-xs text-gold/50">
                    {String(i + 1).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])}
                  </span>
                  {/* لوزیِ طلاییِ لینکِ فعال — در حاشیهٔ راستِ ردیف */}
                  <span
                    aria-hidden
                    className={`absolute -right-4 top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 bg-gold transition-all duration-500 ${
                      active === link.id ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    }`}
                  />
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
