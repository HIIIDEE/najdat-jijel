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
  Share2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { PlatformNotice } from "@/components/shared/platform-notice";
import { AnimatedCounter } from "@/components/interactive/animated-counter";
import { siteConfig } from "@/config/site";
import { relativeTimeAr } from "@/lib/constants";
import { emergencyContacts } from "@/lib/emergency";
import {
  getAffectedAreas,
  getOfficialUpdates,
  getPublicMedicalVolunteers,
  getShelters,
  getStatOverview,
} from "@/lib/data/public";

const quickActions = [
  {
    href: "/donate",
    icon: Gift,
    title: "لدي مساعدات",
    desc: "تسجيل المساعدات والقوافل المتوفرة لديكم.",
    badge: "إغاثة",
    accent: "border-algeria-green/40 bg-algeria-green/5 hover:border-algeria-green hover:bg-algeria-green/10 shadow-sm",
    iconBg: "bg-algeria-green/15 text-algeria-green",
    badgeColor: "bg-algeria-green/15 text-algeria-green",
  },
  {
    href: "/transport",
    icon: Truck,
    title: "أستطيع النقل",
    desc: "تسجيل شاحنة أو مركبة لوجستية لنقل المساعدات.",
    accent: "hover:border-blue-500 hover:shadow-md",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    href: "/medical",
    icon: Stethoscope,
    title: "أنا طبيب / بيطري",
    desc: "التطوع الطبي وتقديم الرعاية والاستشارات.",
    accent: "hover:border-emerald-500 hover:shadow-md",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/map",
    icon: MapPin,
    title: "أين أسلّم؟",
    desc: "مراكز التجميع ونقاط الاستقبال الميداني.",
    accent: "hover:border-purple-500 hover:shadow-md",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

const howItWorks = [
  { n: 1, title: "رصد المناطق", desc: "حصر وتوثيق بؤر الحرائق ومراكز الإيواء المفتوحة.", icon: TriangleAlert },
  { n: 2, title: "جمع المساعدات", desc: "المتبرعون والجمعيات يسجلون المساعدات والقوافل.", icon: Gift },
  { n: 3, title: "تنسيق النقل", desc: "ربط الشاحنات والمركبات بنقاط التجميع ومراكز الإيواء.", icon: Truck },
  { n: 4, title: "تتبع الإغاثة", desc: "توثيق استلام المساعدات بشفافية تامة للجميع.", icon: ShieldCheck },
];

const severityConfig: Record<string, { label: string; tone: string }> = {
  burning: { label: "حريق نشط", tone: "bg-priority-critical/15 text-priority-critical border-priority-critical/30" },
  evacuated: { label: "إجلاء سكان", tone: "bg-priority-critical/15 text-priority-critical border-priority-critical/30" },
  threatened: { label: "مهددة بالخطر", tone: "bg-priority-high/15 text-priority-high border-priority-high/30" },
  ravaged: { label: "أضرار جسيمة", tone: "bg-priority-critical/15 text-priority-critical border-priority-critical/30" },
  contained: { label: "تحت السيطرة", tone: "bg-algeria-green/15 text-algeria-green border-algeria-green/30" },
};

export default async function HomePage() {
  const [
    stats,
    updates,
    shelters,
    areas,
    medicalVolunteers,
  ] = await Promise.all([
    getStatOverview(),
    getOfficialUpdates(3),
    getShelters(),
    getAffectedAreas(),
    getPublicMedicalVolunteers(),
  ]);

  const areaWilayas = [...new Set(areas.map((a) => a.wilaya))];

  return (
    <>
      {/* ————————————————————————————————— Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-algeria-green/10 via-secondary/20 to-background pt-16 pb-20 sm:pt-20 sm:pb-24">
        {/* Ambient Top Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[700px] max-w-full rounded-full bg-[radial-gradient(circle,var(--algeria-green)/14,transparent_70%)] blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 left-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--priority-critical)/8,transparent_70%)] blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-4 text-center">
          {/* Top Status & Emergency Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-border/80 bg-background/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-algeria-green">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-algeria-green opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-algeria-green" />
              </span>
              حملة حرائق الشمال الشرقي — استجابة ميدانية نشطة
            </span>

            <span className="hidden text-muted-foreground/40 sm:inline">|</span>

            {/* Quick Emergency Hotlines */}
            <div className="hidden items-center gap-2 text-xs font-bold text-priority-critical sm:inline-flex">
              <Phone className="size-3.5" />
              <span>خطوط النجدة:</span>
              <a href="tel:14" className="rounded-md bg-priority-critical/10 px-1.5 py-0.5 hover:bg-priority-critical/20">14 الحماية المدنية</a>
              <a href="tel:1021" className="rounded-md bg-priority-critical/10 px-1.5 py-0.5 hover:bg-priority-critical/20">1021 الغابات</a>
              <a href="tel:1055" className="rounded-md bg-priority-critical/10 px-1.5 py-0.5 hover:bg-priority-critical/20">1055 الدرك</a>
            </div>
          </div>

          {/* Main Title & Value Proposition */}
          <div className="mt-8 space-y-3.5">
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.15]">
              {siteConfig.shortName}
            </h1>
            <p className="text-xl font-bold text-algeria-green sm:text-2xl lg:text-3xl tracking-tight">
              {siteConfig.tagline}
            </p>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              منصة تنسيق أهلية مستقلة توجّه الإعانات، القوافل، والفرق الطبية الميدانية مباشرة إلى مراكز الإيواء ونقاط التوزيع في الوقت والمكان الصحيح.
            </p>
          </div>

          {/* Quick Action Cards Deck (4 balanced cards) */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href} className="group">
                <div
                  className={`relative flex h-full flex-col items-center justify-between rounded-2xl border border-border bg-card/95 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${a.accent}`}
                >
                  {a.badge && (
                    <span className={`absolute end-3.5 top-3.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide ${a.badgeColor}`}>
                      {a.badge}
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-3">
                    <span className={`flex size-14 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110 ${a.iconBg}`}>
                      <a.icon className="size-7" aria-hidden />
                    </span>
                    <div>
                      <p className="text-base font-bold leading-snug">{a.title}</p>
                      <p className="mt-1.5 text-xs leading-normal text-muted-foreground">{a.desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Live Stat Numbers Island */}
          <div className="mt-12 rounded-2xl border border-border/80 bg-card/70 p-3.5 shadow-sm backdrop-blur-md">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "نقطة تجميع واستقبال", value: Number(stats.active_points ?? 0), tone: "text-algeria-green", icon: MapPin, bg: "bg-algeria-green/10 text-algeria-green" },
                { label: "منطقة متضررة مسجّلة", value: areas.length, tone: "text-priority-critical", icon: TriangleAlert, bg: "bg-priority-critical/10 text-priority-critical" },
                { label: "مركز إيواء مفتوح", value: shelters.length, tone: "text-blue-600 dark:text-blue-400", icon: Home, bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
                { label: "طاقم طبي وبيطري متطوع", value: medicalVolunteers.length, tone: "text-emerald-600 dark:text-emerald-400", icon: Stethoscope, bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center justify-center rounded-xl bg-background/60 p-4 transition-all hover:bg-background/90">
                  <div className="flex items-center gap-2">
                    <span className={`flex size-6 items-center justify-center rounded-full ${s.bg}`}>
                      <s.icon className="size-3.5" />
                    </span>
                    <AnimatedCounter value={s.value} className={`text-2xl font-black tabular-nums sm:text-3xl ${s.tone}`} />
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
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
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mb-8 flex items-end justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <TriangleAlert className="size-6 text-priority-critical" />
                  المناطق المتضررة وبؤر الحرائق
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {areas.length} بؤرة حريق وتضرر مسجَّلة عبر {areaWilayas.length} ولايات.
                </p>
              </div>
              <LinkButton href="/affected-areas" variant="outline" size="sm" className="hidden sm:inline-flex">
                القائمة الكاملة
              </LinkButton>
            </div>

            <div className="grid gap-4 md:grid-cols-12 items-stretch">
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
                      className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-priority-critical hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-priority-critical/10 px-3 py-1 text-xs font-bold text-priority-critical">
                            بؤرة طوارئ
                          </span>
                          <span className="text-3xl font-extrabold tabular-nums text-priority-critical">
                            {items.length}
                          </span>
                        </div>
                        <p className="mt-4 text-xl font-bold">ولاية {w}</p>
                        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                          {severe > 0
                            ? `${severe} بؤر حرائق نشطة أو إجلاء عاجل`
                            : "مناطق متضررة مسجَّلة ميدانياً"}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-priority-critical transition-colors group-hover:text-priority-critical/80">
                        <span>عرض كل بؤر ولاية {w}</span>
                        <ArrowLeft className="size-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Active Spots Live Breakdown when 1 wilaya */}
              {areaWilayas.length === 1 && (
                <div className="grid gap-3 sm:grid-cols-2 md:col-span-7 lg:col-span-8">
                  {areas.slice(0, 4).map((a) => {
                    const sev = severityConfig[a.severity] ?? { label: a.severity, tone: "bg-muted text-muted-foreground border-border" };
                    return (
                      <Link
                        key={a.id}
                        href={`/affected-areas?wilaya=${encodeURIComponent(a.wilaya)}`}
                        className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-algeria-green hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-base leading-snug">{a.spot}</p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3.5 text-muted-foreground/70" />
                              بلدية {a.commune} · دائرة {a.daira}
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${sev.tone}`}>
                            {sev.label}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <LinkButton href="/affected-areas" variant="outline" className="mt-6 w-full sm:hidden">
              القائمة الكاملة للمناطق المتضررة
            </LinkButton>
          </div>
        </section>
      )}

      {/* ————————————————————————————————— مراكز الإيواء */}
      {shelters.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <Home className="size-6 text-blue-600 dark:text-blue-400" /> مراكز الإيواء المفتوحة
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                مؤسسات عمومية ومراكز مجهزة لاستقبال الأسر التي تم إجلاؤها.
              </p>
            </div>
            <LinkButton href="/map" variant="outline" size="sm" className="hidden sm:inline-flex">
              على الخريطة
            </LinkButton>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shelters.slice(0, 6).map((s) => (
              <div key={s.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-sm">
                <div className="space-y-2">
                  <p className="font-bold text-base leading-snug">{s.name}</p>
                  <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
                    {s.address ?? `${s.commune}، ولاية ${s.wilaya}`}
                  </p>
                  {s.capacity_note && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.capacity_note}</p>
                  )}
                </div>
                {s.phone && (
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <a
                      href={`tel:${s.phone.replace(/\s/g, "")}`}
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-algeria-green hover:underline"
                    >
                      <Phone className="size-4" /> {s.phone}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ————————————————————————————————— الأطقم الطبية والبيطرية */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Stethoscope className="size-6 text-algeria-green" /> الأطقم الطبية والبيطرية المتطوعة
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              أطباء، بياطرة وكوادر صحية متطوعون لتقديم الرعاية والاستشارات الميدانية.
            </p>
          </div>
          <LinkButton href="/medical" variant="outline" size="sm" className="hidden sm:inline-flex">
            تسجيل كمتطوع
          </LinkButton>
        </div>

        {medicalVolunteers && medicalVolunteers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {medicalVolunteers.slice(0, 6).map((doc: any) => (
              <div key={doc.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-base leading-snug">{doc.full_name}</p>
                    <span className="shrink-0 rounded-full bg-algeria-green/10 px-2.5 py-0.5 text-xs font-semibold text-algeria-green">
                      {doc.specialty}
                    </span>
                  </div>

                  <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
                    {doc.commune_id}
                  </p>

                  {doc.current_workplace && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{doc.current_workplace}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {doc.can_teleconsult && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" /> استشارة هاتفية
                      </span>
                    )}
                    {doc.can_field_intervene && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <CheckCircle2 className="size-3.5" /> تدخل ميداني
                      </span>
                    )}
                  </div>
                </div>

                {doc.phone && (
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <a
                      href={`tel:${doc.phone.replace(/\s/g, "")}`}
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-algeria-green hover:underline"
                    >
                      <Phone className="size-4" /> {doc.phone}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-algeria-green/30 bg-algeria-green/5 p-8 text-center sm:p-12">
            <span className="flex size-14 items-center justify-center rounded-full bg-algeria-green/10 text-algeria-green">
              <Stethoscope className="size-7" />
            </span>
            <h3 className="mt-4 text-lg font-bold">نداء للأطباء والكوادر الصحية والبياطرة</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              تطوعكم يساهم في رعاية الأسر المتضررة في مراكز الإيواء وتقديم الاستشارات الطبية والبيطرية المستعجلة.
            </p>
            <LinkButton href="/medical" size="lg" className="mt-5">
              انضم إلى الفريق الطبي المتطوع
            </LinkButton>
          </div>
        )}

        <LinkButton href="/medical" variant="outline" className="mt-6 w-full sm:hidden">
          تسجيل كمتطوع طبي / بيطري
        </LinkButton>
      </section>

      {/* ————————————————————————————————— أرقام الطوارئ */}
      <section className="border-y border-border bg-priority-critical/5">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-1 text-center text-2xl font-bold">أرقام الطوارئ الرسمية</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            أرقام رسمية مجانية تعمل على مدار 24/24 ساعة.
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
                    الرقم الأخضر {c.greenNumber}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————————————————————————————————— كيف تعمل المنصة */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-8 text-center text-2xl font-bold">كيف تعمل المنصة؟</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step) => (
            <div key={step.n} className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-algeria-green/10 text-algeria-green">
                <step.icon className="size-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-algeria-green">المرحلة {step.n}</p>
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
            <h2 className="text-2xl font-bold">آخر المستجدات الموثقة</h2>
            <LinkButton href="/official-information" variant="outline" size="sm">
              كل المعلومات
            </LinkButton>
          </div>
          <div className="space-y-3">
            {updates.map((u) => (
              <Card key={u.id}>
                <CardContent className="flex flex-col gap-1 px-5 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold">{u.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {relativeTimeAr(u.published_at)}
                    </span>
                  </div>
                  {u.body ? <p className="text-sm text-muted-foreground">{u.body}</p> : null}
                  <p className="text-xs text-muted-foreground">المصدر: {u.source}</p>
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
          <h2 className="text-2xl font-bold">أين ذهبت المساعدات؟</h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            نلتزم بعرض أرقام إجمالية واضحة عمّا تم تسجيله وتوزيعه، دون كشف أي بيانات شخصية للأسر.
          </p>
          <LinkButton href="/transparency" size="lg" variant="outline">
            صفحة الشفافية وتتبع القوافل
          </LinkButton>
        </div>
      </section>

      {/* ————————————————————————————————— ملاحظة هامة */}
      <PlatformNotice />
    </>
  );
}
