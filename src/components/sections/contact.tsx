"use client";

import { Phone, Mail, Instagram, MapPin, Clock, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/site";
import { SectionHeader } from "./section-header";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { BusinessCard } from "@/components/contact/business-card";

/**
 * Cinematic contact finale — warm glow, big CTA, elegant contact channels.
 */
export function Contact() {
  const channels = [
    {
      icon: MessageCircle,
      label: "واتس‌اپ",
      value: CONTACT.phoneDisplay,
      href: CONTACT.whatsappHref,
      primary: true,
    },
    { icon: Phone, label: "تلفن", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
    { icon: Instagram, label: "اینستاگرام", value: CONTACT.instagramDisplay, href: CONTACT.instagramHref },
    { icon: Mail, label: "ایمیل", value: CONTACT.emailDisplay, href: CONTACT.emailHref },
  ];

  return (
    <section id="contact" aria-label="تماس" className="relative overflow-hidden py-28 md:py-40">
      {/* warm finale glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 h-[70vmin] w-[90vmin] -translate-x-1/2 rounded-full opacity-[0.16] blur-[130px]"
        style={{ background: "radial-gradient(circle, #c9a45c 0%, #8f6e3b 40%, transparent 70%)" }}
      />
      <div className="strings-field opacity-20" aria-hidden>
        <span className="string-line" />
        <span className="string-line" style={{ animationDelay: "-2.4s" }} />
        <span className="string-line" style={{ animationDelay: "-4.8s" }} />
        <span className="string-line" style={{ animationDelay: "-1.2s" }} />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-10">
        <SectionHeader number={CONTACT.number} label={CONTACT.label} title={CONTACT.title} align="center" />

        <Reveal delay={0.15} className="mt-10">
          <p className="mx-auto max-w-xl text-[15px] leading-[2.2] text-ivory/80 md:text-ivory/65">{CONTACT.lead}</p>
        </Reveal>

        {/* primary CTAs */}
        <Reveal delay={0.25} className="mt-12">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Magnetic>
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="واتس‌اپ"
                className="group relative flex items-center gap-3 overflow-hidden border border-gold bg-gold px-10 py-4.5"
              >
                <span className="z-10 flex items-center gap-3 text-sm font-bold tracking-wider text-ink transition-colors duration-500 group-hover:text-ivory">
                  <MessageCircle className="h-4.5 w-4.5" />
                  {CONTACT.primaryCta}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0"
                />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={CONTACT.phoneHref}
                data-cursor-label="تماس"
                className="group flex items-center gap-3 px-6 py-4.5 text-sm tracking-wider text-ivory/85 transition-colors hover:text-gold"
              >
                <Phone className="h-4.5 w-4.5" />
                {CONTACT.secondaryCta}
                <span className="h-px w-8 bg-ivory/40 transition-all duration-500 group-hover:w-14 group-hover:bg-gold" />
              </a>
            </Magnetic>
          </div>
        </Reveal>

        {/* channels grid */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-px overflow-hidden border border-gold/12 bg-gold/12 sm:grid-cols-2">
          {channels.map((ch, i) => (
            <Reveal key={ch.label} delay={i * 0.08} amount={0.5}>
              <a
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`group flex h-full items-center justify-between gap-4 p-6 transition-colors duration-500 ${
                  ch.primary ? "bg-[#17110a] hover:bg-[#1d1509]" : "bg-ink hover:bg-[#14100a]"
                }`}
                dir={ch.label === "اینستاگرام" || ch.label === "ایمیل" ? "ltr" : "rtl"}
              >
                <span className="flex items-center gap-4">
                  <span className="relative flex h-9 w-9 items-center justify-center border border-gold/15 transition-colors duration-500 group-hover:border-gold/45">
                    <ch.icon
                      className="h-4.5 w-4.5 text-gold/70 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:text-gold"
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="flex flex-col gap-1" dir="rtl">
                    <span className="text-[11px] tracking-[0.25em] text-muted-foreground">{ch.label}</span>
                    <span className="link-sweep self-start font-display text-[15px] font-bold text-ivory">{ch.value}</span>
                  </span>
                </span>
                <span
                  aria-hidden
                  className="h-px w-6 bg-gold/40 transition-all duration-500 group-hover:w-10 group-hover:bg-gold"
                />
              </a>
            </Reveal>
          ))}
        </div>

        {/* کارت دیجیتال — QR از روی vCard + ذخیرهٔ مخاطب */}
        <Reveal delay={0.15} amount={0.3} className="mx-auto mt-6 max-w-4xl">
          <BusinessCard lead="اطلاعات تماس را اسکن یا ذخیره کنید" />
        </Reveal>

        {/* location + hours */}
        <div className="mt-14 flex flex-col items-center justify-center gap-5 text-muted-foreground sm:flex-row sm:gap-12">
          <Reveal delay={0.1}>
            <p className="flex items-center gap-2.5 text-[12px] leading-6">
              <MapPin className="h-4 w-4 text-gold/70" strokeWidth={1.5} />
              {CONTACT.address}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="flex items-center gap-2.5 text-[12px]">
              <Clock className="h-4 w-4 text-gold/70" strokeWidth={1.5} />
              {CONTACT.hours}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
