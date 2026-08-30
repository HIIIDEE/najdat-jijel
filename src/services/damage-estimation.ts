/**
 * estimateDamageMaterials
 * منطق تقدير صريح بمعادلات ثابتة (بدون أي ذكاء اصطناعي) — نفس فلسفة src/services/matching.ts:
 * يحوّل تفاصيل الأضرار المصرَّح بها إلى كمية مواد تقريبية وقائمة تخصصات الحرفيين المطلوبين.
 * القيم أدناه تقديرية وقابلة للتعديل بسهولة إن توفرت بيانات ميدانية أدق.
 */

// معدل تغطية الدهان: ~6 م² لكل لتر للطبقة الواحدة، وطبقتان عادة كافيتان للترميم.
const PAINT_COVERAGE_SQM_PER_LITER = 6;
const PAINT_COATS = 2;
// حجم البيدون القياسي المتوفر غالبًا في التبرعات.
const PAINT_CAN_SIZE_LITERS = 4;

export interface DamageEstimationInput {
  needsPaint: boolean;
  paintAreaSqm: number | null;
  needsFlooring: boolean;
  needsRoofing: boolean;
  needsPlumbing: boolean;
  needsElectrical: boolean;
}

export interface DamageEstimationResult {
  paintLiters: number;
  paintCans: number;
  /** أسماء التخصصات بالعربية — تُستخدم للمطابقة مع artisan_volunteers.specialty وللعرض. */
  requiredSpecialties: string[];
}

export function estimateDamageMaterials(input: DamageEstimationInput): DamageEstimationResult {
  let paintLiters = 0;
  let paintCans = 0;

  if (input.needsPaint && input.paintAreaSqm && input.paintAreaSqm > 0) {
    paintLiters = Math.ceil((input.paintAreaSqm / PAINT_COVERAGE_SQM_PER_LITER) * PAINT_COATS);
    paintCans = Math.ceil(paintLiters / PAINT_CAN_SIZE_LITERS);
  }

  const requiredSpecialties: string[] = [];
  if (input.needsPaint) requiredSpecialties.push("دهان");
  if (input.needsFlooring || input.needsRoofing) requiredSpecialties.push("بناء");
  if (input.needsPlumbing) requiredSpecialties.push("سباك");
  if (input.needsElectrical) requiredSpecialties.push("كهربائي");

  return { paintLiters, paintCans, requiredSpecialties };
}
