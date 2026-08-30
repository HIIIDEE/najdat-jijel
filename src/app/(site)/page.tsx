import Link from "next/link";
import {
  MapPin,
  Truck,
  ArrowLeft,
  Home,
  Phone,
  ShieldCheck,
  TriangleAlert,
  Stethoscope,
  Gift,
  CheckCircle2,
  Radio,
  LifeBuoy,
} from "lucide-react";
import { LinkButton } from "@/components/shared/link-button";
import { PlatformNotice } from "@/components/shared/platform-notice";
import { OfficialUpdateCard } from "@/components/shared/official-update-card";
import { AnimatedCounter } from "@/components/interactive/animated-counter";
import { siteConfig } from "@/config/site";
import { emergencyContacts } from "@/lib/emergency";
import {
  getAffectedAreas,
  getOfficialUpdates,
  getPublicMedicalVolunteers,
  getShelters,
  getStatOverview,
} from "@/lib/data/public";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

const severityConfig: Record<string, { label: string; tone: string }> = {
  burning: { label: "حريق نشط", tone: "bg-priority-critical/15 text-priority-critical border-priority-critical/30" },
  evacuated: { label: "إجلاء سكان", tone: "bg-priority-critical/15 text-priority-critical border-priority-critical/30" },
  threatened: { label: "مهددة بالخطر", tone: "bg-priority-high/15 text-priority-high border-priority-high/30" },
  ravaged: { label: "أضرار جسيمة", tone: "bg-priority-critical/15 text-priority-critical border-priority-critical/30" },
  contained: { label: "تحت السيطرة", tone: "bg-algeria-green/15 text-algeria-green border-algeria-green/30" },
};

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const isFr = locale === "fr";

  const quickActions = [
    {
      href: "/donate",
      icon: Gift,
      title: t.home.actions.donate.title,
      desc: t.home.actions.donate.desc,
      badge: "إغاثة",
      accent: "border-algeria-green/40 bg-algeria-green/5 hover:border-algeria-green hover:bg-algeria-green/10 shadow-sm",
      iconBg: "bg-algeria-green/15 text-algeria-green",
      badgeColor: "bg-algeria-green/15 text-algeria-green",
    },
    {
      href: "/transport",
      icon: Truck,
      title: t.home.actions.transport.title,
      desc: t.home.actions.transport.desc,
      accent: "hover:border-blue-500 hover:shadow-md",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      href: "/medical",
      icon: Stethoscope,
      title: t.home.actions.medical.title,
      desc: t.home.actions.medical.desc,
      accent: "hover:border-emerald-500 hover:shadow-md",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      href: "/map",
      icon: MapPin,
      title: t.home.actions.map.title,
      desc: t.home.actions.map.desc,
      accent: "hover:border-purple-500 hover:shadow-md",
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  const howItWorks = [
    { n: 1, title: t.home.howItWorks.step1.title, desc: t.home.howItWorks.step1.desc, icon: TriangleAlert },
    { n: 2, title: t.home.howItWorks.step2.title, desc: t.home.howItWorks.step2.desc, icon: Gift },
    { n: 3, title: t.home.howItWorks.step3.title, desc: t.home.howItWorks.step3.desc, icon: Truck },
    { n: 4, title: t.home.howItWorks.step4.title, desc: t.home.howItWorks.step4.desc, icon: ShieldCheck },
  ];

  const [
    stats,
    updates,
    shelters,
    areas,
    medicalVolunteers,
  ] = await Promise.all([
    getStatOverview(),
    getOfficialUpdates(4),
    getShelters(),
    getAffectedAreas(),
    getPublicMedicalVolunteers(),
  ]);

  const areaWilayas = [...new Set(areas.map((a) => a.wilaya))];

  return (
    <>
      {/* ————————————————————————————————— Hero (Full Viewport) */}
      <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden border-b border-border bg-gradient-to-b from-algeria-green/10 via-secondary/20 to-background py-8 sm:py-16">
        {/* Ambient Top Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[700px] max-w-full rounded-full bg-[radial-gradient(circle,var(--algeria-green)/14,transparent_70%)] blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 left-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--priority-critical)/8,transparent_70%)] blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 text-center">
          {/* Top Status & Emergency Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-bold text-algeria-green shadow-sm backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-algeria-green opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-algeria-green" />
              </span>
              {t.home.heroTag}
            </span>

            {/* Quick Emergency Hotlines available on mobile */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-priority-critical/30 bg-priority-critical/10 px-3 py-1 text-[11px] font-bold text-priority-critical shadow-sm">
              <Phone className="size-3 animate-pulse" />
              <span>{isFr ? "Urgences :" : "طوارئ:"}</span>
              <a href="tel:14" className="hover:underline">14 الحماية</a>
              <span>·</span>
              <a href="tel:1021" className="hover:underline">1021 الغابات</a>
              <span>·</span>
              <a href="tel:1055" className="hover:underline">1055 الدرك</a>
            </div>
          </div>

          {/* Main Title & Value Proposition */}
          <div className="mt-5 sm:mt-8 space-y-2 sm:space-y-3.5">
            <h1 className="text-3xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-tight">
              {siteConfig.shortName}
            </h1>
            <p className="text-base font-bold text-algeria-green sm:text-2xl lg:text-3xl tracking-tight">
              {t.site.tagline}
            </p>
            <p className="mx-auto max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-lg px-2">
              {t.home.heroDesc}
            </p>
          </div>

          {/* Quick Action Cards Deck (2x2 on phone, 4-across on desktop) */}
          <div className="mt-6 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href} className="group">
                <div
                  className={`relative flex h-full flex-col items-center justify-between rounded-2xl border border-border bg-card/95 p-3.5 sm:p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${a.accent}`}
                >
                  {a.badge && (
                    <span className={`absolute end-2.5 top-2.5 sm:end-3.5 sm:top-3.5 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wide ${a.badgeColor}`}>
                      {a.badge}
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <span className={`flex size-11 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl transition-transform duration-200 group-hover:scale-110 ${a.iconBg}`}>
                      <a.icon className="size-5 sm:size-7" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs sm:text-base font-bold leading-snug">{a.title}</p>
                      <p className="mt-0.5 sm:mt-1.5 text-[10px] sm:text-xs leading-normal text-muted-foreground line-clamp-2">{a.desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Live Stat Numbers Island */}
          <div className="mt-6 sm:mt-12 rounded-2xl border border-border/80 bg-card/70 p-2.5 sm:p-3.5 shadow-sm backdrop-blur-md">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
              {[
                { label: t.home.stats.points, value: Number(stats.active_points ?? 0), tone: "text-algeria-green", icon: MapPin, bg: "bg-algeria-green/10 text-algeria-green" },
                { label: t.home.stats.areas, value: areas.length, tone: "text-priority-critical", icon: TriangleAlert, bg: "bg-priority-critical/10 text-priority-critical" },
                { label: t.home.stats.shelters, value: shelters.length, tone: "text-blue-600 dark:text-blue-400", icon: Home, bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
                { label: isFr ? "Personnel médical" : "طاقم طبي وبيطري متطوع", value: medicalVolunteers.length, tone: "text-emerald-600 dark:text-emerald-400", icon: Stethoscope, bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center justify-center rounded-xl bg-background/60 p-2.5 sm:p-4 transition-all hover:bg-background/90">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className={`flex size-5 sm:size-6 items-center justify-center rounded-full ${s.bg}`}>
                      <s.icon className="size-3 sm:size-3.5" />
                    </span>
                    <AnimatedCounter value={s.value} className={`text-lg sm:text-3xl font-black tabular-nums ${s.tone}`} />
                  </div>
                  <p className="mt-1 text-[10px] sm:text-xs font-semibold text-muted-foreground text-center">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ————————————————————————————————— المناطق المتضررة */}
      {areas.length > 0 && (
        <section className="border-y border-border bg-priority-critical/5">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
            <div className="mb-6 sm:mb-8 flex items-end justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
                  <TriangleAlert className="size-5 sm:size-6 text-priority-critical" />
                  {t.home.affectedAreas.title}
                </h2>
                <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {areas.length} {t.home.affectedAreas.subtitleCount} {areaWilayas.length} {t.home.affectedAreas.subtitleWilayas}
                </p>
              </div>
              <LinkButton href="/affected-areas" variant="outline" size="sm" className="hidden sm:inline-flex">
                {t.home.affectedAreas.fullList}
              </LinkButton>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-12 items-stretch">
              {/* Wilaya Summary Card */}
              <div className={areaWilayas.length === 1 ? "md:col-span-5 lg:col-span-4" : "grid gap-3 sm:grid-cols-2 md:col-span-12 lg:grid-cols-4"}>
                {areaWilayas.map((w) => {
                  const items = areas.filter((a) => a.wilaya === w);
                  const severe = items.filter(
                    (a) => a.severity === "ravaged" || a.severity === "evacuated" || a.severity === "burning",
                  ).length;
                  return (
                    <Link
                      key={w}
                      href={`/affected-areas?wilaya=${encodeURIComponent(w)}`}
                      className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-4 sm:p-6 transition-all hover:-translate-y-0.5 hover:border-priority-critical hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-priority-critical/10 px-2.5 py-0.5 text-xs font-bold text-priority-critical">
                            {isFr ? "Zone d'alerte" : "بؤرة طوارئ"}
                          </span>
                          <span className="text-2xl sm:text-3xl font-extrabold tabular-nums text-priority-critical">
                            {items.length}
                          </span>
                        </div>
                        <p className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold">{t.home.affectedAreas.wilayaPrefix} {w}</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {severe > 0
                            ? `${severe} ${t.home.affectedAreas.severeCount}`
                            : t.home.affectedAreas.recordedCount}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-6 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-priority-critical transition-colors group-hover:text-priority-critical/80">
                        <span>{isFr ? `Voir tout : ${w}` : `عرض كل بؤر ولاية ${w}`}</span>
                        <ArrowLeft className="size-3.5 sm:size-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Active Spots Live Breakdown when 1 wilaya */}
              {areaWilayas.length === 1 && (
                <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 md:col-span-7 lg:col-span-8">
                  {areas.slice(0, 4).map((a) => {
                    const sev = severityConfig[a.severity] ?? { label: a.severity, tone: "bg-muted text-muted-foreground border-border" };
                    return (
                      <Link
                        key={a.id}
                        href={`/affected-areas?wilaya=${encodeURIComponent(a.wilaya)}`}
                        className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-3.5 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-algeria-green hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm sm:text-base leading-snug">{isFr && a.spot_fr ? a.spot_fr : a.spot}</p>
                            <p className="mt-0.5 sm:mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground">
                              <MapPin className="size-3 sm:size-3.5 text-muted-foreground/70" />
                              {isFr ? `Commune de ${a.commune_fr || a.commune} · ${a.daira_fr || a.daira}` : `بلدية ${a.commune} · دائرة ${a.daira}`}
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold ${sev.tone}`}>
                            {sev.label}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <LinkButton href="/affected-areas" variant="outline" className="mt-5 w-full sm:hidden">
              {t.home.affectedAreas.fullListMobile}
            </LinkButton>
          </div>
        </section>
      )}

      {/* ————————————————————————————————— مراكز الإيواء */}
      {shelters.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
          <div className="mb-6 sm:mb-8 flex items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
                <Home className="size-5 sm:size-6 text-blue-600 dark:text-blue-400" /> {t.home.shelters.title}
              </h2>
              <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t.home.shelters.subtitle}
              </p>
            </div>
            <LinkButton href="/map" variant="outline" size="sm" className="hidden sm:inline-flex">
              {t.home.shelters.onMap}
            </LinkButton>
          </div>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shelters.slice(0, 6).map((s) => (
              <div key={s.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 sm:p-6 transition-all hover:shadow-sm">
                <div className="space-y-2">
                  <p className="font-bold text-sm sm:text-base leading-snug">{s.name}</p>
                  <p className="flex items-start gap-1.5 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 sm:size-4 shrink-0 text-muted-foreground/70" />
                    {s.address ?? `${s.commune}، ولاية ${s.wilaya}`}
                  </p>
                  {s.capacity_note && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.capacity_note}</p>
                  )}
                </div>
                {s.phone && (
                  <div className="mt-3 sm:mt-4 pt-3 border-t border-border/60">
                    <a
                      href={`tel:${s.phone.replace(/\s/g, "")}`}
                      dir="ltr"
                      className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-lg bg-algeria-green/10 py-1.5 px-3 text-xs sm:text-sm font-bold text-algeria-green hover:bg-algeria-green/20"
                    >
                      <Phone className="size-3.5 sm:size-4" /> {s.phone}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ————————————————————————————————— الأطقم الطبية والبيطرية */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <div className="mb-6 sm:mb-8 flex items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
              <Stethoscope className="size-5 sm:size-6 text-algeria-green" /> {t.home.medical.title}
            </h2>
            <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t.home.medical.subtitle}
            </p>
          </div>
          <LinkButton href="/medical" variant="outline" size="sm" className="hidden sm:inline-flex">
            {t.home.medical.registerBtn}
          </LinkButton>
        </div>

        {medicalVolunteers && medicalVolunteers.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {medicalVolunteers.slice(0, 6).map((doc: any) => (
              <div key={doc.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 sm:p-6 transition-all hover:shadow-sm">
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-sm sm:text-base leading-snug">{doc.full_name}</p>
                    <span className="shrink-0 rounded-full bg-algeria-green/10 px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-algeria-green">
                      {doc.specialty}
                    </span>
                  </div>

                  <p className="flex items-start gap-1.5 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 sm:size-4 shrink-0 text-muted-foreground/70" />
                    {doc.commune_id}
                  </p>

                  {doc.current_workplace && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{doc.current_workplace}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
                    {doc.can_teleconsult && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3 sm:size-3.5" /> {isFr ? "Téléconsultation" : "استشارة هاتفية"}
                      </span>
                    )}
                    {doc.can_field_intervene && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <CheckCircle2 className="size-3 sm:size-3.5" /> {isFr ? "Intervention terrain" : "تدخل ميداني"}
                      </span>
                    )}
                  </div>
                </div>

                {doc.phone && (
                  <div className="mt-3 sm:mt-4 pt-3 border-t border-border/60">
                    <a
                      href={`tel:${doc.phone.replace(/\s/g, "")}`}
                      dir="ltr"
                      className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-lg bg-algeria-green/10 py-1.5 px-3 text-xs sm:text-sm font-bold text-algeria-green hover:bg-algeria-green/20"
                    >
                      <Phone className="size-3.5 sm:size-4" /> {doc.phone}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-algeria-green/30 bg-algeria-green/5 p-6 text-center sm:p-12">
            <span className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-algeria-green/10 text-algeria-green">
              <Stethoscope className="size-6 sm:size-7" />
            </span>
            <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-bold">نداء للأطباء والكوادر الصحية والبياطرة</h3>
            <p className="mx-auto mt-1.5 sm:mt-2 max-w-lg text-xs sm:text-sm leading-relaxed text-muted-foreground">
              تطوعكم يساهم في رعاية الأسر المتضررة في مراكز الإيواء وتقديم الاستشارات الطبية والبيطرية المستعجلة.
            </p>
            <LinkButton href="/medical" size="lg" className="mt-4 sm:mt-5">
              انضم إلى الفريق الطبي المتطوع
            </LinkButton>
          </div>
        )}

        <LinkButton href="/medical" variant="outline" className="mt-5 w-full sm:hidden">
          {t.home.medical.registerBtnMobile}
        </LinkButton>
      </section>

      {/* ————————————————————————————————— أرقام الطوارئ */}
      <section className="border-y border-border bg-priority-critical/5">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <h2 className="mb-1 text-center text-xl sm:text-2xl font-bold">{t.home.emergency.title}</h2>
          <p className="mb-6 text-center text-xs sm:text-sm text-muted-foreground">
            {t.home.emergency.subtitle}
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
            {emergencyContacts.map((c) => (
              <div
                key={c.label}
                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 sm:p-4 text-center transition-all hover:-translate-y-0.5 hover:border-priority-critical hover:shadow-md"
              >
                <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-priority-critical/10 text-priority-critical">
                  <c.icon className="size-4 sm:size-5" aria-hidden />
                </span>
                <a
                  href={`tel:${c.number}`}
                  className="text-xl sm:text-2xl font-extrabold tabular-nums text-priority-critical hover:underline"
                >
                  {c.number}
                </a>
                <span className="text-xs sm:text-sm font-semibold">{c.label}</span>
                {c.hint && <span className="text-[10px] sm:text-xs text-muted-foreground">{c.hint}</span>}
                {c.greenNumber && (
                  <a
                    href={`tel:${c.greenNumber}`}
                    className="mt-1 rounded-full bg-algeria-green/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-algeria-green hover:underline"
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
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h2 className="mb-6 sm:mb-8 text-center text-xl sm:text-2xl font-bold">{t.home.howItWorks.title}</h2>
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step) => (
            <div key={step.n} className="text-center p-3 rounded-xl bg-card border border-border/50 sm:border-0 sm:bg-transparent">
              <div className="mx-auto flex size-11 sm:size-14 items-center justify-center rounded-full bg-algeria-green/10 text-algeria-green">
                <step.icon className="size-5 sm:size-6" />
              </div>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm font-bold text-algeria-green">
                {isFr ? `Étape ${step.n}` : `المرحلة ${step.n}`}
              </p>
              <p className="mt-0.5 sm:mt-1 font-bold text-xs sm:text-base">{step.title}</p>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ————————————————————————————————— آخر البيانات والمستجدات الرسمية */}
      {updates.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-algeria-green/30 bg-algeria-green/10 px-3 py-1 text-xs font-bold text-algeria-green mb-2.5">
                <Radio className="size-3.5 animate-pulse" />
                <span>{isFr ? "Couverture vérifiée en direct" : "متابعة ميدانية حية وموثقة"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t.home.updates.title}</h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {isFr ? "Mises à jour des services de la Protection Civile, de la Gendarmerie (Tariki) et des Forêts." : "تحديثات لحظية من مصالح الحماية المدنية، الدرك الوطني (طريقي)، ومحافظات الغابات."}
              </p>
            </div>
            <LinkButton href="/official-information" variant="outline" size="sm" className="self-start sm:self-auto shrink-0 font-bold">
              {t.home.updates.allInfo}
            </LinkButton>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {updates.slice(0, 4).map((u) => (
              <OfficialUpdateCard key={u.id} update={u} />
            ))}
          </div>

          {updates.length > 4 && (
            <div className="mt-6 text-center sm:hidden">
              <LinkButton href="/official-information" variant="outline" className="w-full font-bold">
                {isFr ? "Voir plus de communiqués" : "عرض المزيد من المستجدات"}
              </LinkButton>
            </div>
          )}
        </section>
      )}

      {/* ————————————————————————————————— الشفافية */}
      <section className="border-t border-border bg-algeria-green/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 sm:py-14 text-center">
          <ShieldCheck className="size-7 sm:size-8 text-algeria-green" />
          <h2 className="text-xl sm:text-2xl font-bold">{t.home.transparencyCallout.title}</h2>
          <p className="max-w-xl text-xs sm:text-base leading-relaxed text-muted-foreground px-2">
            {t.home.transparencyCallout.desc}
          </p>
          <LinkButton href="/transparency" size="lg" variant="outline" className="w-full sm:w-auto">
            {t.home.transparencyCallout.btn}
          </LinkButton>
        </div>
      </section>

      {/* ————————————————————————————————— ملاحظة هامة */}
      <PlatformNotice locale={locale} />
    </>
  );
}
