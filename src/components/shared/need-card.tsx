"use client";

import { useState } from "react";
import { MapPin, Info, Share2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { PriorityBadge } from "@/components/shared/priority-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatQuantity, relativeTimeAr, unitLabels } from "@/lib/constants";
import { CategoryIcon } from "@/components/shared/category-icon";
import { splitNeedNotes } from "@/lib/notes";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type Need = Database["public"]["Tables"]["needs"]["Row"] & {
  categories: { slug: string; name_ar: string; default_unit: string } | null;
};

export function NeedCard({ need }: { need: Need }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const needed = Number(need.quantity_needed);
  const available = Number(need.quantity_available);
  const deficit = Math.max(0, needed - available);
  const hasQuantities = needed > 0;
  const coverage = hasQuantities ? Math.min(100, Math.round((available / needed) * 100)) : 0;

  const unit = unitLabels[need.unit] ?? need.unit;
  const title = need.title || need.categories?.name_ar || "احتياج";
  const { detail, source } = splitNeedNotes(need.notes);

  async function share() {
    const text = `${title} — ${need.commune}، ولاية ${need.wilaya}`;
    const url = typeof window !== "undefined" ? `${window.location.origin}/needs` : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* المستخدم ألغى المشاركة */
    }
  }

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className={cn(
          "group h-full cursor-pointer transition-all",
          "hover:-translate-y-0.5 hover:border-algeria-green/50 hover:shadow-md",
        )}
      >
        <CardContent className="flex h-full flex-col gap-3 px-5">
          <div className="flex items-start justify-between gap-2">
            <PriorityBadge priority={need.priority} />
            <span className="text-xs text-muted-foreground">{relativeTimeAr(need.updated_at)}</span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-algeria-green/10 text-algeria-green">
              <CategoryIcon slug={need.categories?.slug} className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-bold leading-tight">{title}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                {need.commune}، ولاية {need.wilaya}
              </p>
            </div>
          </div>

          {hasQuantities ? (
            <div className="mt-1 space-y-2">
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-3 text-center">
                <div>
                  <p className="text-[11px] text-muted-foreground">الاحتياج</p>
                  <p className="text-sm font-bold tabular-nums">{formatQuantity(needed)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">المتوفر</p>
                  <p className="text-sm font-bold tabular-nums">{formatQuantity(available)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">النقص</p>
                  <p className="text-sm font-bold tabular-nums text-priority-critical">
                    {formatQuantity(deficit)}
                  </p>
                </div>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={coverage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="نسبة تغطية الاحتياج"
              >
                <div
                  className="h-full rounded-full bg-algeria-green transition-[width] duration-500"
                  style={{ width: `${coverage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                تمت تغطية {coverage}% · الوحدة: {unit}
              </p>
            </div>
          ) : (
            <div className="mt-1 flex items-start gap-2 rounded-lg bg-muted/60 p-3">
              <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                الكمية غير محددة — احتياج ميداني مُبلَّغ عنه. تواصل مع نقطة التنسيق لتحديد الكمية
                المناسبة قبل الإرسال.
              </p>
            </div>
          )}

          <div className="mt-auto flex gap-2 pt-1">
            <LinkButton
              href={`/donate?category=${need.categories?.slug ?? ""}`}
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              أريد توفير هذه الحاجة
            </LinkButton>
            <Button
              variant="outline"
              size="icon"
              aria-label="مشاركة"
              onClick={(e) => {
                e.stopPropagation();
                void share();
              }}
            >
              {copied ? <Check className="size-4 text-algeria-green" /> : <Share2 className="size-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-algeria-green/10 text-algeria-green">
                <CategoryIcon slug={need.categories?.slug} className="size-4" />
              </span>
              <DialogTitle>{title}</DialogTitle>
            </div>
            <DialogDescription className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {need.commune}، ولاية {need.wilaya}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={need.priority} />
            <span className="text-xs text-muted-foreground">
              آخر تحديث {relativeTimeAr(need.updated_at)}
            </span>
          </div>

          {hasQuantities && (
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-3 text-center">
              <div>
                <p className="text-[11px] text-muted-foreground">الاحتياج</p>
                <p className="font-bold tabular-nums">
                  {formatQuantity(needed)} {unit}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">المتوفر</p>
                <p className="font-bold tabular-nums">{formatQuantity(available)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">النقص</p>
                <p className="font-bold tabular-nums text-priority-critical">
                  {formatQuantity(deficit)}
                </p>
              </div>
            </div>
          )}

          {detail && (
            <div className="rounded-lg border border-border p-3">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">تفاصيل ميدانية</p>
              <p className="text-sm leading-relaxed">{detail}</p>
            </div>
          )}

          {source && <p className="text-xs text-muted-foreground">{source}</p>}

          <div className="flex gap-2">
            <LinkButton
              href={`/donate?category=${need.categories?.slug ?? ""}`}
              size="lg"
              className="flex-1"
            >
              أريد توفير هذه الحاجة
            </LinkButton>
            <Button variant="outline" size="icon-lg" aria-label="مشاركة" onClick={() => void share()}>
              {copied ? <Check className="size-4 text-algeria-green" /> : <Share2 className="size-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
