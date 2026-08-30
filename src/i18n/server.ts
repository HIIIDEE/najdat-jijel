import "server-only";
import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isAvailableLocale,
  type AvailableLocale,
} from "./locales";

/**
 * اللغة المختارة للطلب الحالي.
 * تُقرأ من الكوكي وحدها: الوسيط (middleware) هو من يضبطها انطلاقًا من `?lang=`.
 * أي قيمة غير معروفة أو لغة بلا ترجمة ترجع إلى اللغة الافتراضية.
 */
export async function getLocale(): Promise<AvailableLocale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isAvailableLocale(value)) return value;
  return DEFAULT_LOCALE;
}

