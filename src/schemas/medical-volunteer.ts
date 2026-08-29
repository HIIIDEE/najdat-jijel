import { z } from "zod";

export const medicalVolunteerSchema = z.object({
  full_name: z
    .string({ error: "الاسم الكامل مطلوب" })
    .min(3, "الاسم يجب أن يحتوي على 3 أحرف على الأقل"),
  phone: z
    .string({ error: "رقم الهاتف مطلوب" })
    .regex(/^(0)(5|6|7)[0-9]{8}$/, "رقم الهاتف غير صحيح (مثال: 0612345678)"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .optional()
    .or(z.literal("")),
  specialty: z
    .string({ error: "يرجى تحديد التخصص الطبي" })
    .min(2, "التخصص الطبي مطلوب"),
  license_number: z.string().optional().or(z.literal("")),
  wilaya_code: z.string({ error: "يرجى اختيار الولاية" }).min(1),
  commune_id: z.string({ error: "يرجى اختيار البلدية" }).min(1),
  current_workplace: z.string().optional().or(z.literal("")),
  can_teleconsult: z.boolean().default(false),
  can_field_intervene: z.boolean().default(true),
  has_emergency_kit: z.boolean().default(false),
  notes: z.string().max(500, "الملاحظات لا يجب أن تتجاوز 500 حرف").optional().or(z.literal("")),
});

// z.input (not z.infer/z.output): the booleans carry .default(), which zod v4
// only fills in on parse — react-hook-form's raw field values (and the
// zodResolver's expected form-values generic) still see them as optional.
export type MedicalVolunteerInput = z.input<typeof medicalVolunteerSchema>;