import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { severityRank } from "@/lib/constants";
import { SeveritySelect } from "./severity-select";

export const metadata: Metadata = { title: "المناطق المتضررة", robots: { index: false } };

export default async function AdminAffectedAreasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("affected_areas")
    .select("*")
    .order("wilaya")
    .order("daira")
    .order("commune");

  const rows = (data ?? []).sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">المناطق المتضررة</h1>
        <p className="text-sm text-muted-foreground">
          حدّث حالة كل منطقة مع تطور الوضع الميداني. البلاغات غير المؤكدة تُعرض للعامة بوسم واضح.
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا توجد مناطق مسجَّلة بعد" />
      ) : (
        <div className="space-y-2">
          {rows.map((a) => (
            <Card key={a.id} className="py-4">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                <div className="min-w-0">
                  <p className="font-bold leading-tight">{a.spot}</p>
                  <p className="text-sm text-muted-foreground">
                    ولاية {a.wilaya} · دائرة {a.daira} · بلدية {a.commune}
                  </p>
                  {a.status_raw && (
                    <p className="text-xs text-muted-foreground/80" dir="ltr">
                      {a.status_raw}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={a.severity} />
                  <SeveritySelect id={a.id} severity={a.severity} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
