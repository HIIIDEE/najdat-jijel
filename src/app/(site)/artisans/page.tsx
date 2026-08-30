import type { Metadata } from "next";
import { ArtisanForm } from "./artisan-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.artisans.pageTitle,
    description: t.artisans.pageSubtitle,
  };
}

export default async function ArtisansPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">{t.artisans.pageTitle}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.artisans.pageSubtitle}
        </p>
      </div>
      <ArtisanForm locale={locale} />
    </div>
  );
}
