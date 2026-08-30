import type { Metadata } from "next";
import { Radio, ShieldCheck } from "lucide-react";
import { getOfficialUpdates } from "@/lib/data/public";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { OfficialInfoClient } from "./official-info-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.nav.officialInformation,
    description: t.officialInformation.pageSubtitle,
  };
}

export default async function OfficialInformationPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const isFr = locale === "fr";
  const updates = await getOfficialUpdates(50);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10 text-center sm:text-start">
        <div className="inline-flex items-center gap-2 rounded-full border border-algeria-green/30 bg-algeria-green/10 px-3.5 py-1 text-xs font-bold text-algeria-green mb-3">
          <Radio className="size-3.5 animate-pulse" />
          <span>{isFr ? "Couverture vérifiée des sources officielles" : "تغطية حية موثقة للمصادر الرسمية"}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
          {t.officialInformation.pageTitle}
        </h1>

        <p className="mt-2 text-xs sm:text-base leading-relaxed text-muted-foreground max-w-3xl">
          {t.officialInformation.pageSubtitle}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-algeria-green font-semibold">
          <ShieldCheck className="size-4 shrink-0" />
          <span>{isFr ? "Chaque communiqué est vérifié avec le lien officiel source pour éviter les fausses informations" : "يتم التحقق من كل بيان مع رابط المصدر الأصلي لتفادي الشائعات"}</span>
        </div>
      </div>

      {/* Main Interactive Filter & News Deck */}
      <OfficialInfoClient initialUpdates={updates} locale={locale} />
    </div>
  );
}
