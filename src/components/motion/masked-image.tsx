"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  /** مسیرِ public (رشته) یا تصویرِ import ایستا — دومی URLِ هش‌شده بر اساسِ محتوا می‌دهد */
  src: string | StaticImageData;
  alt: string;
  className?: string;
  /** wrapper aspect or sizing classes */
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** initial clip-path inset percent */
  inset?: number;
  caption?: string;
  captionClassName?: string;
  /** parallax strength in px while scrolling past */
  parallax?: number;
  /** slow scale from 1.12 to 1 as it reveals */
  zoomOut?: boolean;
  delay?: number;
  fill?: boolean;
  width?: number;
  height?: number;
};

/**
 * Cinematic masked image reveal:
 * - clip-path wipes open from center (like a curtain)
 * - image slowly scales down from 1.14 → 1
 * - optional gentle parallax drift while in view
 */
export function MaskedImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes = "100vw",
  inset = 18,
  caption,
  captionClassName,
  parallax = 0,
  zoomOut = true,
  delay = 0,
  fill = true,
  width,
  height,
}: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [parallax / 2, -parallax / 2]);
  const parallaxY = reduced || parallax === 0 ? 0 : y;

  const clipInitial = `inset(${inset}% ${inset}% ${inset}% ${inset}%)`;
  const clipOpen = "inset(0% 0% 0% 0%)";

  return (
    <figure ref={ref} className={className}>
      <motion.div
        className="relative h-full w-full overflow-hidden"
        initial={{ clipPath: reduced ? clipOpen : clipInitial }}
        whileInView={{ clipPath: clipOpen }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduced ? 0.4 : 1.4, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: reduced ? 1 : zoomOut ? 1.16 : 1.02 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduced ? 0.4 : 2.1, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
          style={parallax ? { y: parallaxY } : undefined}
        >
          {fill ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes={sizes}
              className={`object-cover ${imgClassName ?? ""}`}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width ?? (typeof src !== "string" ? src.width : 800)}
              height={height ?? (typeof src !== "string" ? src.height : 1000)}
              priority={priority}
              sizes={sizes}
              className={`h-auto w-full object-cover ${imgClassName ?? ""}`}
            />
          )}
          {/* warm grade tint */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#c9a45c] opacity-[0.06] mix-blend-overlay"
          />
        </motion.div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent"
        />
      </motion.div>
      {caption ? (
        <motion.figcaption
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-3 text-[11px] tracking-[0.2em] text-muted-foreground ${captionClassName ?? ""}`}
        >
          {caption}
        </motion.figcaption>
      ) : null}
    </figure>
  );
}
