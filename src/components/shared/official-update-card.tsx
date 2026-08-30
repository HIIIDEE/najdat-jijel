"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  ShieldCheck,
  Truck,
  CloudAlert,
  Megaphone,
  ExternalLink,
  Share2,
  Check,
  Radio,
  Building2,
  Trees,
  ShieldAlert,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { relativeTimeAr } from "@/lib/constants";

export interface OfficialUpdateItem {
  id?: string;
  title: string;
  body?: string | null;
  source: string;
  url?: string | null;
  update_type?: string;
  published_at: string;
}

const authorityStyles: Record<
  string,
  {
    name: string;
    icon: typeof Flame;
    badgeBg: string;
    border: string;
    accentGlow: string;
  }
> = {
  protection_civile_jijel: {
    name: "الحماية المدنية - جيجل",
    icon: Flame,
    badgeBg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    border: "border-red-500/30 hover:border-red-500/60",
    accentGlow: "from-red-500/[0.04]",
  },
  protection_civile: {
    name: "الحماية المدنية (الوطنية)",
    icon: Flame,
    badgeBg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    border: "border-red-500/30 hover:border-red-500/60",
    accentGlow: "from-red-500/[0.04]",
  },
  gendarmerie: {
    name: "الدرك الوطني / طريقي",
    icon: Truck,
    badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    border: "border-emerald-500/30 hover:border-emerald-500/60",
    accentGlow: "from-emerald-500/[0.04]",
  },
  forets: {
    name: "محافظة الغابات",
    icon: Trees,
    badgeBg: "bg-green-600/10 text-green-800 dark:text-green-300 border-green-600/20",
    border: "border-green-600/30 hover:border-green-600/60",
    accentGlow: "from-green-600/[0.04]",
  },
  police: {
    name: "الأمن الوطني",
    icon: ShieldAlert,
    badgeBg: "bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-600/20",
    border: "border-blue-600/30 hover:border-blue-600/60",
    accentGlow: "from-blue-600/[0.04]",
  },
  wilaya: {
    name: "خلية الأزمة الولائية",
    icon: Building2,
    badgeBg: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20",
    border: "border-amber-500/30 hover:border-amber-500/60",
    accentGlow: "from-amber-500/[0.04]",
  },
};

