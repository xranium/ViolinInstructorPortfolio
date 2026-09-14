# حسن احمدی · Hasan Ahmadi — Violin Instructor Portfolio

A single-page, right-to-left **Persian** portfolio for a violin instructor, built with
Next.js (App Router) + TypeScript. Dark «ink & gold» theme, Persian typography
(Vazirmatn / Estedad / Amiri), butter-smooth motion — and **fully static**:
no server, no database, no API. `npm run build` produces a plain `out/` folder
you can upload to any static host.

> **سایت ایستا است.** همهٔ محتوا (متن‌ها، نظرات، پیوندها) در `src/lib/site.ts`
> به‌صورتِ دستی مدیریت می‌شود؛ هیچ پشت‌صحنه‌ای وجود ندارد.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

> کاربرانِ bun: `bun install` و `bun run dev` هم کار می‌کند.

## Build (خروجیِ ایستا)

```bash
npm run build
```

خروجی در پوشهٔ **`out/`** است: یک وب‌سایتِ تمام‌ایستا (HTML + CSS + JS + تصاویر و
ویدیوها). همان پوشه را روی هر هاستِ ایستا بارگذاری کنید — cPanel، Netlify،
Vercel (static)، GitHub Pages، nginx/Apache و… . راهنمایِ گام‌به‌گام: **DEPLOYMENT.md**.

برای پیش‌نمایشِ محلیِ خروجیِ build:

```bash
npx serve out
```

## Sections (configurable)

ترتیب و فعال/غیرفعال‌بودنِ بخش‌ها در `src/lib/site.ts` (آرایهٔ `SECTIONS`) تعیین می‌شود:

| id | برچسب |
| --- | --- |
| intro | معرفی |
| about | درباره من |
| achievements | دستاوردها |
| teaching | آموزش |
| gallery | گالری |
| testimonials | نظرات |
| contact | تماس |

هر بخش با `enabled: false` به‌کلی از منو و صفحه حذف می‌شود.

## نظرات هنرجویان (مدیریتِ دستی)

نظرات در `src/lib/site.ts`، داخلِ `TESTIMONIALS.items` به‌صورتِ دستی مدیریت می‌شوند.
برای افزودنِ نظرِ تازه، یک آیتم اضافه کنید:

```ts
{
  quote: "متنِ نظر…",
  name: "نامِ هنرجو",
  role: "هنرجوی سطح متوسط — دو سال",
},
```

به‌جایِ فرمِ ارسالِ نظر، یک دعوت به اشتراک‌گذاری نمایش داده می‌شود: دکمهٔ اصلی +
سه دکمهٔ پیام‌رسان (تلگرام / واتس‌اپ / بله). نشانی‌ها را در `TESTIMONIALS.share`
تنظیم کنید:

```ts
share: {
  title: "…",
  ctaHref: "https://wa.me/989131651978",          // مقصدِ دکمهٔ اصلی
  channels: [
    { id: "telegram", …, href: "https://t.me/USERNAME" },   // ← نشانیِ تلگرامِ شما
    { id: "whatsapp", …, href: "https://wa.me/989131651978" },
    { id: "bale",     …, href: "https://ble.ir/USERNAME" }, // ← نشانیِ بلهِ شما
  ],
},
```

## Features

- **سینمایی و فارسی** — ورودِ بی‌درنگ با محوِ نرم (بدون پری‌لودرِ مسدودکننده)،
  اسکرول نرمِ Lenis (فقط دسکتاپ)، نوارِ پیشرفتِ طلایی، سیم‌های تعاملیِ ویولن
  (Web Audio)، صدای محیطِ سنتز‌شده، گالریِ اسکرولِ افقیِ پین‌شده + لایت‌باکس و
  دیپ‌لینک `?frame=n`
- **بارگذاریِ تدریجی** — صفحه بلافاصله با fade نمایان می‌شود؛ تصاویرِ پایینِ صفحه
  تنبل (lazy) بارگذاری می‌شوند و بخش‌های سنگین (گالری/نظرات/تماس) به‌صورتِ چانک‌های
  جدا در پس‌زمینه می‌رسند — وقتی که کاربر هنوز مشغولِ HERO است
- **رسانهٔ واقعی از اینستاگرام** — عکس‌ها و ویدیوهایِ واقعی از صفحهٔ
  [@hasan_ahmadi_official](https://www.instagram.com/hasan_ahmadi_official/)؛ کارت‌های
  ویدیویی با پوستر و دکمهٔ پخش — ویدیوها فقط با کلیک بارگذاری می‌شوند
- **کارت دیجیتال** — QR از روی vCard + دانلودِ `.vcf` و رونوشتِ کلیپ‌بورد
- **SEO** — OpenGraph/Twitter cards، JSON-LD (Person / Service)، `sitemap.xml`، `robots.txt`
- **کاملاً ایستا** — بدونِ سرور، بدونِ بانکِ اطلاعاتی؛ خروجیِ `out/` روی هر هاستی

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | no | `https://hasanahmadi.ir` | Canonical domain — set **before building** (drives SEO tags, JSON-LD, sitemap, robots) |

## Folder map

```
├─ src/app/               ← page.tsx (single page) · layout.tsx (SEO/fonts/JSON-LD) · robots.ts · sitemap.ts
├─ src/components/        ← sections/ (hero…footer) · motion/ · contact/ · ui/ (shadcn)
├─ src/lib/               ← site.ts (تمامِ متن‌ها، نظرات و پیکربندی) · gallery.ts (دادهٔ گالری) · images.ts (درون‌بردِ ایستایِ عکس‌ها) · audio.ts
├─ src/assets/images/     ← عکس‌های واقعی از اینستاگرامِ رسمی — جایگزینیِ فایلِ هم‌نام = نمایشِ فوریِ تصویرِ تازه
└─ public/media/          ← ویدیوهای واقعی از اینستاگرام (فقط با کلیک بارگذاری می‌شوند)
```

> تغییرِ متن‌ها و نظرات فقط در `src/lib/site.ts` — همهٔ محتوا از همان‌جا خوانده می‌شود.

## Replacing media (جایگزینیِ عکس و ویدیو)

- **عکس‌ها** → پوشهٔ `src/assets/images/`: فایلِ هم‌نام را جایگزین کنید و ذخیره —
  صفحه بلافاصله و **بدونِ ری‌استارت و بدونِ پاک‌کردنِ کش** تصویرِ تازه را نشان می‌دهد.
  (URL تصاویر بر اساسِ محتوایِ فایل هش می‌شود؛ جایگزینیِ فایل یعنی URLِ تازه،
  پس نه کشِ مرورگر و نه کشِ Next تصویرِ کهنه را نگه نمی‌دارد.)
- **ویدیوها** → پوشهٔ `public/media/`: فایلِ هم‌نام را جایگزین کنید؛ در صورتِ
  کهنگی یک بار hard-refresh (Ctrl+Shift+R / Cmd+Shift+R) بزنید.
- **متن‌ها، نظرات و پیوندها** → `src/lib/site.ts` (گالری: `src/lib/gallery.ts`).

## Deployment

راهنمایِ کاملِ هاستِ ایستا (cPanel / Netlify / nginx / …): **DEPLOYMENT.md**

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | dev server (port 3000) |
| `npm run build` | static export → `out/` |
| `npm run lint` | ESLint |

---

© ۱۴۰۴ حسن احمدی — همهٔ حقوق محفوظ است. عکس‌ها و محتوا متعلق به صاحبِ اثر است؛
کد برای استقرارِ مالک فراهم شده است.
