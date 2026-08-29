import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * عميل بصلاحية الخدمة الكاملة (service role) — يتجاوز RLS بالكامل.
 * لا يُستخدم في مسارات النماذج العامة إطلاقًا (تلك محمية عبر RLS مباشرة).
 * يُستخدم فقط في سكربتات إدارية محلية (مثل إنشاء أول حساب أدمن).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY أو NEXT_PUBLIC_SUPABASE_URL غير مضبوطين");
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
