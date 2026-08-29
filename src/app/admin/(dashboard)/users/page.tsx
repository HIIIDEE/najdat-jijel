import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { relativeTimeAr } from "@/lib/constants";
import { UserRoleSelect } from "./user-role-select";

export const metadata: Metadata = { title: "المستخدمون", robots: { index: false } };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">المستخدمون</h1>
        <p className="text-sm text-muted-foreground">
          تغيير الأدوار متاح للأدمن فقط. الحسابات تُنشأ حاليًا عبر سكربت إنشاء الأدمن أو Supabase
          Auth مباشرة.
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا يوجد مستخدمون بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                <div>
                  <p className="font-medium">{p.full_name || "بدون اسم"}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.phone || "بدون رقم"} · انضم {relativeTimeAr(p.created_at)}
                  </p>
                </div>
                <UserRoleSelect id={p.id} role={p.role} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
