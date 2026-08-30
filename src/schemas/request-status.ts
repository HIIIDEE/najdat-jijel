import { z } from "zod";
import { REFERENCE_LENGTH, referenceBody } from "@/lib/reference";
import { beneficiaryRequestSchema } from "@/schemas/beneficiary-request";

export const requestStatusLookupSchema = z.object({
  // يُقبل ما يكتبه المستخدم كما هو — بشرطة أو بدونها، بالبادئة أو بدونها،
  // بأحرف صغيرة أو كبيرة — والتطبيع يتكفّل بالباقي قبل الإرسال.
  reference: z
    .string()
    .trim()
    .max(32, "المرجع غير صحيح (مثال: HB-K7M2QX)")
    .refine(
      (value) => referenceBody(value).length === REFERENCE_LENGTH,
      "المرجع غير صحيح (مثال: HB-K7M2QX)",
    ),
  // نفس قاعدة الهاتف المستعملة وقت إرسال الطلب: لو تغيّرت الصيغة المقبولة يومًا،
  // فمن العبث أن يقبلها نموذج الإرسال ويرفضها نموذج المتابعة.
  phone: beneficiaryRequestSchema.shape.phone,
});

export type RequestStatusLookupInput = z.infer<typeof requestStatusLookupSchema>;
