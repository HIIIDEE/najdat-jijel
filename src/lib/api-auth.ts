import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * تحقّق من سرّ مشترك لمسارات الـ API الآلية (تزويد الأخبار).
 *
 * ثلاثة أمور مقصودة هنا:
 *
 * 1. **الرفض عند غياب الإعداد.** الصيغة السابقة كانت `if (!secret) return true`
 *    و`if (secret && token !== secret)`: أي أن نسيان ضبط المتغيّر على Vercel —
 *    أو حذفه بالخطأ — كان يفتح المسار للجميع بصمت، وهو أسوأ ما يمكن أن يفعله
 *    فحصُ هوية. الآن الغياب يُغلق الباب.
 *
 * 2. **الترويسة وحدها.** كان السرّ يُقبل أيضًا من `?secret=` و`?key=`، والروابط
 *    تُسجَّل في سجلّات Vercel وفي المُحيلات وفي سجلّ المتصفّح — أي أن السرّ كان
 *    يُكتب في أماكن لا تُنظَّف. ترويسة `Authorization: Bearer …` هي أيضًا ما
 *    ترسله مهام Vercel Cron.
 *
 * 3. **مقارنة ثابتة الزمن.** `!==` يخرج عند أول محرف مختلف، فيسرّب طول البادئة
 *    الصحيحة لمن يقيس زمن الرد.
 */
export function isApiRequestAuthorized(request: Request): boolean {
  const secret = process.env.WEBHOOK_SECRET || process.env.CRON_SECRET;

  if (!secret) {
    console.error(
      "[api-auth] WEBHOOK_SECRET/CRON_SECRET غير مضبوط: المسار مغلق حتى يُضبط.",
    );
    return false;
  }

  const header = request.headers.get("authorization");
  if (!header) return false;

  const token = header.replace(/^Bearer\s+/i, "");
  const provided = Buffer.from(token);
  const expected = Buffer.from(secret);

  // `timingSafeEqual` يشترط تساوي الطول، والطول نفسه ليس سرًّا.
  if (provided.length !== expected.length) return false;

  return timingSafeEqual(provided, expected);
}
