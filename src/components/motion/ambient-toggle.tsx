"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioLines, VolumeX } from "lucide-react";
import { AMBIENT } from "@/lib/site";
import { startAmbient } from "@/lib/audio";

/**
 * کلیدِ صدای محیط — پخشِ پس‌زمینهٔ آرامِ سنتز‌شده (بوردون و نُت‌های پراکنده)
 * بدون هیچ فایل صوتی؛ ساختهٔ زنده در مرورگر.
 */
export function AmbientToggle() {
  const [on, setOn] = useState(false);
  const handle = useRef<{ stop: () => void } | null>(null);

  useEffect(() => () => handle.current?.stop(), []);

  const toggle = () => {
    if (on) {
      handle.current?.stop();
      handle.current = null;
      setOn(false);
    } else {
      handle.current = startAmbient();
      setOn(true);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? AMBIENT.disableLabel : AMBIENT.enableLabel}
        data-cursor-label={on ? "خاموش" : "صدای محیط"}
        title={on ? AMBIENT.playingLabel : AMBIENT.enableLabel}
        className={`btn-breathe relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-500 ${
          on
            ? "ambient-on border-gold/70 bg-gold/10 text-gold"
            : "border-ivory/20 text-ivory/70 hover:border-gold/50 hover:text-gold"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={on ? "on" : "off"}
            initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, rotate: 12 }}
            transition={{ duration: 0.25 }}
            className="flex"
          >
            {on ? <AudioLines className="h-4 w-4" strokeWidth={1.75} /> : <VolumeX className="h-4 w-4" strokeWidth={1.5} />}
          </motion.span>
        </AnimatePresence>

        {/* موج‌های کوچکِ فعال */}
        {on && (
          <span aria-hidden className="absolute -bottom-1 left-1/2 flex h-2 -translate-x-1/2 items-end gap-[2px]" dir="ltr">
            {[0, 1, 2].map((b) => (
              <span key={b} className="eq-bar w-[2px] rounded-full bg-gold" style={{ animationDelay: `${b * 0.15}s` }} />
            ))}
          </span>
        )}
      </button>
    </div>
  );
}
