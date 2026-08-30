import type { Metadata } from "next";
import { MapPin, TriangleAlert, Info, Gift, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { LinkButton } from "@/components/shared/link-button";
import { getAffectedAreas } from "@/lib/data/public";
import { AreasFilters } from "./areas-filters";
import { getSeverityLabel, severityRank } from "@/lib/constants";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.nav.affectedAreas,
    description: t.affectedAreas.pageSubtitle,
  };
}

export default async function AffectedAreasPage({
  searchParams,
}: {
  searchParams: Promise<{ wilaya?: string; severity?: string }>;
}) {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const isFr = locale === "fr";
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

  // Group by wilaya then daira
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
      <div className="mb-6 text-center sm:text-start">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold sm:justify-start">
          <TriangleAlert className="size-7 text-priority-critical" />
          {t.affectedAreas.pageTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isFr
            ? `${areas.length} zones enregistrées dans ${wilayas.length} wilayas — ${wilayas.join(", ")}.`
            : `${areas.length} منطقة مسجَّلة عبر ${wilayas.length} ولايات — ${wilayas.join("، ")}.`}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {counts.map((c) => (
          <Card key={c.severity} className="py-3">
            <CardContent className="px-3 text-center">
              <p className="text-xl font-bold tabular-nums">{c.count}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {getSeverityLabel(c.severity, locale)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {unconfirmed > 0 && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-border bg-muted/50 p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isFr ? (
              <>
                <strong className="text-foreground">{unconfirmed} signalements</strong> sur cette liste proviennent des réseaux sociaux et n&apos;ont pas encore été confirmés sur le terrain.
              </>
            ) : (
              <>
                <strong className="text-foreground">{unconfirmed} بلاغات</strong> من هذه القائمة مصدرها مواقع التواصل الاجتماعي ولم تُؤكَّد ميدانيًا بعد، وهي مُعلَّمة بوضوح.
              </>
            )}
          </p>
        </div>
      )}

      <AreasFilters
        wilayas={wilayas}
        severities={severities}
        locale={locale}
        labels={{
          wilaya: t.affectedAreas.filterWilaya,
          severity: t.affectedAreas.filterSeverity,
          clearFilters: t.affectedAreas.clearFilters,
        }}
      />

      <p className="mt-6 text-sm text-muted-foreground">
        {t.affectedAreas.showingPrefix} <strong className="text-foreground">{filtered.length}</strong> {t.affectedAreas.outOf} {areas.length}{" "}
        {t.affectedAreas.areasCount}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title={t.affectedAreas.emptyTitle}
          description={t.affectedAreas.emptyDesc}
          className="mt-4"
        />
      ) : (
        <div className="mt-6 space-y-8">
          {[...byWilaya.entries()].map(([wilaya, dairas]) => (
            <section key={wilaya}>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
                <MapPin className="size-5 text-algeria-green" />
                {isFr ? `Wilaya de ${wilaya}` : `ولاية ${wilaya}`}
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {[...dairas.values()].flat().length}
                </span>
              </h2>
              <div className="space-y-4">
                {[...dairas.entries()].map(([daira, items]) => (
                  <div key={daira}>
                    <p className="mb-2 text-sm font-semibold text-muted-foreground">
                      {isFr ? `Daïra de ${daira}` : `دائرة ${daira}`}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((a) => (
                        <Card key={a.id} className="py-4">
                          <CardContent className="space-y-1.5 px-4">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-bold leading-tight">{isFr && a.spot_fr ? a.spot_fr : a.spot}</p>
                              <SeverityBadge severity={a.severity} locale={locale} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {isFr ? `Commune de ${a.commune_fr || a.commune}` : `بلدية ${a.commune}`}
                            </p>
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
        <h2 className="text-xl font-bold">
          {isFr ? "Voulez-vous contribuer aux secours dans ces zones ?" : "هل ترغب في المساهمة في إغاثة هذه المناطق؟"}
        </h2>
        <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
          {isFr
            ? "Enregistrez vos dons matériels disponibles ou proposez votre véhicule pour acheminer les secours directement vers les points de collecte."
            : "سجّل ما يتوفر لديك من قوافل ومواد إغاثية أو تطوع بمركبتك لنقل المساعدات مباشرة إلى مراكز التجميع."}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <LinkButton href="/donate">
            <Gift className="size-4" /> {t.cta.haveAid}
          </LinkButton>
          <LinkButton href="/transport" variant="outline">
            <Truck className="size-4" /> {t.cta.canTransport}
          </LinkButton>
        </div>
      </div>

      {areas[0]?.source && (
        <p className="mt-6 text-center text-xs text-muted-foreground">{areas[0].source}</p>
      )}
    </div>
  );
}
