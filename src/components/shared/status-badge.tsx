import { cn } from "@/lib/utils";
import {
  getPointStatusLabel,
  getRequestStatusLabel,
  type PointStatus,
  type RequestStatus,
} from "@/lib/constants";
import type { AvailableLocale } from "@/i18n/locales";

const styles: Record<PointStatus, string> = {
  open: "bg-status-open/10 text-status-open border-status-open/30",
  full: "bg-status-full/10 text-status-full border-status-full/30",
  paused: "bg-status-paused/10 text-status-paused border-status-paused/30",
  closed: "bg-status-closed/10 text-status-closed border-status-closed/30",
};

const dotStyles: Record<PointStatus, string> = {
  open: "bg-status-open",
  full: "bg-status-full",
  paused: "bg-status-paused",
  closed: "bg-status-closed",
};

export function PointStatusBadge({
  status,
  locale = "ar",
  className,
}: {
  status: PointStatus;
  locale?: AvailableLocale;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        styles[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotStyles[status])} aria-hidden />
      {getPointStatusLabel(status, locale)}
    </span>
  );
}

const requestStatusStyles: Record<RequestStatus, string> = {
  pending: "bg-verify-pending/10 text-verify-pending border-verify-pending/30",
  under_review: "bg-verify-pending/10 text-verify-pending border-verify-pending/30",
  verified: "bg-verify-verified/10 text-verify-verified border-verify-verified/30",
  partially_helped: "bg-verify-field/10 text-verify-field border-verify-field/30",
  helped: "bg-status-open/10 text-status-open border-status-open/30",
  closed: "bg-muted text-muted-foreground border-border",
  rejected: "bg-priority-critical/10 text-priority-critical border-priority-critical/30",
};

/** حالة طلب مساعدة — نفس شكل شارة النقاط، بألوان مسار الطلب. */
export function RequestStatusBadge({
  status,
  locale = "ar",
  className,
}: {
  status: RequestStatus;
  locale?: AvailableLocale;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        requestStatusStyles[status],
        className,
      )}
    >
      {getRequestStatusLabel(status, locale)}
    </span>
  );
}
