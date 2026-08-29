"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake, Gift, Truck, Stethoscope, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const STORAGE_KEY = "haba_welcome_seen_v1";

const roles = [
  { href: "/donate", icon: Gift, title: "لدي مساعدات", desc: "أملك مواد وأريد إيصالها لمن يحتاجها" },
  { href: "/transport", icon: Truck, title: "أستطيع النقل", desc: "لدي مركبة ومساحة فارغة على الطريق" },
  { href: "/medical", icon: Stethoscope, title: "أنا طبيب / بيطري", desc: "تقديم الرعاية والاستشارات الميدانية" },
  { href: "/map", icon: MapPin, title: "خريطة الإغاثة", desc: "مراكز التجميع ونقاط الاستقبال" },
];

export function WelcomeDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // يُعرض مرة واحدة فقط لكل زائر، وبعد أول رسم للصفحة حتى لا يحجب المحتوى فورًا
    if (localStorage.getItem(STORAGE_KEY)) return;
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  function choose(href: string) {
    dismiss();
    router.push(href);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) dismiss();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-1 flex size-12 items-center justify-center rounded-full bg-algeria-green text-algeria-green-foreground">
            <HeartHandshake className="size-6" />
          </div>
          <DialogTitle className="text-center text-xl">أهلاً بك في {siteConfig.shortName}</DialogTitle>
          <DialogDescription className="text-center">
            {siteConfig.tagline} — اختر ما ينطبق عليك لنوجّهك مباشرة.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 sm:grid-cols-2">
          {roles.map((r) => (
            <button
              key={r.href}
              type="button"
              onClick={() => choose(r.href)}
              className="flex flex-col items-center gap-1 rounded-xl border border-border p-4 text-center transition-all hover:-translate-y-0.5 hover:border-algeria-green hover:bg-algeria-green/5"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-algeria-green/10 text-algeria-green">
                <r.icon className="size-5" aria-hidden />
              </span>
              <span className="font-bold">{r.title}</span>
              <span className="text-xs text-muted-foreground">{r.desc}</span>
            </button>
          ))}
        </div>

        <Button variant="ghost" onClick={dismiss} className="w-full text-muted-foreground">
          تخطّي
        </Button>
      </DialogContent>
    </Dialog>
  );
}
