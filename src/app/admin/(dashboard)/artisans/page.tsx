import type { Metadata } from "next";
import { Phone, HardHat, Truck, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { relativeTimeAr, artisanVerificationStatusLabels } from "@/lib/constants";
import { ArtisanStatusSelect } from "./artisan-status-select";

export const metadata: Metadata = { title: "الحرفيون المتطوعون", robots: { index: false } };

const statusOrder = { pending: 0, verified: 1, rejected: 2 };

export default async function AdminArtisansPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("artisan_volunteers")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data ?? []).slice().sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  const pendingCount = rows.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الحرفيون المتطوعون</h1>
        <p className="text-sm text-muted-foreground">
          {pendingCount === 0
            ? "لا يوجد حرفيون بانتظار التحقق حاليًا."
            : `${pendingCount} حرفيًا بانتظار المراجعة والتحقق.`}
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا يوجد حرفيون مسجَّلون بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-2 px-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{r.full_name}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <HardHat className="size-3.5" />
                      {r.specialty}
                    </p>
                  </div>
                  <ArtisanStatusSelect id={r.id} status={r.status} />
                </div>

                <p className="text-sm">
                  {r.commune_id}، ولاية {r.wilaya_code}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {r.phone && (
                    <a
                      href={`tel:${r.phone.replace(/\s/g, "")}`}
                      dir="ltr"
                      className="flex items-center gap-1 font-semibold text-algeria-green hover:underline"
                    >
                      <Phone className="size-3.5" /> {r.phone}
                    </a>
                  )}
                  {r.can_travel && (
                    <span className="flex items-center gap-1 text-algeria-green">
                      <Truck className="size-3.5" /> يمكنه التنقل
                    </span>
                  )}
                  {r.has_own_tools && (
                    <span className="flex items-center gap-1">
                      <Wrench className="size-3.5" /> يملك أدواته
                    </span>
                  )}
                </div>

                {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}

                <p className="text-xs text-muted-foreground">
                  {artisanVerificationStatusLabels[r.status]} · {relativeTimeAr(r.created_at)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
