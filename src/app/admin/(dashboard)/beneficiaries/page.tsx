import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { needCategoryOptions } from "@/schemas/beneficiary-request";
import { relativeTimeAr, requestStatusLabels } from "@/lib/constants";
import { BeneficiaryActions } from "./beneficiary-actions";

export const metadata: Metadata = { title: "الأسر المتضررة", robots: { index: false } };

export default async function AdminBeneficiariesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("beneficiary_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  const categoryLabel = (slug: string) => needCategoryOptions.find((o) => o.value === slug)?.label ?? slug;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الأسر المتضررة</h1>
        <p className="text-sm text-muted-foreground">
          بيانات حساسة — لا تُعرض للعامة إطلاقًا. تظهر هنا فقط للطاقم المصرَّح له.
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا توجد طلبات مسجَّلة بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-2 px-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{r.full_name}</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {r.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={r.priority} />
                    <VerificationBadge level={r.verification_level} />
                  </div>
                </div>

                <p className="text-sm">
                  {r.commune}، ولاية {r.wilaya} — {r.family_members_count} أفراد ({r.children_count} أطفال)
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {r.needed_categories.map((c) => (
                    <span key={c} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {categoryLabel(c)}
                    </span>
                  ))}
                </div>

                {(r.has_injuries || r.needs_medical || r.is_housing_habitable === false) && (
                  <p className="text-xs font-medium text-priority-critical">
                    {r.is_housing_habitable === false && "🏚️ السكن غير صالح "}
                    {r.has_injuries && "🩹 توجد إصابات "}
                    {r.needs_medical && "💊 حاجة طبية"}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <BeneficiaryActions
                    id={r.id}
                    status={r.status}
                    priority={r.priority}
                    verificationLevel={r.verification_level}
                  />
                  <span className="text-xs text-muted-foreground">
                    {requestStatusLabels[r.status]} · {relativeTimeAr(r.created_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
