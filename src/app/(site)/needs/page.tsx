import type { Metadata } from "next";
import { NeedCard } from "@/components/shared/need-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getAllActiveNeeds, getCategories } from "@/lib/data/public";
import { NeedsFilters } from "./needs-filters";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.nav.needs,
    description: t.needs.pageSubtitle,
  };
}

export default async function NeedsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; commune?: string; priority?: string }>;
}) {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const params = await searchParams;
  const [needs, categories] = await Promise.all([getAllActiveNeeds(), getCategories()]);

  const communes = [...new Set(needs.map((n) => n.commune))].sort();
  const usedCategorySlugs = new Set(needs.map((n) => n.categories?.slug).filter(Boolean));
  const relevantCategories = categories.filter((c) => usedCategorySlugs.has(c.slug));

  const filtered = needs.filter((n) => {
    if (params.category && n.categories?.slug !== params.category) return false;
    if (params.commune && n.commune !== params.commune) return false;
    if (params.priority && n.priority !== params.priority) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 text-center sm:text-start">
        <h1 className="text-3xl font-extrabold">{t.needs.pageTitle}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.needs.pageSubtitle}
        </p>
      </div>

      <NeedsFilters
        categories={relevantCategories}
        communes={communes}
        locale={locale}
        labels={{
          priority: t.needs.filterPriority,
          commune: t.needs.filterCommune,
          category: t.needs.filterCategory,
          clearFilters: t.needs.clearFilters,
        }}
      />

      <p className="mt-6 text-sm text-muted-foreground">
        {t.needs.showingPrefix} <strong className="text-foreground">{filtered.length}</strong> {t.needs.outOf} {needs.length}{" "}
        {t.needs.activeNeedsCount}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title={t.needs.emptyTitle}
          description={t.needs.emptyDesc}
          className="mt-4"
        />
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((need) => (
            <NeedCard key={need.id} need={need} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