const categoryTags: Record<string, { label: string; icon: typeof Flame; style: string }> = {
  fire_alert: {
    label: "بلاغ حرائق وإخماد",
    icon: Flame,
    style: "bg-priority-critical/15 text-priority-critical border-priority-critical/30",
  },
  road_status: {
    label: "حالة الطرقات والمعابر",
    icon: Truck,
    style: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  weather_warning: {
    label: "إنذار جوي ونشرية خاصة",
    icon: CloudAlert,
    style: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
  },
  safety_guidelines: {
    label: "توجيهات السلامة والإجلاء",
    icon: Megaphone,
    style: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
  },
  statement: {
    label: "بيان رسمي موثّق",
    icon: ShieldCheck,
    style: "bg-algeria-green/15 text-algeria-green border-algeria-green/30",
  },
  news: {
    label: "خبر ميداني",
    icon: Radio,
    style: "bg-secondary text-secondary-foreground border-border",
  },
};

function inferAuthority(sourceName: string, titleText = ""): string {
  const s = `${sourceName} ${titleText}`.toLowerCase();
  if (s.includes("0018") || (s.includes("حماية") && s.includes("جيجل"))) return "protection_civile_jijel";
  if (s.includes("حماية") || s.includes("civile")) return "protection_civile";
  if (s.includes("درك") || s.includes("طريقي") || s.includes("gendarmerie")) return "gendarmerie";
  if (s.includes("غابات") || s.includes("foret")) return "forets";
  if (s.includes("أمن") || s.includes("police")) return "police";
  return "wilaya";
}

function inferWilaya(text: string): string | null {
  if (text.includes("جيجل") || text.includes("العوانة") || text.includes("الميلية") || text.includes("زيامة")) return "ولاية جيجل";
  if (text.includes("بجاية") || text.includes("تيشي") || text.includes("أوقاس")) return "ولاية بجاية";
  if (text.includes("سكيكدة") || text.includes("القل")) return "ولاية سكيكدة";
  if (text.includes("ميلة") || text.includes("فرجيوة")) return "ولاية ميلة";
  return null;
}

export function OfficialUpdateCard({ update }: { update: OfficialUpdateItem }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = `${update.title} ${update.body || ""}`;
  const authorityKey = inferAuthority(update.source || "", update.title);
  const auth = authorityStyles[authorityKey] || authorityStyles.wilaya;
  const AuthIcon = auth.icon;
  const tag = categoryTags[update.update_type || "statement"] || categoryTags.statement;
  const TagIcon = tag.icon;
  const wilaya = inferWilaya(fullText);

  const isUrgent =
    update.title.includes("عاجل") ||
    update.title.includes("إنذار") ||
    update.update_type === "fire_alert";

  const handleShare = async () => {
    const textToShare = `🚨 *${update.title}*\n\n${update.body || ""}\n\n🏛️ المصدر: ${update.source}\n🔗 منصة هبة الجزائر: https://habadz.life`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: update.title,
          text: textToShare,
          url: update.url || window.location.href,
        });
        return;
      } catch {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignored
    }
  };

  const isBodyLong = (update.body?.length || 0) > 180;

  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md bg-gradient-to-b ${auth.accentGlow} to-card ${
        isUrgent
          ? "border-priority-critical/40 ring-1 ring-priority-critical/10"
          : auth.border
      }`}
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-border/50">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Authority Badge */}
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${auth.badgeBg}`}>
              <AuthIcon className="size-3.5" />
              <span>{auth.name}</span>
              <ShieldCheck className="size-3 text-algeria-green" />
            </span>

            {/* Category Tag */}
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tag.style}`}>
              <TagIcon className="size-3" />
              <span>{tag.label}</span>
            </span>

            {/* Wilaya Tag */}
            {wilaya && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-bold text-secondary-foreground border border-border/50">
                <MapPin className="size-3 text-algeria-green" />
                <span>{wilaya}</span>
              </span>
            )}

            {isUrgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-priority-critical px-2 py-0.5 text-[10px] font-bold text-white shadow-xs animate-pulse">
                عاجل
              </span>
            )}
          </div>

          <time dateTime={update.published_at} className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {relativeTimeAr(update.published_at)}
          </time>
        </div>

        {/* Title (Clickable link to full view) */}
        <h3 className="mt-3.5 text-base sm:text-lg font-extrabold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
          {update.id ? (
            <Link href={`/official-information/${update.id}`} className="hover:underline">
              {update.title}
            </Link>
          ) : (
            update.title
          )}
        </h3>

        {/* Body Text with Expand/Collapse */}
        {update.body && (
          <div className="mt-2.5">
            <p
              className={`text-xs sm:text-sm leading-relaxed text-muted-foreground whitespace-pre-line transition-all ${
                isExpanded ? "" : "line-clamp-3"
              }`}
            >
              {update.body}
            </p>

            {isBodyLong && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                <span>{isExpanded ? "عرض أقل" : "قراءة كامل البلاغ"}</span>
                {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions & Source Link */}
      <div className="mt-5 pt-3.5 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground/70">المصدر:</span>
          <strong className="text-foreground truncate max-w-[200px]">{update.source}</strong>
        </span>

        <div className="flex items-center gap-2">
          {/* Read Full Detail Page */}
          {update.id && (
            <Link
              href={`/official-information/${update.id}`}
              className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-secondary/60 px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-secondary transition-colors"
            >
              <FileText className="size-3.5 text-algeria-green" />
              <span className="hidden sm:inline">تفاصيل البيان</span>
            </Link>
          )}

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-secondary/60 px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer"
            title="مشاركة البلاغ الموثق"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-algeria-green" />
                <span className="text-algeria-green">تم النسخ</span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5" />
                <span>مشاركة</span>
              </>
            )}
          </button>

          {/* External Source Link */}
          {update.url && (
            <a
              href={update.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
            >
              <span>المنشور الأصلي</span>
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
