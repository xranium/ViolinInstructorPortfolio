import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* خروجیِ ایستا — `npm run build` پوشهٔ out/ را می‌سازد: یک وب‌سایتِ تمام‌ایستا
     (HTML + CSS + JS + رسانه) که روی هر هاستِ ایستا قابلِ بارگذاری است. */
  output: "export",
  /* بهینه‌سازِ تصوریِ Next در خروجیِ ایستا کار نمی‌کند؛ تصاویر مستقیم و بدونِ
     واسطه سرو می‌شوند (URLهای هش‌شده بر اساسِ محتوای فایل، از درون‌بردِ ایستا). */
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai"],
};

export default nextConfig;
