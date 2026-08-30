import {
  Circle,
  Flame,
  Droplet,
  Utensils,
  Shirt,
  BedDouble,
  Baby,
  ShowerHead,
  Pill,
  CookingPot,
  Package,
  Tent,
  Construction,
  HardHat,
  Tag,
  type LucideIcon,
} from "lucide-react";
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

/** أيقونة موحّدة (نقطة ملوّنة) — اللون يأتي من text-priority-* في المكوّن. */
export const priorityIcon: Record<PriorityLevel, LucideIcon> = {
  critical: Circle,
  high: Circle,
  medium: Circle,
  low: Circle,
};

export const verificationLabels: Record<VerificationLevel, string> = {
  unverified: "غير موثق",
  pending: "قيد التحقق",
  verified: "موثق",
  field_verified: "موثق ميدانيًا",
};

/** أيقونة موحّدة (نقطة ملوّنة) — اللون يأتي من text-verify-* في المكوّن. */
export const verificationIcon: Record<VerificationLevel, LucideIcon> = {
  unverified: Circle,
  pending: Circle,
  verified: Circle,
  field_verified: Circle,
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
  person: "شخص",
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
export const categoryIcon: Record<string, LucideIcon> = {
  water: Droplet,
  food: Utensils,
  clothing: Shirt,
  blankets: BedDouble,
  baby_supplies: Baby,
  hygiene: ShowerHead,
  medical: Pill,
  kitchenware: CookingPot,
  relief_materials: Package,
  shelter: Tent,
  construction_materials: Construction,
  cooking_gas: Flame,
  manpower: HardHat,
  other: Tag,
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

export type AffectedSeverity = Database["public"]["Enums"]["affected_severity"];

export const severityLabels: Record<AffectedSeverity, string> = {
  ravaged: "أضرار جسيمة",
  evacuated: "تم الإجلاء",
  threatened: "منازل مهددة",
  burning: "منطقة متضررة",
  unconfirmed: "بلاغ غير مؤكد",
};

export const severityIcon: Record<AffectedSeverity, LucideIcon> = {
  ravaged: Circle,
  evacuated: Circle,
  threatened: Circle,
  burning: Flame,
  unconfirmed: Circle,
};

/** ترتيب العرض: الأخطر أولًا، والبلاغات غير المؤكدة في الأخير. */
export const severityRank: Record<AffectedSeverity, number> = {
  ravaged: 0,
  evacuated: 1,
  threatened: 2,
  burning: 3,
  unconfirmed: 4,
};

export type MedicalVerificationStatus = Database["public"]["Enums"]["medical_verification_status"];

export const medicalVerificationStatusLabels: Record<MedicalVerificationStatus, string> = {
  pending: "قيد التحقق",
  verified: "موثّق",
  rejected: "مرفوض",
};

export type ArtisanVerificationStatus = Database["public"]["Enums"]["artisan_verification_status"];

export const artisanVerificationStatusLabels: Record<ArtisanVerificationStatus, string> = {
  pending: "قيد التحقق",
  verified: "موثّق",
  rejected: "مرفوض",
};

export type DamageAssessmentStatus = Database["public"]["Enums"]["damage_assessment_status"];

export const damageAssessmentStatusLabels: Record<DamageAssessmentStatus, string> = {
  pending: "قيد المراجعة",
  estimated: "تم التقدير",
  matched: "تمت المطابقة",
  in_progress: "قيد التنفيذ",
  completed: "منجَز",
  rejected: "مرفوض",
};
