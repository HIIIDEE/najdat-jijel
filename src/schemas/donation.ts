import { z } from "zod";

export const donationCategoryOptions = [
  { value: "water", label: "ماء" },
  { value: "food", label: "غذاء" },
  { value: "clothing", label: "ملابس" },
  { value: "blankets", label: "أغطية" },
  { value: "baby_supplies", label: "مستلزمات أطفال" },
  { value: "hygiene", label: "مواد نظافة" },
  { value: "medical", label: "مستلزمات طبية" },
  { value: "kitchenware", label: "أدوات طبخ" },
  { value: "relief_materials", label: "مواد إغاثة" },
  { value: "other", label: "أخرى" },
] as const;

export const unitOptions = [
  { value: "piece", label: "قطعة" },
  { value: "box", label: "صندوق" },
  { value: "portion", label: "حصة" },
  { value: "carton", label: "كرتون" },
  { value: "liter", label: "لتر" },
  { value: "kg", label: "كيلوغرام" },
  { value: "ton", label: "طن" },
  { value: "bundle", label: "طرد" },
] as const;

export const donationItemSchema = z.object({
  category_id: z.string().uuid("اختر نوع المساعدة"),
  category_slug: z.string().min(1),
  quantity: z.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  unit: z.enum(["piece", "box", "portion", "carton", "liter", "kg", "ton", "bundle"]),
  description: z.string().trim().max(300).optional().or(z.literal("")),
});

export const donationSchema = z.object({
  donor_name: z.string().trim().min(2, "الاسم مطلوب"),
  donor_phone: z
    .string()
    .trim()
    .regex(/^0[5-7][0-9]{8}$/, "رقم هاتف جزائري غير صحيح (مثال: 0555xxxxxx)"),
  current_wilaya: z.string().trim().min(2, "الولاية مطلوبة"),
  current_commune: z.string().trim().max(200).optional().or(z.literal("")),
  needs_transport: z.boolean(),
  can_deliver_self: z.boolean(),
  ready_at: z.string().optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  items: z.array(donationItemSchema).min(1, "أضف مادة واحدة على الأقل"),
});

export type DonationInput = z.infer<typeof donationSchema>;
