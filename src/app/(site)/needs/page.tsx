import type { Metadata } from "next";
import { NeedCard } from "@/components/shared/need-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getAllActiveNeeds, getCategories } from "@/lib/data/public";
import { NeedsFilters } from "./needs-filters";

export const metadata: Metadata = {
  title: "الاحتياجات العاجلة",
  description: "ماذا تحتاج جيجل الآن؟ تصفّح الاحتياجات النشطة حسب النوع والبلدية والأولوية.",
};

export default async function NeedsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; commune?: string; priority?: string }>;
}) {
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
      <div className="mb-6 text-center sm:text-right">
        <h1 className="text-3xl font-extrabold">ماذا تحتاج جيجل الآن؟</h1>
        <p className="mt-2 text-muted-foreground">
          بيانات مباشرة من الفرق الميدانية وفريق التنسيق، وتُحدَّث باستمرار.
        </p>
      </div>

      <NeedsFilters categories={relevantCategories} communes={communes} />

      <p className="mt-6 text-sm text-muted-foreground">
        عرض <strong className="text-foreground">{filtered.length}</strong> من أصل {needs.length}{" "}
        احتياج نشط
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد احتياجات مطابقة"
          description="جرّب تغيير الفلاتر، أو تحقق لاحقًا فالبيانات تُحدَّث باستمرار."
          className="mt-4"
        />
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>
      )}
    </div>
  );
}
