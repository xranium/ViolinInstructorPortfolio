/* ————— براکت‌های تزئینی گوشه‌ها ————— */
/**
 * چهار براکتِ طلایی در گوشه‌های والدِ «relative» —
 * همان طرحِ پنلِ شمارش معکوسِ رویدادها (کامپوننتِ سروری، بدونِ «use client»).
 * صرفاً تزئینی است؛ با aria-hidden از درختِ دسترس‌پذیری کنار گذاشته می‌شود.
 */
export function Corners() {
  return (
    <>
      <span aria-hidden className="absolute -top-px -right-px h-5 w-5 border-t-2 border-r-2 border-gold/60" />
      <span aria-hidden className="absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-gold/60" />
      <span aria-hidden className="absolute -top-px -left-px h-5 w-5 border-t-2 border-l-2 border-gold/35" />
      <span aria-hidden className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-gold/35" />
    </>
  );
}
