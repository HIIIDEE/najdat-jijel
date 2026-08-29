import type { Metadata } from "next";
import Link from "next/link";
import { Users, Gift, Truck, Warehouse, TriangleAlert, UserX } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { relativeTimeAr } from "@/lib/constants";
import { getAdminDashboardStats, getRecentActivity } from "@/lib/data/admin";

export const metadata: Metadata = { title: "نظرة عامة", robots: { index: false } };

export default async function AdminOverviewPage() {
  const [stats, activity] = await Promise.all([getAdminDashboardStats(), getRecentActivity(8)]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">نظرة عامة</h1>
        <p className="text-sm text-muted-foreground">أرقام حقيقية من قاعدة البيانات، محدَّثة لحظيًا.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="الأسر المتضررة" value={stats.totalFamilies} icon={Users} />
        <StatCard
          label="أسر لم تصلها مساعدات بعد"
          value={stats.familiesAwaiting}
          icon={UserX}
          tone="critical"
        />
        <StatCard label="المساعدات المسجَّلة" value={stats.donationsCount} icon={Gift} />
        <StatCard label="الشحنات النشطة" value={stats.activeShipments} icon={Truck} />
        <StatCard label="نقاط الاستقبال المفتوحة" value={stats.activePoints} icon={Warehouse} />
        <StatCard
          label="الاحتياجات الحرجة"
          value={stats.criticalNeeds}
          icon={TriangleAlert}
          tone="critical"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/needs" className="rounded-lg border border-dashed border-border p-4 text-center text-sm font-medium hover:border-algeria-green hover:text-algeria-green">
          + إضافة احتياج
        </Link>
        <Link href="/admin/collection-points" className="rounded-lg border border-dashed border-border p-4 text-center text-sm font-medium hover:border-algeria-green hover:text-algeria-green">
          + إضافة نقطة تجميع
        </Link>
        <Link href="/admin/relief-hubs" className="rounded-lg border border-dashed border-border p-4 text-center text-sm font-medium hover:border-algeria-green hover:text-algeria-green">
          + إضافة مركز استقبال
        </Link>
        <Link href="/admin/distributions" className="rounded-lg border border-dashed border-border p-4 text-center text-sm font-medium hover:border-algeria-green hover:text-algeria-green">
          + تسجيل توزيع
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">آخر النشاطات</h2>
        {activity.length === 0 ? (
          <EmptyState title="لا يوجد نشاط مسجَّل بعد" />
        ) : (
          <Card>
            <CardContent className="divide-y divide-border px-0">
              {activity.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <div>
                    <span className="font-medium">{a.profiles?.full_name ?? "مستخدم"}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {relativeTimeAr(a.created_at)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
