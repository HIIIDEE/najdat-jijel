import { CloudOff } from "lucide-react";
import { LinkButton } from "@/components/shared/link-button";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

/**
 * حالة «تعذّر جلب البيانات».
 *
 * مقصودة أن تختلف بصريًا عن `EmptyState`: الفراغ يعني «لا شيء هنا»، وهذه تعني
 * «لم نستطع أن نعرف». الخلط بينهما في منصة إغاثة يجعل الزائر يظن أن لا حاجة
 * ولا نقطة استقبال، فيتوقّف عن البحث. لذلك تعرض دائمًا مخرجًا: أرقام الطوارئ
 * الرسمية.
 *
 * تقرأ نصوصها بنفسها لأن الرسالة واحدة أينما ظهرت: تمريرها من كل صفحة كان
 * يعني تكرار المفاتيح الأربعة نفسها عند كل استعمال.
 */
export async function DataUnavailable({ className }: { className?: string }) {
  const t = await getDictionary(await getLocale());

  return (
    <div
      role="status"
      className={
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/5 px-6 py-12 text-center" +
        (className ? ` ${className}` : "")
      }
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/15">
        <CloudOff className="size-6 text-amber-600 dark:text-amber-500" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-foreground">{t.common.dataUnavailable.title}</p>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          {t.common.dataUnavailable.description}
        </p>
      </div>
      <LinkButton href="/official-information" variant="outline" size="sm">
        {t.common.dataUnavailable.action}
      </LinkButton>
    </div>
  );
}
