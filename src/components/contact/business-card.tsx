"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QrCode, Download, Copy, Phone, Mail, Instagram } from "lucide-react";
import { toast } from "sonner";
import { PERSON, CONTACT } from "@/lib/site";

/* ————— کارت دیجیتال حسن —————
   کدِ QR از روی vCard (نسخهٔ ۳.۰) ساخته می‌شود؛ گوشی‌ها آن را
   به‌صورت «افزودن مخاطب» می‌خوانند. همان متنِ vCard برای دانلودِ
   فایل .vcf و رونوشتِ کلیپ‌بورد هم استفاده می‌شود (یک منبع، سه خروجی). */

/** ساخت متن vCard 3.0 — از داده‌های CONTACT/PERSON تا جای ممکن */
function buildVCard(): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:احمدی;حسن;;;",
    `FN:${PERSON.name}`,
    "ORG:آموزشگاه موسیقی بسته نگار",
    `TITLE:${PERSON.role}`,
    `TEL;TYPE=CELL:${CONTACT.phoneHref.replace("tel:", "")}`,
    `EMAIL:${CONTACT.emailDisplay}`,
    `URL:${CONTACT.instagramHref}`,
    `X-SOCIALPROFILE;TYPE=instagram:${CONTACT.instagramHref}`,
    "ADR;TYPE=WORK:;;خیابان گلخانه;اصفهان;;;ایران",
    "NOTE:مشاوره و رزرو کلاس ویولن — پاسخ‌گویی در کمتر از ۲۴ ساعت",
    "END:VCARD",
  ].join("\r\n");
}

/** رونوشتِ متن — با بازگشت execCommand برای مرورگرهای قدیمی/بدون مجوز */
function copyText(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  if (!ok) throw new Error("copy failed");
}

