import type { Metadata } from "next";
import { MapPin, TriangleAlert, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { LinkButton } from "@/components/shared/link-button";
import { getAffectedAreas } from "@/lib/data/public";
import { AreasFilters } from "./areas-filters";
import { severityLabels, severityRank } from "@/lib/constants";

export const metadata: Metadata = {
  title: "المناطق المتضررة",
  description:
    "قائمة المناطق المتضررة من حرائق 2026 عبر ولايات جيجل وبجاية وميلة وسكيكدة، مع حالة كل منطقة.",
};

export default async function AffectedAreasPage({
  searchParams,
}: {
  searchParams: Promise<{ wilaya?: string; severity?: string }>;
}) {
  const [params, areas] = await Promise.all([searchParams, getAffectedAreas()]);

  const wilayas = [...new Set(areas.map((a) => a.wilaya))];
  const severities = [...new Set(areas.map((a) => a.severity))].sort(
    (a, b) => severityRank[a] - severityRank[b],
  );

  const filtered = areas.filter((a) => {
    if (params.wilaya && a.wilaya !== params.wilaya) return false;
    if (params.severity && a.severity !== params.severity) return false;
    return true;
  });

  // تجميع حسب الولاية ثم الدائرة
  const byWilaya = new Map<string, Map<string, typeof filtered>>();
  for (const a of [...filtered].sort(
    (x, y) => severityRank[x.severity] - severityRank[y.severity],
  )) {
    const dairas = byWilaya.get(a.wilaya) ?? new Map();
    dairas.set(a.daira, [...(dairas.get(a.daira) ?? []), a]);
    byWilaya.set(a.wilaya, dairas);
  }

  const counts = severities.map((s) => ({
    severity: s,
    count: areas.filter((a) => a.severity === s).length,
  }));
  const unconfirmed = areas.filter((a) => a.severity === "unconfirmed").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 text-center sm:text-right">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold sm:justify-start">
          <TriangleAlert className="size-7 text-priority-critical" />
          المناطق المتضررة
        </h1>
        <p className="mt-2 text-muted-foreground">
          {areas.length} منطقة مسجَّلة عبر {wilayas.length} ولايات — {wilayas.join("، ")}.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {counts.map((c) => (
          <Card key={c.severity} className="py-3">
            <CardContent className="px-3 text-center">
              <p className="text-xl font-bold tabular-nums">{c.count}</p>
              <p className="text-[11px] text-muted-foreground">{severityLabels[c.severity]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {unconfirmed > 0 && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-border bg-muted/50 p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{unconfirmed} بلاغات</strong> من هذه القائمة مصدرها
            مواقع التواصل الاجتماعي ولم تُؤكَّد ميدانيًا بعد، وهي مُعلَّمة بوضوح. تحقّق منها قبل
            بناء أي قرار عليها.
          </p>
        </div>
      )}

      <AreasFilters wilayas={wilayas} severities={severities} />

      <p className="mt-6 text-sm text-muted-foreground">
        عرض <strong className="text-foreground">{filtered.length}</strong> من أصل {areas.length}{" "}
        منطقة
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد مناطق مطابقة"
          description="جرّب تغيير الفلاتر."
          className="mt-4"
        />
      ) : (
        <div className="mt-6 space-y-8">
          {[...byWilaya.entries()].map(([wilaya, dairas]) => (
            <section key={wilaya}>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
                <MapPin className="size-5 text-algeria-green" />
                ولاية {wilaya}
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {[...dairas.values()].flat().length}
                </span>
              </h2>
              <div className="space-y-4">
                {[...dairas.entries()].map(([daira, items]) => (
                  <div key={daira}>
                    <p className="mb-2 text-sm font-semibold text-muted-foreground">
                      دائرة {daira}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((a) => (
                        <Card key={a.id} className="py-4">
                          <CardContent className="space-y-1.5 px-4">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-bold leading-tight">{a.spot}</p>
                              <SeverityBadge severity={a.severity} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              بلدية {a.commune}
                            </p>
                            {a.commune_fr && (
                              <p className="text-[11px] text-muted-foreground/70" dir="ltr">
                                {a.commune_fr}
                                {a.spot_fr ? ` — ${a.spot_fr}` : ""}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border bg-secondary/30 p-8 text-center">
        <h2 className="text-xl font-bold">هل أنت من إحدى هذه المناطق؟</h2>
        <p className="max-w-lg text-sm text-muted-foreground">
          سجّل احتياج عائلتك ليصل إلى فرق التنسيق مباشرة، أو تصفّح الاحتياجات إن كنت تريد
          المساعدة.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <LinkButton href="/help">🆘 تسجيل طلب مساعدة</LinkButton>
          <LinkButton href="/needs" variant="outline">
            عرض الاحتياجات
          </LinkButton>
        </div>
      </div>

      {areas[0]?.source && (
        <p className="mt-6 text-center text-xs text-muted-foreground">{areas[0].source}</p>
      )}
    </div>
  );
}
