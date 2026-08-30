import { z } from "zod";

export const damageAssessmentSchema = z.object({
  full_name: z.string({ error: "الاسم الكامل مطلوب" }).min(3, "الاسم يجب أن يحتوي على 3 أحرف على الأقل"),
  phone: z
    .string({ error: "رقم الهاتف مطلوب" })
    .regex(/^(0)(5|6|7)[0-9]{8}$/, "رقم الهاتف غير صحيح (مثال: 0612345678)"),
  wilaya: z.string({ error: "يرجى اختيار الولاية" }).min(1),
  commune: z.string({ error: "يرجى إدخال البلدية" }).min(1),
  address_note: z.string().optional().or(z.literal("")),
  needs_paint: z.boolean(),
  paint_area_sqm: z.coerce.number().positive("يجب أن تكون أكبر من صفر").optional(),
  needs_flooring: z.boolean(),
  needs_roofing: z.boolean(),
  needs_plumbing: z.boolean(),
  needs_electrical: z.boolean(),
  finishing_notes: z.string().max(500, "الملاحظات لا يجب أن تتجاوز 500 حرف").optional().or(z.literal("")),
});

export type DamageAssessmentInput = z.infer<typeof damageAssessmentSchema>;
