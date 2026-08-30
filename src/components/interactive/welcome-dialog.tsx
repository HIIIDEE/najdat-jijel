"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake, LifeBuoy, Gift, Truck, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type { AvailableLocale } from "@/i18n/locales";

const STORAGE_KEY = "haba_welcome_seen_v1";

const rolesAr = [
  { href: "/help", icon: LifeBuoy, title: "أنا متضرر", desc: "أحتاج مساعدة عاجلة لي أو لعائلتي" },
  { href: "/donate", icon: Gift, title: "لدي مساعدات", desc: "أملك مواد وأريد إيصالها لمن يحتاجها" },
  { href: "/transport", icon: Truck, title: "أستطيع النقل", desc: "لدي مركبة ومساحة فارغة على الطريق" },
  { href: "/needs", icon: Eye, title: "أتصفّح فقط", desc: "أريد الاطلاع على الاحتياجات الحالية" },
];

const rolesFr = [
  { href: "/help", icon: LifeBuoy, title: "J'ai besoin d'aide", desc: "Aide urgente pour moi ou ma famille" },
  { href: "/donate", icon: Gift, title: "J'ai des dons", desc: "Fournir des dons matériels utiles" },
  { href: "/transport", icon: Truck, title: "Je peux transporter", desc: "Véhicule disponible pour acheminer" },
  { href: "/needs", icon: Eye, title: "Je consulte", desc: "Consulter les besoins actifs" },
];

export function WelcomeDialog({ locale = "ar" }: { locale?: AvailableLocale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isFr = locale === "fr";
  const roles = isFr ? rolesFr : rolesAr;

  useEffect(() => {
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
          <DialogTitle className="text-center text-xl">
            {isFr ? `Bienvenue sur ${siteConfig.shortName}` : `أهلاً بك في ${siteConfig.shortName}`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isFr
              ? "Nous coordonnons la solidarité — Choisissez votre situation pour être orienté directement."
              : `${siteConfig.tagline} — اختر ما ينطبق عليك لنوجّهك مباشرة.`}
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
          {isFr ? "Passer" : "تخطّي"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
