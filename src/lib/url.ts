/**
 * فكّ ترميز مقطع من المسار (route segment) بأمان.
 *
 * Next.js يمرّر معاملات المسار الديناميكي بترميز النسبة المئوية كما وردت في الرابط،
 * فالـ slug العربي يصل هكذا: "%D8%AF%D9%84..." ولا يطابق القيمة المخزَّنة في قاعدة البيانات.
 * كما أن decodeURIComponent يرمي URIError على المدخلات المشوّهة (مثل "%ZZ")،
 * وهو ما يحوّل صفحة غير موجودة إلى خطأ 500، لذلك نُرجع النص كما هو عند الفشل.
 */
export function decodeSlug(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
