import type { Metadata } from "next";
import { HelpRequestForm } from "./help-request-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.cta.needHelp,
    description: t.help.pageSubtitle,
  };
}

export default async function HelpPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">{t.help.pageTitle}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.help.pageSubtitle}
        </p>
      </div>

      <HelpRequestForm locale={locale} />
    </div>
  );
}
