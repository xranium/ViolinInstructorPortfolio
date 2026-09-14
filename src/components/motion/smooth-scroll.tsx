"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth-scroll provider.
 * Respects prefers-reduced-motion and touch devices (native momentum there).
 * Also handles anchor navigation through the Lenis instance.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReduced || isTouch) return;

    const instance = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    // expose for external anchor navigation (e.g. footer back-to-top)
    (window as unknown as { __lenis?: Lenis }).__lenis = instance;

    let rafId: number;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // smooth anchor navigation through Lenis
    const onAnchor = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.getElementById(id.slice(1));
      if (!el) return;
      e.preventDefault();
      instance.scrollTo(el, { offset: -10, duration: 1.6 });
    };
    document.addEventListener("click", onAnchor);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchor);
      instance.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
