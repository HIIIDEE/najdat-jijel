import "server-only";
import { createClient } from "@/lib/supabase/server";

type Client = Awaited<ReturnType<typeof createClient>>;

/**
 * نتيجة استعلام قراءة.
 *
 * الفرق بين «لا توجد بيانات» و«تعذّر جلب البيانات» فرق جوهري في منصة إغاثة:
 * قائمة نقاط فارغة لأن قاعدة البيانات متوقّفة تُقرأ من الزائر على أنها «لا
 * توجد نقاط»، فيتوقّف عن البحث. لذلك يحمل هذا النوع علمًا صريحًا للفشل بدل
 * إخفائه خلف مصفوفة فارغة.
 */
export interface DataResult<T> {
  data: T;
  failed: boolean;
}

/** يسجّل الخطأ في سجلّ الخادم مع اسم الاستعلام حتى يمكن تتبّعه في Vercel. */
export function logDataError(scope: string, error: unknown): void {
  // الكائن يُمرَّر كما هو لا مُسلسلًا: هكذا نحتفظ بأثر النداء لأخطاء Error،
  // وبكامل الحقول لأخطاء Postgrest، ولا نخاطر بأن يفشل تسجيل الخطأ نفسه على
  // بنية دائرية.
  console.error(`[data] ${scope}:`, error);
}

/**
 * ينفّذ استعلام قراءة ويحوّل أي فشل إلى نتيجة معلَنة.
 *
 * كل استعلام عام يمرّ من هنا: البديل — تكرار `try/catch` في كل دالة — يعني أن
 * الدالة السابعة عشرة ستُكتب يومًا بلا `if (error)` ولن ينبّه أحد.
 */
export async function query<T>(
  scope: string,
  run: (supabase: Client) => PromiseLike<{ data: T | null; error: unknown }>,
  fallback: T,
): Promise<DataResult<T>> {
  try {
    const { data, error } = await run(await createClient());
    if (error) {
      logDataError(scope, error);
      return { data: fallback, failed: true };
    }
    return { data: data ?? fallback, failed: false };
  } catch (error) {
    logDataError(scope, error);
    return { data: fallback, failed: true };
  }
}
