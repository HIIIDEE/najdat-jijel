/**
 * مرجع طلب المساعدة.
 *
 * يُملى في الهاتف وقد يُكتب بخط اليد، فالأبجدية بلا محارف يسهل الخلط بينها:
 * لا O ولا 0، لا I ولا 1 ولا L. الشكل النهائي: HB-K7M2QX.
 *
 * الأبجدية والطول هنا نسخة طبق الأصل مما في
 * `supabase/migrations/0029_beneficiary_request_reference.sql`. التكرار مقصود
 * ومحدود: التطبيق هو من يولّد المرجع لأن سياسة RLS تمنح الزائر الإدراج دون
 * القراءة، فلا سبيل لاسترجاع ما تولّده القاعدة بعد الإدراج. وما في القاعدة
 * شبكة أمان لما يُدرَج من خارج التطبيق.
 */
const REFERENCE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const REFERENCE_PREFIX = "HB-";
export const REFERENCE_LENGTH = 6;

/** يولّد مرجعًا جديدًا. التفرّد تضمنه فهرسة فريدة في قاعدة البيانات. */
export function generateRequestReference(): string {
  const bytes = new Uint8Array(REFERENCE_LENGTH);
  crypto.getRandomValues(bytes);

  let body = "";
  // انحياز القسمة (256 ليست من مضاعفات 31) لا أثر له هنا: المرجع مفتاح بحث
  // مقترن برقم الهاتف، لا سرًّا تقوم عليه الحماية.
  for (const byte of bytes) body += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];

  return REFERENCE_PREFIX + body;
}

/** طول المرجع كاملًا بعد التطبيع: البادئة HB زائد الجسم. */
const NORMALIZED_LENGTH = 2 + REFERENCE_LENGTH;

/**
 * جسم المرجع وحده، من أي صيغة كتبها المستخدم.
 *
 * الطول هو الفيصل لا مجرّد وجود "HB" في البداية: حرفا H وB من الأبجدية نفسها،
 * فقد يبدأ الجسم بهما (HBQ2XY). حذف البادئة كلما ظهرت يبتر جسمًا صحيحًا،
 * واشتراطها يرفض من كتب الرمز وحده بلا بادئة — وكلا الحالتين تُظهر للمتضرّر
 * «لم نعثر على طلب» بينما رمزه سليم.
 */
export function referenceBody(input: string): string {
  const normalized = input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return normalized.length === NORMALIZED_LENGTH && normalized.startsWith("HB")
    ? normalized.slice(2)
    : normalized;
}
