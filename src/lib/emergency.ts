// أرقام الطوارئ الرسمية في الجزائر — مجانية وتعمل 24/7
// مصدر العرض: منصة سند (Quanta Club) وهي أرقام عمومية معروفة.
export interface EmergencyContact {
  number: string;
  label: string;
  emoji: string;
}

export const emergencyContacts: EmergencyContact[] = [
  { number: "14", label: "الحماية المدنية", emoji: "🚒" },
  { number: "1055", label: "الدرك الوطني", emoji: "🛡️" },
  { number: "17", label: "الأمن والشرطة", emoji: "🚓" },
  { number: "1100", label: "الرقم الأخضر", emoji: "☎️" },
];
