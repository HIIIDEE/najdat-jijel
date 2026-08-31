/**
 * رابط خارجي صالح للعرض، أو `null`.
 *
 * روابط البيانات الرسمية تأتي من قاعدة البيانات: من لوحة الإدارة أو من
 * الـ webhook. كلاهما يتحقّق الآن عند الإدخال، وهذا الفحص هو الطبقة الثانية —
 * فما هو مخزَّن اليوم دخل قبل ذلك التحقّق.
 *
 * `javascript:` و`data:` ينفّذان شيفرة عند النقر، ولا شيء في مظهر الرابط ينبّه
 * الزائر. لذلك قائمة مسموح بها لا قائمة ممنوعات.
 */
export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? value : null;
  } catch {
    // رابط نسبي أو نص مشوّه: لا يُعرض كرابط خارجي.
    return null;
  }
}
