import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { relativeTimeAr } from "@/lib/constants";
import { getOfficialUpdates } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "معلومات رسمية",
  description: "آخر المستجدات الموثقة من مصادر موثوقة حول حملة هبة الجزائر.",
};

const typeLabels: Record<string, string> = {
  news: "خبر",
  statement: "بيان",
  advisory: "تنبيه",
  report: "تقرير",
};

export default async function OfficialInformationPage() {
  const updates = await getOfficialUpdates(50);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold">المعلومات الرسمية</h1>
        <p className="mt-2 text-muted-foreground">
          آخر المستجدات الموثقة من مصادر موثوقة. هذه منصة تنسيق مستقلة، وليست جهة رسمية — يُنشر هنا
          فقط ما تم توثيق مصدره.
        </p>
      </div>

      {updates.length === 0 ? (
        <EmptyState
          title="لا توجد معلومات رسمية منشورة بعد"
          description="سيتم نشر أي معلومة موثقة من مصدر موثوق هنا فور توفرها."
        />
      ) : (
        <div className="space-y-4">
          {updates.map((u) => (
            <Card key={u.id}>
              <CardContent className="space-y-2 px-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                    {typeLabels[u.update_type] ?? u.update_type}
                  </span>
                  <span className="text-xs text-muted-foreground">{relativeTimeAr(u.published_at)}</span>
                </div>
                <p className="text-lg font-bold">{u.title}</p>
                {u.body && <p className="text-sm text-muted-foreground">{u.body}</p>}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>المصدر: {u.source}</span>
                  {u.url && (
                    <a href={u.url} target="_blank" rel="noopener noreferrer" className="text-algeria-green hover:underline">
                      الرابط الأصلي
                    </a>
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
