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
  Flame,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { NewsTicker } from "@/components/shared/news-ticker";
import { PlatformNotice } from "@/components/shared/platform-notice";
import { NeedCard } from "@/components/shared/need-card";
import { EmptyState } from "@/components/shared/empty-state";
import { AnimatedCounter } from "@/components/interactive/animated-counter";
import { siteConfig } from "@/config/site";
import { relativeTimeAr } from "@/lib/constants";
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

const quickActions = [
  {
    href: "/help",
    icon: LifeBuoy,
    title: "أنا متضرر",
    desc: "الإبلاغ عن احتياج أو طلب نجدة.",
    badge: "طوارئ",
    accent: "border-priority-critical/40 bg-priority-critical/5 hover:border-priority-critical hover:bg-priority-critical/10 shadow-sm",
    iconBg: "bg-priority-critical/15 text-priority-critical",
    badgeColor: "bg-priority-critical/15 text-priority-critical",
  },
  {
    href: "/donate",
    icon: Gift,
    title: "لدي مساعدات",
    desc: "تسجيل المساعدات المتوفرة لديكم.",
    accent: "hover:border-algeria-green hover:shadow-md",
    iconBg: "bg-algeria-green/10 text-algeria-green",
  },
  {
    href: "/transport",
    icon: Truck,
    title: "أستطيع النقل",
    desc: "تسجيل شاحنة أو مركبة لوجستية.",
    accent: "hover:border-blue-500 hover:shadow-md",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    href: "/medical",
    icon: Stethoscope,
    title: "أنا طبيب / بيطري",
    desc: "التطوع الطبي وتقديم الاستشارات.",
    accent: "hover:border-emerald-500 hover:shadow-md",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/map",
    icon: MapPin,
    title: "أين أسلّم؟",
    desc: "مراكز التجميع والاستقبال الميداني.",
    accent: "hover:border-purple-500 hover:shadow-md",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

const howItWorks = [
  { n: 1, title: "نعرف الاحتياج", desc: "المتضررون والفرق الميدانية يسجلون الاحتياجات.", icon: ClipboardList },
  { n: 2, title: "نجمع المساعدات", desc: "المتبرعون يسجلون ما لديهم من قوافل وإعانات.", icon: ListChecks },
  { n: 3, title: "نوجّهها بدقة", desc: "النظام يطابق المساعدات مع أشد المناطق احتياجاً.", icon: MapPin },
  { n: 4, title: "نتابع التوزيع", desc: "نسجل وصول المساعدات واستلامها بشفافية.", icon: Truck },
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
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-algeria-green/8 via-secondary/30 to-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,var(--algeria-green)/12,transparent)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 text-center sm:py-16">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-algeria-green/25 bg-algeria-green/10 px-3 py-1 text-xs font-semibold text-algeria-green">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-algeria-green opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-algeria-green" />
              </span>
              حملة حرائق الشمال الشرقي — نشطة الآن
            </span>

            {/* Quick Emergency Hotlines Strip */}
            <div className="hidden items-center gap-1.5 rounded-full border border-priority-critical/30 bg-priority-critical/10 px-3 py-1 text-xs font-bold text-priority-critical sm:inline-flex">
              <Phone className="size-3" />
              <span>طوارئ:</span>
              <a href="tel:14" className="hover:underline">14 الحماية</a>
              <span>·</span>
              <a href="tel:1021" className="hover:underline">1021 الغابات</a>
              <span>·</span>
              <a href="tel:1055" className="hover:underline">1055 الدرك</a>
            </div>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {siteConfig.shortName}
          </h1>
          <p className="mt-3 text-lg font-medium text-algeria-green sm:text-xl">{siteConfig.tagline}</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            منصة تنسيق مدنية مستقلة توجّه الإعانات والقوافل والفرق الطبية مباشرة إلى المتضررين في الوقت والمكان الصحيح.
          </p>

          {/* Quick Action Cards Deck */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href} className="group">
                <Card className={`relative h-full transition-all group-hover:-translate-y-1 ${a.accent}`}>
                  <CardContent className="flex h-full flex-col items-center gap-2 px-4 py-5 text-center">
                    {a.badge && (
                      <span className={`absolute end-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold ${a.badgeColor}`}>
                        {a.badge}
                      </span>
                    )}
                    <span className={`flex size-12 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${a.iconBg}`}>
                      <a.icon className="size-6" aria-hidden />
                    </span>
                    <p className="font-bold leading-snug">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* شريط أرقام حيّ */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "احتياج عاجل نشط", value: Number(stats.critical_needs ?? 0), tone: "text-priority-critical", icon: Flame },
              { label: "نقطة تجميع واستقبال", value: Number(stats.active_points ?? 0), tone: "text-algeria-green", icon: MapPin },
              { label: "منطقة متضررة مسجّلة", value: areas.length, tone: "text-priority-high", icon: TriangleAlert },
              { label: "مركز إيواء مفتوح", value: shelters.length, tone: "text-blue-600 dark:text-blue-400", icon: Home },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm">
                <AnimatedCounter value={s.value} className={`block text-2xl font-extrabold tabular-nums sm:text-3xl ${s.tone}`} />
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <s.icon className="size-3.5 opacity-70" />
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————————————————————————————————— الاحتياجات العاجلة */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-priority-critical animate-pulse" />
              <h2 className="text-2xl font-bold">الاحتياجات العاجلة الآن</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              احتياجات ميدانية مؤكدة من المتضررين واللجان الميدانية.
            </p>
          </div>
          <LinkButton href="/needs" variant="outline" className="hidden sm:inline-flex">
            عرض كل الاحتياجات <ArrowLeft className="size-4" />
          </LinkButton>
        </div>

        {criticalNeeds.length === 0 ? (
          <EmptyState
            title="لا توجد حاليًا احتياجات مسجلة"
            description="يتم تحديث البيانات باستمرار من الفرق الميدانية."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {criticalNeeds.map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}
          </div>
        )}

        <LinkButton href="/needs" variant="outline" className="mt-6 w-full sm:hidden">
          عرض كل الاحتياجات
        </LinkButton>
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

      {/* ————————————————————————————————— البلديات المتضررة */}
      {communes.length > 0 && (
        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-1 text-2xl font-bold">البلديات الأكثر احتياجاً</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              ترتيب البلديات حسب كثافة الاحتياجات الميدانية الحرجة.
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
