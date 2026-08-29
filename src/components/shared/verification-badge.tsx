import { cn } from "@/lib/utils";
import { verificationIcon, verificationLabels, type VerificationLevel } from "@/lib/constants";

const styles: Record<VerificationLevel, string> = {
  unverified: "bg-verify-unverified/10 text-verify-unverified border-verify-unverified/30",
  pending: "bg-verify-pending/10 text-verify-pending border-verify-pending/30",
  verified: "bg-verify-verified/10 text-verify-verified border-verify-verified/30",
  field_verified: "bg-verify-field/10 text-verify-field border-verify-field/30",
};

export function VerificationBadge({
  level,
  className,
}: {
  level: VerificationLevel;
  className?: string;
}) {
  const Icon = verificationIcon[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        styles[level],
        className,
      )}
    >
      <Icon className="size-2.5" fill="currentColor" aria-hidden />
      {verificationLabels[level]}
    </span>
  );
}
