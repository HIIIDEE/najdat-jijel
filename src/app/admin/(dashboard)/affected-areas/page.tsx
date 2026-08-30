import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { severityRank } from "@/lib/constants";
import { SeveritySelect } from "./severity-select";
import { CreateAreaDialog } from "./create-area-dialog";
import { AreaActions } from "./area-actions";

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">المناطق المتضررة</h1>
          <p className="text-sm text-muted-foreground">
            إضافة وتحديث حالة كل منطقة وبؤرة متضررة في الميدان.
          </p>
        </div>
        <CreateAreaDialog />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا توجد مناطق مسجَّلة بعد" description="أضف أول بؤرة متضررة لتظهر في الخريطة وقائمة المناطق العامة." />
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
                  {a.source && (
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                      المصدر: {a.source}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={a.severity} />
                  <SeveritySelect id={a.id} severity={a.severity} />
                  <AreaActions id={a.id} spot={a.spot || a.commune} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
