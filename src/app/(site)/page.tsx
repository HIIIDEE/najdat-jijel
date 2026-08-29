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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { EmergencyBanner } from "@/components/shared/emergency-banner";
import { NeedCard } from "@/components/shared/need-card";
import { EmptyState } from "@/components/shared/empty-state";
import { AnimatedCounter } from "@/components/interactive/animated-counter";
import { siteConfig } from "@/config/site";
import { relativeTimeAr } from "@/lib/constants";
import { emergencyContacts } from "@/lib/emergency";
import {
  getAffectedCommunes,
  getCriticalNeeds,
  getOfficialUpdates,
  getShelters,
  getStatOverview,
} from "@/lib/data/public";

const quickActions = [
  { href: "/help", emoji: "🆘", title: "أنا متضرر", desc: "الإبلاغ عن احتياج أو طلب مساعدة." },
  { href: "/donate", emoji: "🎁", title: "لدي مساعدات", desc: "تسجيل المساعدات التي أملكها." },
  { href: "/transport", emoji: "🚚", title: "أستطيع النقل", desc: "تسجيل سيارة أو شاحنة للنقل." },
  { href: "/map", emoji: "📍", title: "أين أسلّم؟", desc: "عرض نقاط التجميع والاستقبال." },
];

const howItWorks = [
  { n: 1, title: "نعرف الاحتياج", desc: "المتضررون والفرق الميدانية يسجلون الاحتياجات.", icon: ClipboardList },
  { n: 2, title: "نجمع المساعدات", desc: "المتبرعون يسجلون ما لديهم.", icon: ListChecks },
  { n: 3, title: "نوجّهها", desc: "النظام يطابق المساعدات مع الاحتياجات والنقاط.", icon: MapPin },
  { n: 4, title: "نتابع التوزيع", desc: "نسجل وصول المساعدات وتوزيعها على المستفيدين.", icon: Truck },
];

export default async function HomePage() {
  const [criticalNeeds, stats, updates, shelters, communes] = await Promise.all([
    getCriticalNeeds(6),
    getStatOverview(),
    getOfficialUpdates(3),
    getShelters(),
    getAffectedCommunes(),
  ]);

  return (
    <>
      <EmergencyBanner />

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
            حملة حرائق جيجل — نشطة الآن
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {siteConfig.shortName}
          </h1>
          <p className="mt-3 text-lg font-medium text-algeria-green sm:text-xl">{siteConfig.tagline}</p>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            آلاف الجزائريين يريدون المساعدة. مهمتنا أن نوجّه هذه المساعدة إلى المكان والوقت
            والاحتياج الصحيح.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href} className="group">
                <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:border-algeria-green group-hover:shadow-lg">
                  <CardContent className="flex h-full flex-col items-center gap-2 px-4 py-5 text-center">
                    <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden>
                      {a.emoji}
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
              { label: "احتياج نشط", value: Number(stats.critical_needs ?? 0), tone: "text-priority-critical" },
              { label: "نقطة استقبال", value: Number(stats.active_points ?? 0), tone: "text-algeria-green" },
              { label: "بلدية متضررة", value: communes.length, tone: "text-foreground" },
              { label: "مركز إيواء", value: shelters.length, tone: "text-[#7c3aed]" },
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
            <h2 className="text-2xl font-bold">الاحتياجات العاجلة الآن</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              اضغط على أي بطاقة لعرض التفاصيل الميدانية ومشاركتها.
            </p>
          </div>
          <LinkButton href="/needs" variant="outline" className="hidden sm:inline-flex">
            عرض الكل <ArrowLeft className="size-4" />
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

      {/* ————————————————————————————————— البلديات المتضررة */}
      {communes.length > 0 && (
        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="mb-1 text-2xl font-bold">البلديات المتضررة</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              عدد الاحتياجات النشطة المسجَّلة في كل بلدية.
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
                <Home className="size-5 text-[#7c3aed]" /> مراكز الإيواء المفتوحة
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                مؤسسات عمومية مجهزة لاستقبال الأسر المتضررة.
              </p>
            </div>
            <LinkButton href="/map" variant="outline" size="sm" className="hidden sm:inline-flex">
              على الخريطة
            </LinkButton>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shelters.slice(0, 6).map((s) => (
              <Card key={s.id}>
                <CardContent className="space-y-2 px-5">
                  <p className="font-bold leading-tight">{s.name}</p>
                  <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" />
                    {s.address ?? `${s.commune}، ولاية ${s.wilaya}`}
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

      {/* ————————————————————————————————— أرقام الطوارئ */}
      <section className="border-y border-border bg-priority-critical/5">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-1 text-center text-2xl font-bold">أرقام الطوارئ</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            أرقام رسمية مجانية تعمل على مدار الساعة.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {emergencyContacts.map((c) => (
              <div
                key={c.label}
                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-priority-critical hover:shadow-md"
              >
                <span className="text-2xl" aria-hidden>
                  {c.emoji}
                </span>
                <a
                  href={`tel:${c.number}`}
                  className="text-2xl font-extrabold tabular-nums text-priority-critical hover:underline"
                >
                  {c.number}
                </a>
                <span className="text-xs font-medium">{c.label}</span>
                {c.hint && <span className="text-[11px] text-muted-foreground">{c.hint}</span>}
                {c.greenNumber && (
                  <a
                    href={`tel:${c.greenNumber}`}
                    className="mt-1 rounded-full bg-algeria-green/10 px-2 py-0.5 text-[11px] font-semibold text-algeria-green hover:underline"
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
            <h2 className="text-2xl font-bold">آخر المستجدات الموثقة</h2>
            <LinkButton href="/official-information" variant="outline" size="sm">
              كل المعلومات
            </LinkButton>
          </div>
          <div className="space-y-3">
            {updates.map((u) => (
              <Card key={u.id}>
                <CardContent className="flex flex-col gap-1 px-5">
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
          <p className="max-w-xl text-muted-foreground">
            نلتزم بعرض أرقام إجمالية واضحة عمّا تم تسجيله وتوزيعه، دون كشف أي بيانات شخصية للأسر.
          </p>
          <LinkButton href="/transparency" size="lg" variant="outline">
            صفحة الشفافية
          </LinkButton>
        </div>
      </section>
    </>
  );
}
