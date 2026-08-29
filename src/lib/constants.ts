import type { Database } from "@/types/database";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type VerificationLevel = Database["public"]["Enums"]["verification_level"];
export type PriorityLevel = Database["public"]["Enums"]["priority_level"];
export type RequestStatus = Database["public"]["Enums"]["request_status"];
export type PointStatus = Database["public"]["Enums"]["point_status"];
export type TransportStatus = Database["public"]["Enums"]["transport_status"];
export type InventoryTxnType = Database["public"]["Enums"]["inventory_txn_type"];
export type SourceType = Database["public"]["Enums"]["source_type"];
export type UnitType = Database["public"]["Enums"]["unit_type"];
export type VehicleType = Database["public"]["Enums"]["vehicle_type"];
export type DonationStatus = Database["public"]["Enums"]["donation_status"];
export type NeedStatus = Database["public"]["Enums"]["need_status"];

export const priorityLabels: Record<PriorityLevel, string> = {
  critical: "حرج",
  high: "عالٍ",
  medium: "متوسط",
  low: "منخفض",
};

export const priorityEmoji: Record<PriorityLevel, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "⚪",
};

export const verificationLabels: Record<VerificationLevel, string> = {
  unverified: "غير موثق",
  pending: "قيد التحقق",
  verified: "موثق",
  field_verified: "موثق ميدانيًا",
};

export const verificationEmoji: Record<VerificationLevel, string> = {
  unverified: "⚪",
  pending: "🟡",
  verified: "🟢",
  field_verified: "🟢",
};

export const requestStatusLabels: Record<RequestStatus, string> = {
  pending: "قيد الانتظار",
  under_review: "قيد المراجعة",
  verified: "تم التحقق",
  partially_helped: "مساعدة جزئية",
  helped: "تمت المساعدة",
  closed: "مغلق",
  rejected: "مرفوض",
};

export const pointStatusLabels: Record<PointStatus, string> = {
  open: "مفتوحة",
  full: "ممتلئة",
  paused: "متوقفة مؤقتًا",
  closed: "مغلقة",
};

export const transportStatusLabels: Record<TransportStatus, string> = {
  requested: "مطلوب",
  matched: "تمت المطابقة",
  confirmed: "مؤكَّد",
  in_transit: "في الطريق",
  delivered: "تم التسليم",
  cancelled: "ملغى",
};

export const sourceTypeLabels: Record<SourceType, string> = {
  field_team: "فريق ميداني",
  organization: "جمعية",
  municipality: "بلدية",
  official: "جهة رسمية",
  volunteer: "متطوع",
  public_report: "بلاغ عام",
};

export const unitLabels: Record<UnitType, string> = {
  piece: "قطعة",
  box: "صندوق",
  portion: "حصة",
  carton: "كرتون",
  liter: "لتر",
  kg: "كيلوغرام",
  ton: "طن",
  bundle: "طرد",
};

export const vehicleLabels: Record<VehicleType, string> = {
  car: "سيارة",
  van: "فان",
  small_truck: "شاحنة صغيرة",
  medium_truck: "شاحنة متوسطة",
  large_truck: "شاحنة كبيرة",
  trailer: "مقطورة",
};

export const donationStatusLabels: Record<DonationStatus, string> = {
  registered: "مسجَّلة",
  matched: "تمت المطابقة",
  delivered: "تم التسليم",
  cancelled: "ملغاة",
};

export const needStatusLabels: Record<NeedStatus, string> = {
  active: "نشط",
  resolved: "تمت التلبية",
  expired: "منتهي",
};

export const roleLabels: Record<AppRole, string> = {
  admin: "مدير",
  coordinator: "منسّق",
  volunteer: "متطوع",
  verified_organization: "جمعية موثقة",
  donor: "متبرع",
  driver: "سائق",
  beneficiary: "مستفيد",
};

// يجب أن تطابق slugs جدول categories في قاعدة البيانات (migration 0009)
export const categoryEmoji: Record<string, string> = {
  water: "💧",
  food: "🍚",
  clothing: "👕",
  blankets: "🛏️",
  baby_supplies: "🍼",
  hygiene: "🧼",
  medical: "💊",
  kitchenware: "🍳",
  relief_materials: "📦",
  shelter: "⛺",
  construction_materials: "🧱",
  other: "🔖",
};

export function relativeTimeAr(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "الآن";
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `منذ ${diffDays} يوم`;
  const diffMonths = Math.round(diffDays / 30);
  return `منذ ${diffMonths} شهر`;
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat("ar-DZ").format(value);
}
