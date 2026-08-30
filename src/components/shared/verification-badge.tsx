import { cn } from "@/lib/utils";
import { verificationIcon, getVerificationLabel, type VerificationLevel } from "@/lib/constants";
import type { AvailableLocale } from "@/i18n/locales";

const styles: Record<VerificationLevel, string> = {
  unverified: "bg-muted text-muted-foreground border-border",
  pending: "bg-verify-pending/10 text-verify-pending border-verify-pending/30",
  verified: "bg-verify-verified/10 text-verify-verified border-verify-verified/30",
  field_verified: "bg-verify-field/10 text-verify-field border-verify-field/30",
};

export function VerificationBadge({
  level,
  locale = "ar",
  label,
  className,
}: {
  level: VerificationLevel;
  locale?: AvailableLocale;
  label?: string;
  className?: string;
}) {
  const Icon = verificationIcon[level];
  const displayLabel = label ?? getVerificationLabel(level, locale);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[level],
        className,
      )}
    >
      <Icon className="size-2" fill="currentColor" aria-hidden />
      {displayLabel}
    </span>
  );
}