export function BusinessCard({ lead }: { lead: string }) {
  const [open, setOpen] = useState(false);
  /* تولید QR یک‌بار در مرورگر — در ref کش می‌شود تا بازِ دوباره بی‌دوباره‌کاری باشد */
  const qrCache = useRef<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (qrCache.current) {
      setQr(qrCache.current);
      return;
    }
    let alive = true;
    QRCode.toDataURL(buildVCard(), {
      margin: 1,
      width: 480,
      color: { dark: "#0b0806", light: "#ede6d6" },
    })
      .then((url) => {
        if (!alive) return;
        qrCache.current = url;
        setQr(url);
      })
      .catch(() => {
        if (alive) toast.error("ساخت کدِ ممکن نشد");
      });
    return () => {
      alive = false;
    };
  }, [open]);

  /** ذخیرهٔ .vcf — الگوی دانلودِ گالری (لنگرِ برنامه‌نویسی‌شده) */
  const handleSave = () => {
    const blob = new Blob([buildVCard()], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hasan-ahmadi.vcf";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("کارت ذخیره شد", { description: "hasan-ahmadi.vcf" });
  };

  /** رونوشتِ اطلاعات کارت در کلیپ‌بورد */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildVCard());
    } catch {
      try {
        copyText(buildVCard());
      } catch {
        toast.error("رونوشت ممکن نشد");
        return;
      }
    }
    toast.success("اطلاعات کارت رونوشت شد");
  };

  return (
    <>
      {/* پنلِ راه‌رما — زیر شبکهٔ کانال‌ها */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        data-cursor-label="کارت"
        aria-label="نمایش کارت دیجیتال حسن"
        className="group mt-6 flex w-full items-center justify-between gap-5 border border-gold/15 bg-ink p-5 text-start transition-colors duration-700 hover:border-gold/40 hover:bg-[#14100a]"
      >
        <span className="flex items-center gap-4">
          <QrCode className="h-6 w-6 shrink-0 text-gold/70 transition-colors duration-500 group-hover:text-gold" strokeWidth={1.5} />
          <span className="flex flex-col gap-1">
            <span className="font-display text-sm font-bold text-ivory">کارت دیجیتال حسن</span>
            <span className="text-[11px] leading-5 text-ivory/45">{lead}</span>
          </span>
        </span>
        {/* پیش‌نمایش کوچک QR — همان تصویرِ تولیدی (یا جای‌نگهدار تا آماده شود) */}
        <span aria-hidden className="relative block h-[72px] w-[72px] shrink-0 overflow-hidden border border-gold/15">
          {qr ? (
            <img src={qr} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 animate-pulse bg-ivory/5" />
          )}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[380px] rounded-none border-gold/25 bg-[#16110a] p-0" dir="rtl">
          <DialogHeader className="border-b border-gold/15 px-6 pb-4 pt-6 text-center">
            <DialogTitle className="flex items-center justify-center gap-3 font-display text-lg font-bold text-ivory">
              <QrCode className="h-5 w-5 text-gold/80" strokeWidth={1.5} />
              کارت دیجیتال
            </DialogTitle>
            <DialogDescription className="text-[12px] text-ivory/50">{lead}</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6">
            {/* بدنهٔ کارت */}
            <div className="border border-gold/20 bg-gradient-to-b from-[#1a140b] to-[#0f0b07] p-5">
              <p className="text-center font-display text-xl font-bold text-ivory">{PERSON.name}</p>
              <p className="mt-1.5 text-center text-[11px] tracking-[0.25em] text-gold/80">{PERSON.role}</p>
              <span aria-hidden className="mx-auto mt-4 block h-px w-16 bg-gold/40" />

              {/* کدِ QR */}
              <div className="mt-5 flex justify-center">
                {qr ? (
                  <img src={qr} alt={`کد QR — اطلاعات تماسِ ${PERSON.name}`} className="h-[200px] w-[200px] border border-gold/15 p-1.5" />
                ) : (
                  <span className="block h-[200px] w-[200px] animate-pulse border border-gold/15 bg-ivory/5" />
                )}
              </div>
              <p className="mt-3 text-center text-[10px] text-ivory/40">برای ذخیرهٔ اطلاعات، اسکن کنید</p>

              {/* ردیف‌های اطلاعات */}
              <ul className="mt-5 space-y-2.5 border-t border-gold/12 pt-4 text-[12px]">
                <li>
                  <a href={CONTACT.phoneHref} className="group flex items-center gap-3 text-ivory/70 transition-colors hover:text-gold">
                    <Phone className="h-4 w-4 text-gold/60" strokeWidth={1.5} />
                    <span className="link-sweep self-start font-amiri tabular-nums" dir="ltr">{CONTACT.phoneDisplay}</span>
                  </a>
                </li>
                <li>
                  <a href={CONTACT.emailHref} className="group flex items-center gap-3 text-ivory/70 transition-colors hover:text-gold">
                    <Mail className="h-4 w-4 text-gold/60" strokeWidth={1.5} />
                    <span className="link-sweep self-start" dir="ltr">{CONTACT.emailDisplay}</span>
                  </a>
                </li>
                <li>
                  <a href={CONTACT.instagramHref} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-ivory/70 transition-colors hover:text-gold">
                    <Instagram className="h-4 w-4 text-gold/60" strokeWidth={1.5} />
                    <span className="link-sweep self-start" dir="ltr">{CONTACT.instagramDisplay}</span>
                  </a>
                </li>
              </ul>

              <p className="mt-4 text-center text-[10px] leading-5 text-ivory/35">{CONTACT.hours}</p>
            </div>

            {/* کنش‌ها */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleSave}
                aria-label="ذخیره در مخاطبین"
                className="group flex h-12 items-center justify-center gap-2.5 border border-gold/50 bg-gold/10 px-4 text-[12px] font-bold text-gold transition-colors duration-500 hover:bg-gold/20"
              >
                <Download className="h-4 w-4" strokeWidth={1.5} />
                ذخیره در مخاطبین
              </button>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="رونوشت اطلاعات کارت"
                className="group flex h-12 items-center justify-center gap-2.5 border border-ivory/20 px-4 text-[12px] font-bold text-ivory/80 transition-colors duration-500 hover:border-gold/60 hover:text-gold"
              >
                <Copy className="h-4 w-4" strokeWidth={1.5} />
                رونوشت اطلاعات
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
