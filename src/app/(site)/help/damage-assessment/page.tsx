import type { Metadata } from "next";
import Link from "next/link";
import { DamageAssessmentForm } from "./damage-assessment-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.damageAssessment.pageTitle,
    description: t.damageAssessment.pageSubtitle,
  };
}

export default async function DamageAssessmentPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">{t.damageAssessment.pageTitle}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.damageAssessment.pageSubtitle}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.damageAssessment.artisanPrompt}{" "}
          <Link href="/artisans" className="font-medium text-algeria-green hover:underline">
            {t.damageAssessment.artisanLink}
          </Link>
          .
        </p>
      </div>
      <DamageAssessmentForm locale={locale} />
    </div>
  );
}
