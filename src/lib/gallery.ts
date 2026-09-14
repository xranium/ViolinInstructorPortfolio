/* ————— دادهٔ گالری —————
   از site.ts جدا شد تا بتواند تصاویر را «ایستا» import کند (URLهای هش‌شده بر
   اساسِ محتوا — جایگزینیِ فایلِ هم‌نام بلافاصله دیده می‌شود). site.ts همچنان
   متنِ خالص می‌ماند چون از Route Handlerها (api/admin) هم خوانده می‌شود.

   «video» اختیاری است: اگر باشد، کارت به‌صورت ویدیو در می‌آید (کلیک = پخش)
   و src نقشِ پوستر را دارد. «duration» برچسبِ مدت است.
*/
import type { StaticImageData } from "next/image";
import { IMG } from "@/lib/images";

export type GalleryItem = {
  src: StaticImageData;
  alt: string;
  caption: string;
  video?: string;
  duration?: string;
};

export const GALLERY = {
  number: "۰۵",
  label: "گالری",
  title: "قاب‌هایی از روایت",
  hint: "برای مرور، اسکرول کنید",
  images: [
    {
      src: IMG.gallery[0],
      video: "/media/ig-fatemeh.mp4",
      alt: "اجرای فاطمه خودسیانی، هنرجوی ویولن — از صفحهٔ اینستاگرامِ حسن احمدی",
      caption: "فاطمه خودسیانی — دو سالِ نوازندگی",
      duration: "۰:۵۷",
    },
    {
      src: IMG.gallery[1],
      alt: "روشا پنجه، هنرجوی ویولن، در حالِ نواختنِ آوازِ دشتی",
      caption: "روشا پنجه — آوازِ دشتی",
    },
    {
      src: IMG.gallery[2],
      video: "/media/ig-yousef.mp4",
      alt: "اجرای یوسف فروغی — بیات ترک، ضربی ۶/۴ — از صفحهٔ اینستاگرامِ حسن احمدی",
      caption: "یوسف فروغی — بیات ترک",
      duration: "۲:۲۵",
    },
    {
      src: IMG.gallery[3],
      alt: "مراسم تقدیر در آموزشگاه موسیقی بسته نگار — جمعی از مدرسان و هنرجویان",
      caption: "مراسم تقدیر — بسته نگار",
    },
    {
      src: IMG.gallery[4],
      alt: "یوسف فروغی، هنرجوی ویولن، در حالِ تمرین در کلاس",
      caption: "تمرینِ کلاس",
    },
    {
      src: IMG.gallery[5],
      video: "/media/ig-lesson.mp4",
      alt: "درسِ بیات ترک — حسن احمدی در حالِ نواختن و تشریح — از صفحهٔ اینستاگرامِ رسمیِ او",
      caption: "درسِ بیات ترک — پایِ استاد",
      duration: "۱:۱۲",
    },
  ],
  endCard: {
    title: "ادامهٔ روایت",
    desc: "اجرای هنرجویان و لحظه‌های کلاس، در اینستاگرام",
    cta: "دنبال کنید",
  },
} as const;
