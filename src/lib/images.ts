/* ————— درون‌بردِ ایستایِ تصاویر —————
   چرا import ایستا به‌جایِ رشتهٔ «/images/...»؟
   ۱) URLِ تولیدی بر اساسِ «محتوایِ فایل» hash می‌شود (/_next/static/media/...).
      یعنی اگر فایلِ هم‌نام را در src/assets/images جایگزین کنید، URLِ تازه
      ساخته می‌شود و هیچ کشی — نه مرورگر، نه Next — تصویرِ کهنه را نشان نمی‌دهد.
   ۲) ابعادِ واقعیِ تصویر در زمانِ build خوانده می‌شود (width/height) — بدونِ
      جهشِ چیدمان (CLS).
   ۳) با ذخیرهٔ فایل، صفحه خودکار هات-ریلود می‌شود؛ نه ری‌استارت لازم است
      نه پاک‌کردنِ پوشهٔ .next.

   ⚠️ این ماژول فقط باید از کامپوننت‌ها import شود، نه از Route Handlerها
      (APIها متن می‌خواهند، نه دارایی).
*/
import igHero from "@/assets/images/ig-hero.jpg";
import igHands from "@/assets/images/ig-hands.jpg";
import igAbout from "@/assets/images/ig-about.jpg";
import igTeaching from "@/assets/images/ig-teaching.jpg";
import igGallery1 from "@/assets/images/ig-gallery-1.jpg";
import igGallery2 from "@/assets/images/ig-gallery-2.jpg";
import igGallery3 from "@/assets/images/ig-gallery-3.jpg";
import igGallery4 from "@/assets/images/ig-gallery-4.jpg";
import igGallery5 from "@/assets/images/ig-gallery-5.jpg";
import igGallery6 from "@/assets/images/ig-gallery-6.jpg";

export const IMG = {
  hero: igHero,
  hands: igHands,
  about: igAbout,
  teaching: igTeaching,
  gallery: [igGallery1, igGallery2, igGallery3, igGallery4, igGallery5, igGallery6],
} as const;
