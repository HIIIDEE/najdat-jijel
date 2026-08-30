import { z } from "zod";

export const artisanVolunteerSchema = z.object({
  full_name: z.string({ error: "الاسم الكامل مطلوب" }).min(3, "الاسم يجب أن يحتوي على 3 أحرف على الأقل"),
  phone: z
    .string({ error: "رقم الهاتف مطلوب" })
    .regex(/^(0)(5|6|7)[0-9]{8}$/, "رقم الهاتف غير صحيح (مثال: 0612345678)"),
  specialty: z.string({ error: "يرجى تحديد التخصص" }).min(2, "التخصص مطلوب"),
  wilaya_code: z.string({ error: "يرجى اختيار الولاية" }).min(1),
  commune_id: z.string({ error: "يرجى اختيار البلدية" }).min(1),
  can_travel: z.boolean(),
  has_own_tools: z.boolean(),
  show_phone_publicly: z.boolean(),
  notes: z.string().max(500, "الملاحظات لا يجب أن تتجاوز 500 حرف").optional().or(z.literal("")),
});

export type ArtisanVolunteerInput = z.infer<typeof artisanVolunteerSchema>;
