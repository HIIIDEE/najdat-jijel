import type { Metadata } from "next";
import { Phone, Paintbrush, Image as ImageIcon, Link2 } from "lucide-react";
import NextLink from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { relativeTimeAr, damageAssessmentStatusLabels } from "@/lib/constants";
import { findWilayaByName, haversineDistanceKm } from "@/lib/wilayas";
import { getSignedDamagePhotoUrl } from "@/actions/damage-assessments";
import { DamageAssessmentStatusSelect } from "./damage-assessment-status-select";
import { AssignArtisanSelect, type ArtisanCandidate } from "./assign-artisan-select";

export const metadata: Metadata = { title: "تقييمات الأضرار", robots: { index: false } };

const statusOrder = { pending: 0, estimated: 1, matched: 2, in_progress: 3, completed: 4, rejected: 5 };

export default async function AdminDamageAssessmentsPage() {
  const supabase = await createClient();

  const [{ data: assessments }, { data: artisans }] = await Promise.all([
    supabase.from("damage_assessments").select("*").order("created_at", { ascending: false }),
    supabase.from("artisan_volunteers").select("*").eq("status", "verified"),
  ]);

  const rows = (assessments ?? [])
    .slice()
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const verifiedArtisans = artisans ?? [];

  // لكل تقييم: نرشّح الحرفيين المطابقين للتخصص المطلوب، مرتّبين حسب نفس الولاية ثم المسافة —
  // نفس منطق suggestDeliveryPoint في services/matching.ts، بدون إسناد تلقائي (اقتراح فقط).
  const candidatesByAssessment = new Map<string, ArtisanCandidate[]>();
  for (const r of rows) {
    const origin = findWilayaByName(r.wilaya);
    const matches = verifiedArtisans
      .filter(
        (a) =>
          r.required_specialties.length === 0 ||
          r.required_specialties.some((s) => a.specialty.includes(s) || s.includes(a.specialty)),
      )
      .map((a) => {
        const target = findWilayaByName(a.wilaya_code) ?? findWilayaByName(a.commune_id);
        const distanceKm = origin && target ? haversineDistanceKm(origin, target) : null;
        const sameWilaya = a.wilaya_code === r.wilaya;
        return {
          id: a.id,
          full_name: a.full_name,
          specialty: a.specialty,
          distanceLabel: sameWilaya
            ? "نفس الولاية"
            : distanceKm !== null
              ? `${distanceKm} كم`
              : a.wilaya_code,
          sortKey: sameWilaya ? -1 : (distanceKm ?? 9999),
        };
      })
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ id, full_name, specialty, distanceLabel }) => ({ id, full_name, specialty, distanceLabel }));
    candidatesByAssessment.set(r.id, matches);
  }

  const photoUrlsByAssessment = new Map<string, string[]>();
  await Promise.all(
    rows
      .filter((r) => r.photo_paths.length > 0)
      .map(async (r) => {
        const urls = await Promise.all(r.photo_paths.map((p) => getSignedDamagePhotoUrl(p)));
        photoUrlsByAssessment.set(
          r.id,
          urls.filter((u): u is string => Boolean(u)),
        );
      }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">تقييمات الأضرار</h1>
        <p className="text-sm text-muted-foreground">
          {pendingCount === 0
            ? "لا توجد تقييمات بانتظار المراجعة حاليًا."
            : `${pendingCount} تقييمًا بانتظار المراجعة.`}
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا توجد تقييمات أضرار مسجَّلة بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-3 px-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{r.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {r.commune}، ولاية {r.wilaya}
                    </p>
                  </div>
                  <DamageAssessmentStatusSelect id={r.id} status={r.status} />
                </div>

                {r.phone && (
                  <a
                    href={`tel:${r.phone.replace(/\s/g, "")}`}
                    dir="ltr"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-algeria-green hover:underline"
                  >
                    <Phone className="size-3.5" /> {r.phone}
                  </a>
                )}

                {(r.estimated_paint_liters || r.required_specialties.length > 0) && (
                  <div className="rounded-lg bg-muted/60 p-3 text-sm">
                    {r.estimated_paint_liters && (
                      <p className="flex items-center gap-1.5">
                        <Paintbrush className="size-3.5" />
                        تقدير الدهان: {r.estimated_paint_liters} لتر (~{r.estimated_paint_cans} بيدون)
                      </p>
                    )}
                    {r.required_specialties.length > 0 && (
                      <p className="mt-1 text-muted-foreground">
                        التخصصات المطلوبة: {r.required_specialties.join("، ")}
                      </p>
                    )}
                  </div>
                )}

                {r.linked_need_id && (
                  <NextLink
                    href="/admin/needs"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-algeria-green hover:underline"
                  >
                    <Link2 className="size-3.5" /> عرض الاحتياج المرتبط في صفحة الاحتياجات
                  </NextLink>
                )}

                {(photoUrlsByAssessment.get(r.id)?.length ?? 0) > 0 && (
                  <div>
                    <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <ImageIcon className="size-3.5" /> صور الأضرار
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {photoUrlsByAssessment.get(r.id)!.map((url) => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element -- روابط موقّعة مؤقتة من Storage، لا تناسب next/image الثابت */}
                          <img src={url} alt="صورة أضرار" className="size-20 rounded-lg border border-border object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {r.finishing_notes && <p className="text-xs text-muted-foreground">{r.finishing_notes}</p>}

                <div className="border-t border-border pt-3">
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">إسناد حرفي متطوع</p>
                  <AssignArtisanSelect
                    assessmentId={r.id}
                    currentArtisanId={r.assigned_artisan_id}
                    candidates={candidatesByAssessment.get(r.id) ?? []}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {damageAssessmentStatusLabels[r.status]} · {relativeTimeAr(r.created_at)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
