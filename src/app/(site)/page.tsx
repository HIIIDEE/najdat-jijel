import Link from "next/link";
import {
  MapPin,
  ClipboardList,
  Truck,
  ListChecks,
  ArrowLeft,
  Home,
  Phone,
  ShieldCheck,
  TriangleAlert,
  Stethoscope,
  LifeBuoy,
  Gift,
  Hammer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { NewsTicker } from "@/components/shared/news-ticker";
import { PlatformNotice } from "@/components/shared/platform-notice";
import { NeedCard } from "@/components/shared/need-card";
import { EmptyState } from "@/components/shared/empty-state";
import { AnimatedCounter } from "@/components/interactive/animated-counter";
import { siteConfig } from "@/config/site";
import { formatRelativeTime } from "@/lib/constants";
import { emergencyContacts } from "@/lib/emergency";
import {
  getAffectedAreas,
  getAffectedCommunes,
  getCriticalNeeds,
  getOfficialUpdates,
  getPublicMedicalVolunteers,
  getShelters,
  getStatOverview,
} from "@/lib/data/public";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  const quickActions = [
    { href: "/help", icon: LifeBuoy, title: t.home.actions.help.title, desc: t.home.actions.help.desc },
    { href: "/donate", icon: Gift, title: t.home.actions.donate.title, desc: t.home.actions.donate.desc },
    { href: "/transport", icon: Truck, title: t.home.actions.transport.title, desc: t.home.actions.transport.desc },
    { href: "/medical", icon: Stethoscope, title: t.home.actions.medical.title, desc: t.home.actions.medical.desc },
    { href: "/map", icon: MapPin, title: t.home.actions.map.title, desc: t.home.actions.map.desc },
  ];

  const howItWorks = [
    { n: 1, title: t.home.howItWorks.step1.title, desc: t.home.howItWorks.step1.desc, icon: ClipboardList },
    { n: 2, title: t.home.howItWorks.step2.title, desc: t.home.howItWorks.step2.desc, icon: ListChecks },
    { n: 3, title: t.home.howItWorks.step3.title, desc: t.home.howItWorks.step3.desc, icon: MapPin },
    { n: 4, title: t.home.howItWorks.step4.title, desc: t.home.howItWorks.step4.desc, icon: Truck },
  ];

  const [
    criticalNeeds,
    stats,
    updates,
    shelters,
    communes,
    areas,
    medicalVolunteers,
  ] = await Promise.all([
    getCriticalNeeds(6),
    getStatOverview(),
    getOfficialUpdates(3),
    getShelters(),
    getAffectedCommunes(),
    getAffectedAreas(),
    getPublicMedicalVolunteers(),
  ]);

  const areaWilayas = [...new Set(areas.map((a) => a.wilaya))];

  return (
    <>
      <NewsTicker />

      {/* ————————————————————————————————— Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-algeria-green/8 via-secondary/40 to-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,var(--algeria-green)/12,transparent)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-algeria-green/25 bg-algeria-green/10 px-3 py-1 text-xs font-semibold text-algeria-green">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-algeria-green opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-algeria-green" />
            </span>
            {t.home.heroTag}
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {siteConfig.shortName}
          </h1>
          <p className="mt-3 text-lg font-medium text-algeria-green sm:text-xl">{t.site.tagline}</p>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.home.heroDesc}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href} className="group">
                <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:border-algeria-green group-hover:shadow-lg">
                  <CardContent className="flex h-full flex-col items-center gap-2 px-4 py-5 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-algeria-green/10 text-algeria-green transition-transform group-hover:scale-110">
                      <a.icon className="size-6" aria-hidden />
                    </span>
                    <p className="font-bold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* شريط أرقام حيّ */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: t.home.stats.activeNeeds, value: Number(stats.critical_needs ?? 0), tone: "text-priority-critical" },
              { label: t.home.stats.points, value: Number(stats.active_points ?? 0), tone: "text-algeria-green" },
              { label: t.home.stats.areas, value: areas.length, tone: "text-priority-high" },
              { label: t.home.stats.shelters, value: shelters.length, tone: "text-[#7c3aed]" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                <AnimatedCounter value={s.value} className={`block text-2xl font-bold tabular-nums ${s.tone}`} />
                <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————————————————————————————————— الاحتياجات العاجلة */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{t.home.urgentNeeds.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.home.urgentNeeds.subtitle}
            </p>
          </div>
          <LinkButton href="/needs" variant="outline" className="hidden sm:inline-flex">
            {t.home.urgentNeeds.viewAll} <ArrowLeft className="size-4" />
          </LinkButton>
        </div>

        {criticalNeeds.length === 0 ? (
          <EmptyState
            title={t.home.urgentNeeds.emptyTitle}
            description={t.home.urgentNeeds.emptyDesc}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {criticalNeeds.map((need) => (
              <NeedCard key={need.id} need={need} locale={locale} />
            ))}
          </div>
        )}

        <LinkButton href="/needs" variant="outline" className="mt-6 w-full sm:hidden">
          {t.home.urgentNeeds.viewAllMobile}
        </LinkButton>
      </section>

      {/* ————————————————————————————————— المناطق المتضررة */}
      {areas.length > 0 && (
        <section className="border-y border-border bg-priority-critical/5">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <TriangleAlert className="size-5 text-priority-critical" />
                  {t.home.affectedAreas.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {areas.length} {t.home.affectedAreas.subtitleCount} {areaWilayas.length} {t.home.affectedAreas.subtitleWilayas}
                </p>
              </div>
              <LinkButton href="/affected-areas" variant="outline" size="sm" className="hidden sm:inline-flex">
                {t.home.affectedAreas.fullList}
              </LinkButton>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {areaWilayas.map((w) => {
                const items = areas.filter((a) => a.wilaya === w);
                const severe = items.filter(
                  (a) => a.severity === "ravaged" || a.severity === "evacuated",
                ).length;
                return (
                  <Link
                    key={w}
                    href={`/affected-areas?wilaya=${encodeURIComponent(w)}`}
                    className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-priority-critical hover:shadow-md"
                  >
                    <p className="flex items-center justify-between font-bold">
                      {t.home.affectedAreas.wilayaPrefix} {w}
                      <span className="text-2xl font-extrabold tabular-nums text-priority-critical">
                        {items.length}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {severe > 0
                        ? `${severe} ${t.home.affectedAreas.severeCount}`
                        : t.home.affectedAreas.recordedCount}
                    </p>
                  </Link>
                );
              })}
            </div>

            <LinkButton href="/affected-areas" variant="outline" className="mt-5 w-full sm:hidden">
              {t.home.affectedAreas.fullListMobile}
            </LinkButton>
          </div>
        </section>
      )}

      {/* ————————————————————————————————— البلديات المتضررة */}
      {communes.length > 0 && (
        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="mb-1 text-2xl font-bold">{t.home.communes.title}</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {t.home.communes.subtitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {communes.map((c) => (
                <Link
                  key={c.commune}
                  href={`/needs?commune=${encodeURIComponent(c.commune)}`}
                  className="group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-algeria-green hover:shadow-sm"
                >
                  <MapPin className="size-3.5 text-muted-foreground group-hover:text-algeria-green" />
                  <span className="font-medium">{c.commune}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                      c.critical > 0
                        ? "bg-priority-critical/10 text-priority-critical"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.total}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ————————————————————————————————— مراكز الإيواء */}
      {shelters.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <Home className="size-5 text-[#7c3aed]" /> {t.home.shelters.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.home.shelters.subtitle}
              </p>
            </div>
            <LinkButton href="/map" variant="outline" size="sm" className="hidden sm:inline-flex">
              {t.home.shelters.onMap}
            </LinkButton>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shelters.slice(0, 6).map((s) => (
              <Card key={s.id}>
                <CardContent className="space-y-2 px-5">
                  <p className="font-bold leading-tight">{s.name}</p>
                  <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" />
                    {s.address ?? `${s.commune}، ${t.common.wilayaPrefix} ${s.wilaya}`}
                  </p>
                  {s.capacity_note && (
                    <p className="text-xs text-muted-foreground">{s.capacity_note}</p>
                  )}
                  {s.phone && (
                    <a
                      href={`tel:${s.phone.replace(/\s/g, "")}`}
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-algeria-green hover:underline"
                    >
                      <Phone className="size-3.5" /> {s.phone}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ————————————————————————————————— الأطقم الطبية والبيطرية */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Stethoscope className="size-5 text-algeria-green" /> {t.home.medical.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.home.medical.subtitle}
            </p>
          </div>
          <LinkButton href="/medical" variant="outline" size="sm" className="hidden sm:inline-flex">
            {t.home.medical.registerBtn}
          </LinkButton>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {medicalVolunteers?.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="space-y-2 px-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold leading-tight">{doc.full_name}</p>
                  <span className="rounded-full bg-algeria-green/10 px-2.5 py-0.5 text-xs font-semibold text-algeria-green shrink-0">
                    {doc.specialty}
                  </span>
                </div>

                <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-3.5 shrink-0" />
                  {doc.commune_id}
                </p>

                {doc.current_workplace && (
                  <p className="text-xs text-muted-foreground">{doc.current_workplace}</p>
                )}

                {doc.can_teleconsult && (
                  <p className="text-xs font-medium text-algeria-green">{t.home.medical.teleconsult}</p>
                )}

                {doc.phone && (
                  <a
                    href={`tel:${doc.phone.replace(/\s/g, "")}`}
                    dir="ltr"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-algeria-green hover:underline pt-1"
                  >
                    <Phone className="size-3.5" /> {doc.phone}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <LinkButton href="/medical" variant="outline" className="mt-5 w-full sm:hidden">
          {t.home.medical.registerBtnMobile}
        </LinkButton>
      </section>

      {/* ————————————————————————————————— ترميم المنازل */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-14 text-center">
          <Hammer className="size-8 text-algeria-green" />
          <h2 className="text-2xl font-bold">{t.home.reconstruction.title}</h2>
          <p className="max-w-xl text-muted-foreground">{t.home.reconstruction.desc}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton href="/help/damage-assessment" size="lg">
              {t.home.reconstruction.damageBtn}
            </LinkButton>
            <LinkButton href="/artisans" size="lg" variant="outline">
              {t.home.reconstruction.artisanBtn}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ————————————————————————————————— أرقام الطوارئ */}
      <section className="border-y border-border bg-priority-critical/5">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-1 text-center text-2xl font-bold">{t.home.emergency.title}</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {t.home.emergency.subtitle}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {emergencyContacts.map((c) => (
              <div
                key={c.label}
                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-priority-critical hover:shadow-md"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-priority-critical/10 text-priority-critical">
                  <c.icon className="size-5" aria-hidden />
                </span>
                <a
                  href={`tel:${c.number}`}
                  className="text-2xl font-extrabold tabular-nums text-priority-critical hover:underline"
                >
                  {c.number}
                </a>
                <span className="text-sm font-semibold">{c.label}</span>
                {c.hint && <span className="text-xs text-muted-foreground">{c.hint}</span>}
                {c.greenNumber && (
                  <a
                    href={`tel:${c.greenNumber}`}
                    className="mt-1 rounded-full bg-algeria-green/10 px-2.5 py-0.5 text-xs font-semibold text-algeria-green hover:underline"
                  >
                    {t.home.emergency.greenNumberPrefix} {c.greenNumber}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————————————————————————————————— كيف تعمل المنصة */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-8 text-center text-2xl font-bold">{t.home.howItWorks.title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step) => (
            <div key={step.n} className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-algeria-green/10 text-algeria-green">
                <step.icon className="size-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-algeria-green">{step.n}</p>
              <p className="mt-1 font-bold">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ————————————————————————————————— المستجدات */}
      {updates.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-14">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="text-2xl font-bold">{t.home.updates.title}</h2>
            <LinkButton href="/official-information" variant="outline" size="sm">
              {t.home.updates.allInfo}
            </LinkButton>
          </div>
          <div className="space-y-3">
            {updates.map((u) => (
              <Card key={u.id}>
                <CardContent className="flex flex-col gap-1 px-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold">{u.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatRelativeTime(u.published_at, locale)}
                    </span>
                  </div>
                  {u.body ? <p className="text-sm text-muted-foreground">{u.body}</p> : null}
                  <p className="text-xs text-muted-foreground">{t.home.updates.sourcePrefix}{u.source}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ————————————————————————————————— الشفافية */}
      <section className="border-t border-border bg-algeria-green/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-14 text-center">
          <ShieldCheck className="size-8 text-algeria-green" />
          <h2 className="text-2xl font-bold">{t.home.transparencyCallout.title}</h2>
          <p className="max-w-xl text-muted-foreground">
            {t.home.transparencyCallout.desc}
          </p>
          <LinkButton href="/transparency" size="lg" variant="outline">
            {t.home.transparencyCallout.btn}
          </LinkButton>
        </div>
      </section>

      {/* ————————————————————————————————— ملاحظة هامة */}
      <PlatformNotice locale={locale} />
    </>
  );
}
