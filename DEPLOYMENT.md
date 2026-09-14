# استقرار — نسخهٔ ایستا (Static Export)

سایت کاملاً ایستا است؛ `npm run build` پوشهٔ **`out/`** را می‌سازد و همین پوشه را
روی هر هاستِ ایستا بارگذاری می‌کنید. هیچِ سرور، بانکِ اطلاعاتی یا runtime لازم نیست.

```bash
npm install
npm run build          # ← خروجی: out/
```

> پیش از build، در صورتِ تمایل `NEXT_PUBLIC_SITE_URL` را روی دامنهٔ خود بگذارید
> (فایلِ `.env.example` را ببینید) تا برچسب‌های SEO و sitemap با دامنهٔ واقعی ساخته شوند.

---

## ۱) cPanel / هاستِ اشتراکی (رایج‌ترین حالت)

1. `npm run build` را روی سیستمِ خود اجرا کنید.
2. واردِ File Manager هاست شوید و به ریشهٔ سایت بروید
   (معمولاً `public_html`).
3. **تمامِ محتوایِ پوشهٔ `out/`** را آپلود کنید — نه خودِ پوشه را، بلکه
   محتوایش را (`index.html`، `_next/`، `media/`، …).

همین. سایت آماده است.

> نکته: اگر می‌خواهید سایت در زیرمسیر باشد (مثلاً `example.com/site/`)، در
> `next.config.ts` مقدار `basePath: "/site"` را اضافه کنید و دوباره build بگیرید.

## ۲) Netlify

1. مخزن را به Netlify وصل کنید (یا پوشهٔ `out/` را drag-and-drop کنید).
2. Build command: `npm run build` — Publish directory: `out`.

## ۳) Vercel

مخزن را import کنید؛ Next.js خودش شناسایی می‌شود و خروجیِ ایستا را سرو می‌کند.

## ۴) سرورِ شخصی (nginx)

```nginx
server {
    listen 80;
    server_name hasanahmadi.ir;
    root /var/www/hasan;          # ← محتوای out/ اینجا کپی شود

    location / {
        try_files $uri $uri/ /index.html;
    }

    # کشِ طولانی برای دارایی‌های هش‌شده
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # ویدیوها — پشتیبانی از range برای پخش
    location /media/ {
        add_header Accept-Ranges bytes;
    }
}
```

## ۵) GitHub Pages / هر هاستِ دیگری

هر سرویسی که بتوان پوشهٔ HTML را سرو کند کار می‌کند؛ فقط محتوای `out/` را
در ریشه بگذارید. (برای پروژهٔ صفحه‌ای، `index.html` باید در ریشه باشد.)

---

## پس از هر تغییر

```bash
npm run build          # خروجیِ تازه در out/
```

و پوشهٔ `out/` را دوباره بارگذاری کنید. برای تغییرِ متن‌ها، نظرات یا پیوندهای
پیام‌رسان فقط `src/lib/site.ts` را ویرایش کنید و دوباره build بگیرید.

## پرسش‌های رایج

- **ویدیوها پخش نمی‌شوند؟** MIME نوعِ `video/mp4` باید روی هاست فعال باشد و
  هدرِ `Accept-Ranges` پشتیبانی شود (در nginx بالا آمده).
- **فونت‌ها نمایش داده نمی‌شوند؟** مطمئن شوید پوشهٔ `_next/static/media/`
  کامل آپلود شده است.
- **آدرسِ canonical/sitemap؟** پیش از build مقدار `NEXT_PUBLIC_SITE_URL` را
  تنظیم کنید؛ پیش‌فرض `https://hasanahmadi.ir` است.
