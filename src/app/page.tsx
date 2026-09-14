"use client";

import { type ComponentType } from "react";
import dynamic from "next/dynamic";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CustomCursor } from "@/components/motion/cursor";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { PlayableStrings } from "@/components/motion/playable-strings";
import { Ornament } from "@/components/motion/ornament";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Footer } from "@/components/sections/footer";
import { Intro } from "@/components/sections/intro";
import { About } from "@/components/sections/about";
import { Timeline } from "@/components/sections/timeline";
import { Teaching } from "@/components/sections/teaching";
import { SECTIONS, type SectionId } from "@/lib/site";

/**
 * حسن احمدی — interactive cinematic portfolio
 * Single-page RTL experience in Persian.
 *
 * بخش‌های اصلی از پیکربندیِ SECTIONS در src/lib/site.ts ساخته می‌شوند:
 * ترتیب و فعال/غیرفعال‌بودنِ هر بخش، همان‌جا تعیین می‌شود.
 *
 * ——— بارگذاریِ تدریجی ———
 * پری‌لودرِ مسدودکننده حذف شده: صفحه بلافاصله و با یک محوِ نرم (site-fade)
 * نمایان می‌شود. بخش‌های سنگینِ پایینِ صفحه (گالری، نظرات، تماس) به‌صورتِ
 * چانک‌های جدا بارگذاری می‌شوند — محتوایشان از همان HTMLِ اولیه حضور دارد،
 * اما اسکریپت‌های تعاملی‌شان در پس‌زمینه می‌رسند؛ درست وقتی که کاربر
 * هنوز مشغولِ خواندنِ بخشِ HERO است.
 */

/* بخش‌های سنگینِ پایینِ صفحه — چانک‌های جداگانه (SSR روشن؛ محتوا در HTML می‌ماند) */
const Gallery = dynamic(() => import("@/components/sections/gallery").then((m) => m.Gallery));
const Testimonials = dynamic(() => import("@/components/sections/testimonials").then((m) => m.Testimonials));
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

/* ——— ثبتِ بخش‌ها ——— کلیدِ هر آیتم باید با idهای SECTIONS یکی باشد ——— */
const SECTION_COMPONENTS: Record<SectionId, ComponentType> = {
  intro: Intro,
  about: About,
  achievements: Timeline,
  teaching: Teaching,
  gallery: Gallery,
  testimonials: Testimonials,
  contact: Contact,
};

/* جداکننده‌های تزئینی پس از این بخش‌ها (فقط اگر خودِ بخش فعال باشد) */
const ORNAMENT_AFTER: readonly SectionId[] = ["intro", "achievements"];

export default function Home() {
  const enabled = SECTIONS.filter((s) => s.enabled);

  return (
    <SmoothScroll>
      {/* ورودِ بی‌درنگ با محوِ نرم — بدونِ پری‌لودرِ مسدودکننده */}
      <div className="site-fade">
        <CustomCursor />
        <ScrollProgress />

        {/* cinematic overlays */}
        <div className="grain-overlay" aria-hidden />
        <div className="vignette" aria-hidden />

        <div className="flex min-h-svh flex-col">
          <Navbar />

          <main id="main-content" className="flex-1">
            <Hero />
            <PlayableStrings />

            {enabled.map((s, i) => {
              const Section = SECTION_COMPONENTS[s.id];
              return (
                <div key={s.id}>
                  <Section />
                  {ORNAMENT_AFTER.includes(s.id) && i < enabled.length - 1 && <Ornament />}
                </div>
              );
            })}
          </main>

          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}
