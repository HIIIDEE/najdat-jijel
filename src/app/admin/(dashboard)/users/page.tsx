import type { Metadata } from "next";
import { ShieldCheck, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { relativeTimeAr, roleLabels } from "@/lib/constants";
import { UserRoleSelect } from "./user-role-select";
import { AddStaffDialog } from "./add-staff-dialog";
import { DeleteUserButton } from "./delete-user-button";
import { ExportUsersCsvButton } from "./export-csv-button";

export const metadata: Metadata = { title: "المستخدمون", robots: { index: false } };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profiles }, { data: me }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    user
      ? supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const rows = profiles ?? [];
  const isAdmin = me?.role === "admin";
  const adminCount = rows.filter((p) => p.role === "admin").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">المستخدمون</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "بصفتك أدمن يمكنك إضافة أعضاء جدد وتغيير أدوارهم."
              : "تغيير الأدوار وإضافة الأعضاء متاح لحسابات الأدمن فقط."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportUsersCsvButton rows={rows} />
          {isAdmin && <AddStaffDialog />}
        </div>
      </div>

      {isAdmin && (
        <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/50 p-4">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-algeria-green" />
          <p className="text-sm text-muted-foreground">
            يوجد حاليًا <strong className="text-foreground">{adminCount}</strong> من حسابات الأدمن.
            لا يسمح النظام بإزالة آخر حساب أدمن حتى لا تفقد المنصة إمكانية الإدارة.
          </p>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState title="لا يوجد مستخدمون بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                <div className="min-w-0">
                  <p className="font-medium">
                    {p.full_name || "بدون اسم"}
                    {p.id === user?.id && (
                      <span className="ms-2 rounded-full bg-algeria-green/10 px-2 py-0.5 text-xs font-semibold text-algeria-green">
                        أنت
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.phone || "بدون رقم"} · {roleLabels[p.role]} · انضم {relativeTimeAr(p.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <UserRoleSelect id={p.id} role={p.role} />
                  {isAdmin && p.id !== user?.id && (
                    <DeleteUserButton id={p.id} name={p.full_name || "هذا المستخدم"} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 rounded-xl border border-dashed border-border p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          يمكن أيضًا إنشاء حساب أدمن من الطرفية:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            node scripts/create-admin.mjs &lt;email&gt; &lt;password&gt; &quot;الاسم&quot;
          </code>
        </p>
      </div>
    </div>
  );
}
