import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { categoryEmoji, formatQuantity, relativeTimeAr, unitLabels } from "@/lib/constants";
import type { Database } from "@/types/database";

type Need = Database["public"]["Tables"]["needs"]["Row"] & {
  categories: { slug: string; name_ar: string; default_unit: string } | null;
};

export function NeedCard({ need }: { need: Need }) {
  const deficit = Math.max(0, Number(need.quantity_needed) - Number(need.quantity_available));
  const unit = unitLabels[need.unit] ?? need.unit;
  const emoji = need.categories ? categoryEmoji[need.categories.slug] : "📦";

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-3 px-5">
        <div className="flex items-start justify-between gap-2">
          <PriorityBadge priority={need.priority} />
          <span className="text-xs text-muted-foreground">{relativeTimeAr(need.updated_at)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {emoji}
          </span>
          <div>
            <p className="font-bold leading-tight">{need.title || need.categories?.name_ar}</p>
            <p className="text-sm text-muted-foreground">
              {need.commune}، ولاية {need.wilaya}
            </p>
          </div>
        </div>

        <div className="mt-1 grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-3 text-center">
          <div>
            <p className="text-[11px] text-muted-foreground">الاحتياج</p>
            <p className="font-bold tabular-nums text-sm">{formatQuantity(Number(need.quantity_needed))}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">المتوفر</p>
            <p className="font-bold tabular-nums text-sm">{formatQuantity(Number(need.quantity_available))}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">النقص</p>
            <p className="font-bold tabular-nums text-sm text-priority-critical">
              {formatQuantity(deficit)}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">الوحدة: {unit}</p>

        <LinkButton href={`/donate?category=${need.categories?.slug ?? ""}`} className="mt-auto w-full">
          أريد توفير هذه الحاجة
        </LinkButton>
      </CardContent>
    </Card>
  );
}
