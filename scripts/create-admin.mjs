// سكربت لإنشاء أول حساب أدمن في المنصة.
// الاستخدام:
//   node scripts/create-admin.mjs admin@example.com "كلمة-مرور-قوية" "اسم المسؤول"
//
// يتطلب أن يكون NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY مضبوطين في .env.local

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  try {
    const content = readFileSync(join(__dirname, "..", ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local غير موجود؛ يُفترض أن المتغيرات مضبوطة في البيئة مسبقًا
  }
}

loadEnvLocal();

const [, , email, password, fullName] = process.argv;

if (!email || !password) {
  console.error('الاستخدام: node scripts/create-admin.mjs <email> <password> ["الاسم الكامل"]');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("يجب ضبط NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: created, error: createError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: fullName ?? null, role: "admin" },
});

if (createError) {
  console.error("فشل إنشاء المستخدم:", createError.message);
  process.exit(1);
}

const userId = created.user.id;

const { error: updateError } = await supabase
  .from("profiles")
  .update({ role: "admin", full_name: fullName ?? null })
  .eq("id", userId);

if (updateError) {
  console.error("تم إنشاء المستخدم لكن فشل تحديث الدور:", updateError.message);
  process.exit(1);
}

console.log(`تم إنشاء حساب الأدمن بنجاح: ${email}`);
