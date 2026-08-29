import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// عميل Supabase يعمل بصلاحيات المستخدم المسجّل دخوله (يحترم RLS بالكامل).
// يُستخدم في صفحات ومسارات لوحة التحكم بعد تسجيل الدخول.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // يمكن تجاهل الخطأ إذا استُدعيت من Server Component بدون إمكانية الكتابة؛
            // الـ middleware يتكفّل بتحديث الجلسة في هذه الحالة.
          }
        },
      },
    },
  );
}
