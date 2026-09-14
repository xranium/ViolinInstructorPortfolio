"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  wordClassName?: string;
  /** واژهٔ تأکیدی — اگر با واژه‌ای از متن برابر باشد، کلاس ویژه می‌گیرد */
  accentWord?: string;
  /** کلاس ویژهٔ واژهٔ تأکیدی (مثلاً درخشش طلایی) */
  accentClassName?: string;
  /** delay in seconds before starting */
  delay?: number;
  /** stagger between words (s) */
  stagger?: number;
  /** direction words travel from */
  from?: "bottom" | "top" | "fade";
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

/**
 * Word-level split reveal for Persian text.
 * Words (not chars) are animated to keep RTL joining intact.
 * The accent word (e.g. بی‌پایان) can be highlighted by wrapping in <em> via goldWord.
 */
export function SplitWords({
  text,
  className,
  wordClassName,
  accentWord,
  accentClassName,
  delay = 0,
  stagger = 0.07,
  from = "bottom",
  once = true,
  as = "div",
}: Props) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay },
    },
  };

  const wordVariants: Variants = {
    hidden: reduced
      ? { opacity: 0 }
      : from === "bottom"
        ? { y: "110%", opacity: 0, rotate: 2 }
        : from === "top"
          ? { y: "-110%", opacity: 0, rotate: -2 }
          : { opacity: 0, filter: "blur(6px)" },
    show: {
      y: 0,
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: { duration: reduced ? 0.3 : 0.85, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.4, margin: "0px 0px -10% 0px" }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
          aria-hidden
        >
          <motion.span
            variants={wordVariants}
            className={`inline-block will-change-transform ${
              accentWord && word === accentWord
                ? (accentClassName ?? "")
                : (wordClassName ?? "")
            }`}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
