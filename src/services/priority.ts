import type { PriorityLevel } from "@/lib/constants";

/**
 * calculateNeedPriority
 * تقدير أولي لأولوية الاحتياج بناءً على نسبة النقص إلى الكمية المطلوبة.
 * هذا تقدير مساعد فقط يظهر كاقتراح في نموذج الإدارة — القرار النهائي يبقى قابلًا للتعديل يدويًا.
 */
export function calculateNeedPriority(quantityNeeded: number, quantityAvailable: number): PriorityLevel {
  if (quantityNeeded <= 0) return "low";

  const deficitRatio = Math.max(0, quantityNeeded - quantityAvailable) / quantityNeeded;

  if (quantityAvailable <= 0 || deficitRatio >= 0.9) return "critical";
  if (deficitRatio >= 0.6) return "high";
  if (deficitRatio >= 0.3) return "medium";
  return "low";
}

/**
 * calculateBeneficiaryPriorityHint
 * نفس منطق دالة قاعدة البيانات calculate_beneficiary_priority()، معروض هنا فقط
 * لإظهار توقّع فوري في واجهة الإدارة قبل الحفظ. المصدر الحقيقي للحساب هو الـ trigger في قاعدة البيانات.
 */
export function calculateBeneficiaryPriorityHint(input: {
  familyMembersCount: number;
  childrenCount: number;
  hasInjuries: boolean;
  needsMedical: boolean;
  isHousingHabitable: boolean | null;
  lostLivestock: boolean;
  lostIncome: boolean;
}): PriorityLevel {
  let score = 0;
  score += Math.min(input.familyMembersCount, 10);
  score += input.childrenCount * 2;
  if (input.hasInjuries) score += 15;
  if (input.needsMedical) score += 15;
  if (input.isHousingHabitable === false) score += 20;
  if (input.lostLivestock) score += 3;
  if (input.lostIncome) score += 5;

  if (score >= 35) return "critical";
  if (score >= 20) return "high";
  if (score >= 10) return "medium";
  return "low";
}
