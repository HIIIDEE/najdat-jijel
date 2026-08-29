import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { InlineSelect } from "@/components/admin/inline-select";
import { relativeTimeAr, verificationLabels, type VerificationLevel } from "@/lib/constants";
import { updateOrganizationVerification } from "@/actions/organizations";
import { OrganizationDialog } from "./organization-dialog";
import { DeleteOrganizationButton } from "./delete-organization-button";

export const metadata: Metadata = { title: "الجمعيات الموثقة", robots: { index: false } };

export default async function AdminOrganizationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: organizations }, { data: me }] = await Promise.all([
    supabase.from("organizations").select("*").order("created_at", { ascending: false }),
    user
      ? supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const rows = organizations ?? [];
  const isManager = me?.role === "admin" || me?.role === "coordinator";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">الجمعيات الموثقة</h1>
          <p className="text-sm text-muted-foreground">
            {isManager
              ? "يمكنك إضافة جمعيات شريكة وتغيير مستوى التحقق منها."
              : "إدارة الجمعيات متاحة لحسابات الأدمن والمنسّقين فقط."}
          </p>
        </div>
        {isManager && <OrganizationDialog />}
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا توجد جمعيات مسجَّلة بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((org) => (
            <Card key={org.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                <div className="min-w-0">
                  <p className="font-medium">
                    {org.name}
                    {org.org_type && (
                      <span className="ms-2 text-xs font-normal text-muted-foreground">
                        {org.org_type}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {org.contact_name || "بدون مسؤول"} · {org.phone || "بدون رقم"} ·{" "}
                    {org.wilaya || "بدون ولاية"} · أُضيفت {relativeTimeAr(org.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isManager ? (
                    <InlineSelect
                      value={org.verification_level}
                      options={Object.entries(verificationLabels).map(([value, label]) => ({
                        value,
                        label,
                      }))}
                      onChange={(v) => updateOrganizationVerification(org.id, v as VerificationLevel)}
                    />
                  ) : (
                    <VerificationBadge level={org.verification_level} />
                  )}
                  {isManager && (
                    <>
                      <OrganizationDialog organization={org} />
                      <DeleteOrganizationButton id={org.id} name={org.name} />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
