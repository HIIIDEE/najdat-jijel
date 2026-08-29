import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementsManager } from "./announcements-manager";

export const metadata: Metadata = { title: "شريط الأخبار", robots: { index: false } };

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">شريط الأخبار العاجلة</h1>
        <p className="text-sm text-muted-foreground">
          الشريط الأحمر أعلى الصفحة الرئيسية — استعمله للتحديثات السريعة: امتلاء نقطة، تحويل
          المساعدات، إغلاق طريق...
        </p>
      </div>
      <AnnouncementsManager items={data ?? []} />
    </div>
  );
}
