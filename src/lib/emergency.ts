// أرقام الطوارئ الرسمية في الجزائر — مجانية وتعمل على مدار الساعة.
// تم التحقق منها من مصادر رسمية (المديرية العامة للحماية المدنية، المديرية العامة للأمن
// الوطني، المديرية العامة للغابات) — أغسطس 2026.
export interface EmergencyContact {
  /** رقم النجدة القصير */
  number: string;
  /** الرقم الأخضر المجاني (إن وُجد) */
  greenNumber?: string;
  label: string;
  hint?: string;
  emoji: string;
}

export const emergencyContacts: EmergencyContact[] = [
  {
    number: "14",
    greenNumber: "1021",
    label: "الحماية المدنية",
    hint: "إسعاف وإنقاذ وإخماد حرائق",
    emoji: "🚒",
  },
  {
    number: "1055",
    label: "الدرك الوطني",
    hint: "المناطق الريفية والطرق",
    emoji: "🛡️",
  },
  {
    number: "17",
    greenNumber: "1548",
    label: "الشرطة الجزائرية",
    hint: "الأمن الوطني — المناطق الحضرية",
    emoji: "🚓",
  },
  {
    number: "1070",
    label: "المديرية العامة للغابات",
    hint: "التبليغ عن حرائق الغابات",
    emoji: "🌲",
  },
];
