import type { Metadata } from "next";
import { getCategories } from "@/lib/data/public";
import { DonationForm } from "./donation-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.cta.haveAid,
    description: t.donate.pageSubtitle,
  };
}

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const [categories, params] = await Promise.all([getCategories(), searchParams]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">{t.donate.pageTitle}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.donate.pageSubtitle}
        </p>
      </div>

      <DonationForm
        categories={categories}
        defaultCategorySlug={params.category}
        locale={locale}
      />
    </div>
  );
}
