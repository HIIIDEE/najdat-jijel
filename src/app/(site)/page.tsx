import Link from "next/link";
import { MapPin, ClipboardList, Truck, ListChecks, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { EmergencyBanner } from "@/components/shared/emergency-banner";
import { NeedCard } from "@/components/shared/need-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { siteConfig } from "@/config/site";
import { relativeTimeAr } from "@/lib/constants";
import {
  getCriticalNeeds,
  getOfficialUpdates,
  getStatOverview,
} from "@/lib/data/public";

const quickActions = [
  {
    href: "/help",
    emoji: "🆘",
    title: "أنا متضرر",
    desc: "الإبلاغ عن احتياج أو طلب مساعدة.",
  },
  {
    href: "/donate",
    emoji: "🎁",
    title: "لدي مساعدات",
    desc: "تسجيل المساعدات التي أملكها.",
  },
  {
    href: "/transport",
    emoji: "🚚",
    title: "أستطيع النقل",
    desc: "تسجيل سيارة أو شاحنة لنقل المساعدات.",
  },
  {
    href: "/map",
    emoji: "📍",
    title: "أين أسلّم المساعدات؟",
    desc: "عرض نقاط التجميع والاستقبال.",
  },
];

const howItWorks = [
  {
    n: 1,
    title: "نعرف الاحتياج",
    desc: "المتضررون والفرق الميدانية يسجلون الاحتياجات.",
    icon: ClipboardList,
  },
  {
    n: 2,
    title: "نجمع المساعدات",
    desc: "المتبرعون يسجلون ما لديهم.",
    icon: ListChecks,
  },
  {
    n: 3,
    title: "نوجّهها",
    desc: "النظام يطابق المساعدات مع الاحتياجات ونقاط الاستقبال.",
    icon: MapPin,
  },
  {
    n: 4,
    title: "نتابع التوزيع",
    desc: "نسجل وصول المساعدات وتوزيعها على المستفيدين.",
    icon: Truck,
  },
];

export default async function HomePage() {
  const [criticalNeeds, stats, updates] = await Promise.all([
    getCriticalNeeds(6),
    getStatOverview(),
    getOfficialUpdates(3),
  ]);

  return (
    <>
      <EmergencyBanner />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-secondary/50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {siteConfig.shortName}
          </h1>
          <p className="mt-3 text-lg font-medium text-algeria-green sm:text-xl">
            {siteConfig.tagline}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            آلاف الجزائريين يريدون المساعدة. مهمتنا أن نوجّه هذه المساعدة إلى المكان والوقت
            والاحتياج الصحيح.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="h-full transition-colors hover:border-algeria-green">
                  <CardContent className="flex h-full flex-col items-center gap-2 px-4 py-5 text-center">
                    <span className="text-3xl" aria-hidden>
                      {action.emoji}
                    </span>
                    <p className="font-bold">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* الاحتياجات العاجلة */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">الاحتياجات العاجلة الآن</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              بيانات تجريبية أثناء التطوير — سيتم استبدالها ببيانات ميدانية حقيقية بعد التحقق منها.
            </p>
          </div>
          <LinkButton href="/needs" variant="outline" className="hidden sm:inline-flex">
            عرض الكل <ArrowLeft className="size-4" />
          </LinkButton>
        </div>

        {criticalNeeds.length === 0 ? (
          <EmptyState
            title="لا توجد حاليًا احتياجات حرجة مسجلة"
            description="يتم تحديث البيانات باستمرار."
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

      {/* خريطة مختصرة */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center">
          <MapPin className="size-8 text-algeria-green" />
          <h2 className="text-2xl font-bold">أين أسلّم المساعدات؟</h2>
          <p className="max-w-xl text-muted-foreground">
            اطّلع على خريطة نقاط التجميع ومراكز الاستقبال ومناطق الأولوية قبل التحرك.
          </p>
          <LinkButton href="/map" size="lg">
            فتح خريطة الإغاثة
          </LinkButton>
        </div>
      </section>

      {/* كيف تعمل المنصة */}
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

      {/* إحصائيات حقيقية */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="mb-1 text-center text-2xl font-bold">المنصة الآن</h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            أرقام حقيقية من قاعدة البيانات، تتحدث لحظيًا مع كل عملية تسجيل — تبدأ من صفر إن لم توجد
            بيانات بعد.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="الأسر المتضررة المسجَّلة" value={stats.total_families ?? 0} />
            <StatCard
              label="أسر لم تصلها مساعدات بعد"
              value={stats.families_awaiting ?? 0}
              tone="critical"
            />
            <StatCard label="نقاط استقبال وتجميع نشطة" value={stats.active_points ?? 0} />
            <StatCard label="مناطق تم الوصول إليها" value={stats.areas_reached ?? 0} tone="success" />
            <StatCard label="احتياجات حرجة حاليًا" value={stats.critical_needs ?? 0} tone="critical" />
            <StatCard label="شحنات نقل نشطة" value={stats.active_shipments ?? 0} />
          </div>
        </div>
      </section>

      {/* آخر التحديثات الموثقة */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-3">
          <h2 className="text-2xl font-bold">آخر المستجدات الموثقة</h2>
          <LinkButton href="/official-information" variant="outline" size="sm">
            كل المعلومات الرسمية
          </LinkButton>
        </div>
        {updates.length === 0 ? (
          <EmptyState
            title="لا توجد مستجدات موثقة بعد"
            description="سيتم نشر أي معلومة موثقة من مصدر موثوق هنا فور توفرها."
          />
        ) : (
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
        )}
      </section>

      {/* الشفافية */}
      <section className="border-t border-border bg-algeria-green/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-14 text-center">
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
