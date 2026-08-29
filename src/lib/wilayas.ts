// قائمة ولايات الجزائر الـ58 مع إحداثيات تقريبية لمركز كل ولاية (بيانات جغرافية عامة)
// تُستخدم لملء القوائم المنسدلة ولتقدير المسافة التقريبية بين المتبرع ونقاط التسليم.
export interface Wilaya {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

export const wilayas: Wilaya[] = [
  { code: "01", name: "أدرار", lat: 27.8742, lng: -0.2939 },
  { code: "02", name: "الشلف", lat: 36.165, lng: 1.3347 },
  { code: "03", name: "الأغواط", lat: 33.8, lng: 2.8667 },
  { code: "04", name: "أم البواقي", lat: 35.8772, lng: 7.1136 },
  { code: "05", name: "باتنة", lat: 35.5559, lng: 6.1741 },
  { code: "06", name: "بجاية", lat: 36.7509, lng: 5.0567 },
  { code: "07", name: "بسكرة", lat: 34.85, lng: 5.7333 },
  { code: "08", name: "بشار", lat: 31.6167, lng: -2.2167 },
  { code: "09", name: "البليدة", lat: 36.4703, lng: 2.8277 },
  { code: "10", name: "البويرة", lat: 36.3737, lng: 3.9016 },
  { code: "11", name: "تمنراست", lat: 22.785, lng: 5.5228 },
  { code: "12", name: "تبسة", lat: 35.4042, lng: 8.1242 },
  { code: "13", name: "تلمسان", lat: 34.8781, lng: -1.315 },
  { code: "14", name: "تيارت", lat: 35.3711, lng: 1.317 },
  { code: "15", name: "تيزي وزو", lat: 36.7169, lng: 4.0497 },
  { code: "16", name: "الجزائر", lat: 36.7538, lng: 3.0588 },
  { code: "17", name: "الجلفة", lat: 34.6667, lng: 3.25 },
  { code: "18", name: "جيجل", lat: 36.819, lng: 5.766 },
  { code: "19", name: "سطيف", lat: 36.19, lng: 5.41 },
  { code: "20", name: "سعيدة", lat: 34.83, lng: 0.15 },
  { code: "21", name: "سكيكدة", lat: 36.879, lng: 6.908 },
  { code: "22", name: "سيدي بلعباس", lat: 35.2, lng: -0.6333 },
  { code: "23", name: "عنابة", lat: 36.9, lng: 7.7667 },
  { code: "24", name: "قالمة", lat: 36.4667, lng: 7.4333 },
  { code: "25", name: "قسنطينة", lat: 36.365, lng: 6.6147 },
  { code: "26", name: "المدية", lat: 36.2675, lng: 2.7539 },
  { code: "27", name: "مستغانم", lat: 35.9333, lng: 0.0833 },
  { code: "28", name: "المسيلة", lat: 35.7058, lng: 4.535 },
  { code: "29", name: "معسكر", lat: 35.4, lng: 0.1333 },
  { code: "30", name: "ورقلة", lat: 31.95, lng: 5.3167 },
  { code: "31", name: "وهران", lat: 35.6969, lng: -0.6331 },
  { code: "32", name: "البيض", lat: 33.6833, lng: 1.0167 },
  { code: "33", name: "إليزي", lat: 26.5031, lng: 8.4681 },
  { code: "34", name: "برج بوعريريج", lat: 36.07, lng: 4.76 },
  { code: "35", name: "بومرداس", lat: 36.7669, lng: 3.4772 },
  { code: "36", name: "الطارف", lat: 36.7672, lng: 8.3136 },
  { code: "37", name: "تندوف", lat: 27.6742, lng: -8.1481 },
  { code: "38", name: "تيسمسيلت", lat: 35.6075, lng: 1.8117 },
  { code: "39", name: "الوادي", lat: 33.3683, lng: 6.8674 },
  { code: "40", name: "خنشلة", lat: 35.4364, lng: 7.1439 },
  { code: "41", name: "سوق أهراس", lat: 36.2864, lng: 7.9511 },
  { code: "42", name: "تيبازة", lat: 36.5892, lng: 2.4483 },
  { code: "43", name: "ميلة", lat: 36.45, lng: 6.25 },
  { code: "44", name: "عين الدفلى", lat: 36.2639, lng: 1.9678 },
  { code: "45", name: "النعامة", lat: 33.2667, lng: -0.3167 },
  { code: "46", name: "عين تموشنت", lat: 35.3, lng: -1.1333 },
  { code: "47", name: "غرداية", lat: 32.4833, lng: 3.6667 },
  { code: "48", name: "غليزان", lat: 35.7333, lng: 0.5833 },
  { code: "49", name: "تيميمون", lat: 29.2639, lng: 0.2408 },
  { code: "50", name: "برج باجي مختار", lat: 21.3253, lng: 0.9556 },
  { code: "51", name: "أولاد جلال", lat: 34.4225, lng: 5.0692 },
  { code: "52", name: "بني عباس", lat: 30.13, lng: -2.16 },
  { code: "53", name: "عين صالح", lat: 27.1936, lng: 2.4844 },
  { code: "54", name: "عين قزام", lat: 19.5675, lng: 5.7719 },
  { code: "55", name: "تقرت", lat: 33.1064, lng: 6.0664 },
  { code: "56", name: "جانت", lat: 24.5539, lng: 9.4844 },
  { code: "57", name: "المغير", lat: 33.9506, lng: 5.9333 },
  { code: "58", name: "المنيعة", lat: 30.5833, lng: 2.8833 },
];

export const wilayaNames = wilayas.map((w) => w.name);

export function findWilayaByName(name: string): Wilaya | undefined {
  return wilayas.find((w) => w.name === name);
}

// صيغة Haversine لتقدير المسافة التقريبية بالكيلومتر بين نقطتين
export function haversineDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}
