import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { activeCampaignSlug, siteConfig } from "@/config/site";
import { CampaignForm } from "./campaign-form";

export const metadata: Metadata = { title: "الإعدادات", robots: { index: false } };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", activeCampaignSlug)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-sm text-muted-foreground">إعدادات الحملة النشطة وهوية المنصة.</p>
      </div>

      <Card>
        <CardContent className="space-y-4 px-5">
          <h2 className="font-bold">الحملة النشطة</h2>
          {campaign ? (
            <CampaignForm campaign={campaign} />
          ) : (
            <p className="text-sm text-muted-foreground">لا توجد حملة نشطة مضبوطة حاليًا.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 px-5">
          <h2 className="font-bold">هوية المنصة</h2>
          <p className="text-sm text-muted-foreground">
            اسم المنصة الحالي: <strong className="text-foreground">{siteConfig.name}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            يمكن تغيير الاسم والشعار والرابط العام من ملف الإعداد{" "}
            <code className="rounded bg-muted px-1 py-0.5">src/config/site.ts</code> أو عبر متغير
            البيئة <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SITE_NAME</code>، دون
            الحاجة لتعديل أي كود آخر.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
