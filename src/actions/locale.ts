"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE, isAvailableLocale } from "@/i18n/locales";

/** سنة كاملة — الاختيار تفضيل شخصي، لا داعي لتكراره كل زيارة. */
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * يحفظ اللغة المختارة في كوكي.
 * لا يقبل إلا لغة معروفة ولها ترجمة فعلية، فالقيمة تأتي من المتصفح.
 */
export async function setLocale(value: string) {
  if (!isAvailableLocale(value)) {
    return { success: false, error: "لغة غير مدعومة." };
  }

  (await cookies()).set(LOCALE_COOKIE, value, {
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
    sameSite: "lax",
  });

  // اللغة تغيّر كل صفحة، لا الصفحة الحالية وحدها.
  revalidatePath("/", "layout");
  return { success: true };
}
