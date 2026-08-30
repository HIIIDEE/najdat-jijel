import "server-only";
import ar from "./messages/ar";
import { DEFAULT_LOCALE, isAvailableLocale, type AvailableLocale, type Locale } from "./locales";

/**
 * شكل الرسائل — مشتقّ من الملف العربي، وهو المرجع.
 * أي مفتاح جديد هناك يصير إلزاميًا في كل اللغات الأخرى ويرفضه المدقّق إن نُسي.
 */
export type Dictionary = typeof ar;

/**
 * النوع `Record<AvailableLocale, ...>` يفرض تغطية كل لغة معلَنة في
 * `AVAILABLE_LOCALES`: إعلان لغة دون ملف رسائل لها يوقف الترجمة بخطأ.
 */
const loaders: Record<AvailableLocale, () => Promise<Dictionary>> = {
  ar: async () => ar,
  fr: async () => (await import("./messages/fr")).default,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (isAvailableLocale(locale) ? loaders[locale] : loaders[DEFAULT_LOCALE])();
}
