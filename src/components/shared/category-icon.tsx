import { Package } from "lucide-react";
import { categoryIcon } from "@/lib/constants";

/** أيقونة فئة المادة (ماء، غذاء...) — Package كأيقونة احتياطية لفئة غير معروفة. */
export function CategoryIcon({ slug, className }: { slug: string | null | undefined; className?: string }) {
  const Icon = (slug && categoryIcon[slug]) || Package;
  return <Icon className={className} aria-hidden />;
}
