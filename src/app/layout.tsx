import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/lib/site";
import { IMG } from "@/lib/images";
import "./globals.css";

const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-vazir",
  display: "swap",
  preload: true,
});

const estedad = localFont({
  src: "../fonts/Estedad-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-estedad",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "حسن احمدی | مدرس ویولن",
    template: "%s | حسن احمدی",
  },
  description:
    "وب‌سایت رسمی حسن احمدی، مدرس ویولن — دو دهه تجربهٔ تدریس با روشِ تلفیقی مکتب روسی و سوزوکی؛ کلاس‌های حضوری در اصفهان، آموزشگاه موسیقی بسته نگار.",
  keywords: [
    "ویولن",
    "مدرس ویولن",
    "آموزش ویولن",
    "کلاس ویولن",
    "کلاس ویولن اصفهان",
    "آموزشگاه موسیقی بسته نگار",
    "موسیقی کلاسیک",
    "ویولن ایرانی",
    "حسن احمدی",
  ],
  authors: [{ name: "حسن احمدی" }],
  openGraph: {
    title: "حسن احمدی | مدرس ویولن",
    description:
      "چهار سیم، یک روایتِ بی‌پایان — آموزش حرفه‌ای ویولن از مبتدی تا پیشرفته، در اصفهان.",
    url: SITE_URL,
    siteName: "حسن احمدی",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: IMG.hero.src,
        width: IMG.hero.width,
        height: IMG.hero.height,
        alt: "حسن احمدی، مدرس ویولن، در حالِ نواختن",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "حسن احمدی | مدرس ویولن",
    description: "چهار سیم، یک روایتِ بی‌پایان — آموزش حرفه‌ای ویولن از مبتدی تا پیشرفته.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0806",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "حسن احمدی",
    alternateName: "Hasan Ahmadi",
    gender: "Male",
    jobTitle: "مدرس ویولن",
    description:
      "مدرس ویولن با دو دهه تجربهٔ تدریس؛ روشِ تلفیقی مکتب روسی و سوزوکی، تحصیل‌کردهٔ دانشگاه موسیقی وین. کلاس‌های حضوری در اصفهان، آموزشگاه موسیقی بسته نگار.",
    url: SITE_URL,
    image: `${SITE_URL}${IMG.hero.src}`,
    telephone: "+989131651978",
    email: "studio@ahmadiviolin.ir",
    knowsAbout: ["ویولن", "آموزش موسیقی", "موسیقی کلاسیک", "موسیقی ایرانی", "آموزش ویولن", "سوزوکی", "ویولن ایرانی"],
    sameAs: ["https://www.instagram.com/hasan_ahmadi_official/"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "اصفهان",
      addressCountry: "IR",
      streetAddress: "خیابان گلخانه، آموزشگاه موسیقی بسته نگار",
    },
    worksFor: {
      "@type": "Organization",
      name: "آموزشگاه موسیقی بسته نگار",
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "دانشگاه هنر تهران" },
      { "@type": "CollegeOrUniversity", name: "دانشگاه موسیقی و هنرهای نمایشی وین" },
    ],
  };

  /* دادهٔ ساختاریافتهٔ خدمات آموزشی — برای موتورهای جست‌وجو */
  const teachingLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "آموزش ویولن — آموزشگاه موسیقی بسته نگار",
    serviceType: "آموزش موسیقی",
    description:
      "کلاس‌های حضوری ویولن از مبتدی تا پیشرفته در اصفهان؛ آمادگی برای کنکور هنر، مسابقات و آزمون‌های بین‌المللی.",
    provider: {
      "@type": "Person",
      name: "حسن احمدی",
      alternateName: "Hasan Ahmadi",
    },
    areaServed: ["اصفهان", "ایران"],
  };

  return (
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} ${estedad.variable} font-sans antialiased bg-background text-foreground`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teachingLd) }} />

        {/* پیوندِ پرش — نخستین عنصرِ فوکوس‌پذیرِ صفحه (دسترس‌پذیری) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[100] focus:rounded-none focus:border focus:border-gold/70 focus:bg-ink focus:px-4 focus:py-2.5 focus:text-[12px] focus:text-gold"
        >
          پرش به محتوای اصلی
        </a>

        {children}
        <Toaster
          position="bottom-center"
          dir="rtl"
          toastOptions={{
            style: {
              background: "#16110a",
              border: "1px solid rgba(201, 164, 92, 0.35)",
              color: "#ede6d6",
              borderRadius: "2px",
              fontFamily: "var(--font-vazir), sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
