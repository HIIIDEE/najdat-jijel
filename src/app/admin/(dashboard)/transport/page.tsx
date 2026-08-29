import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { relativeTimeAr, vehicleLabels } from "@/lib/constants";
import { TransportStatusSelect } from "./transport-status-select";

export const metadata: Metadata = { title: "النقل", robots: { index: false } };

export default async function AdminTransportPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("transport_offers")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">عروض النقل</h1>
        <p className="text-sm text-muted-foreground">السائقون والمركبات المتاحة لنقل المساعدات.</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا توجد عروض نقل مسجَّلة بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((t) => (
            <Card key={t.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                <div>
                  <p className="font-bold">
                    {t.driver_name} — {vehicleLabels[t.vehicle_type]}
                  </p>
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    {t.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.origin_wilaya} ← {t.destination_wilaya}
                    {t.travel_date ? ` · ${t.travel_date}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{relativeTimeAr(t.created_at)}</p>
                </div>
                <TransportStatusSelect id={t.id} status={t.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
