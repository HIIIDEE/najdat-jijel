/**
 * سجل اللغات.
 *
 * `LOCALES` خارطة الطريق، و`AVAILABLE_LOCALES` هي اللغات المترجَمة فعلًا اليوم
 * وهي وحدها ما يظهر في مبدّل اللغة. إضافة لغة = ملف رسائل جديد + سطر في
 * `AVAILABLE_LOCALES` + سطر في `dictionaries.ts`؛ والنوع يمنع نسيان أيّها.
 *
 * هذا الملف صالح للخادم والعميل والوسيط معًا، فلا يستورد شيئًا مقصورًا على الخادم.
 */
export const LOCALES = ["ar", "fr", "en", "kab"] as const;

export type Locale = (typeof LOCALES)[number];

/** اللغات المترجَمة فعلًا. */
export const AVAILABLE_LOCALES = ["ar", "fr"] as const satisfies readonly Locale[];

export type AvailableLocale = (typeof AVAILABLE_LOCALES)[number];

/** الافتراضية: العربية — لغة الميدان والمستفيدين. */
export const DEFAULT_LOCALE: AvailableLocale = "ar";

/** اسم الكوكي، بنفس اصطلاح Next.js. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export interface LocaleMeta {
  code: Locale;
  /** اسم اللغة بلغتها نفسها — هكذا يتعرّف عليها الناطق بها ولو لم يقرأ لغة الواجهة. */
  endonym: string;
  dir: "rtl" | "ltr";
  /** قيمة سمة lang في HTML (BCP 47). */
  htmlLang: string;
  /** وسم OpenGraph. */
  ogLocale: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  ar: { code: "ar", endonym: "العربية", dir: "rtl", htmlLang: "ar-DZ", ogLocale: "ar_DZ" },
  fr: { code: "fr", endonym: "Français", dir: "ltr", htmlLang: "fr-DZ", ogLocale: "fr_DZ" },
  en: { code: "en", endonym: "English", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
  // القبائلية بالحرف اللاتيني الأمازيغي، وهو المستعمل فعليًا في منطقة القبائل
  // (بجاية وجيجل داخل نطاق الحملة). يحتاج محارف لاتينية ممتدة: ɣ ɛ ḍ ṭ ẓ ǧ.
  kab: { code: "kab", endonym: "Taqbaylit", dir: "ltr", htmlLang: "kab", ogLocale: "kab" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function isAvailableLocale(value: string | undefined | null): value is AvailableLocale {
  return typeof value === "string" && (AVAILABLE_LOCALES as readonly string[]).includes(value);
}
