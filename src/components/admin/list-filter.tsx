"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

export interface AdminFilterOption {
  value: string;
  label: string;
}

export interface AdminFilterDef<T> {
  label: string;
  options: AdminFilterOption[];
  /** يُطابق الصف مع قيمة الفلتر المختارة — يُتجاهل إن كانت القيمة "الكل". */
  match: (row: T, value: string) => boolean;
}

/**
 * شريط بحث + فلاتر عامّ لأي قائمة إدارية — يعمل بالكامل في المتصفح على
 * الصفوف المُحمَّلة مسبقًا (نفس نمط "اجلب كل شيء دون Pagination" المتّبع في
 * كل صفحات لوحة الإدارة)، فلا حاجة لأي طلب شبكة إضافي عند الكتابة أو التصفية.
 */
export function AdminListFilter<T>({
  rows,
  searchPlaceholder,
  searchMatch,
  filters = [],
  renderRow,
  emptyTitle,
  noResultsTitle = "لا توجد نتائج مطابقة",
}: {
  rows: T[];
  searchPlaceholder: string;
  /** يُطابق الصف مع نص البحث (بعد تحويله lowercase) — أعد true إذا طابق أي حقل مهم. */
  searchMatch: (row: T, query: string) => boolean;
  filters?: AdminFilterDef<T>[];
  renderRow: (row: T) => React.ReactNode;
  emptyTitle: string;
  noResultsTitle?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<number, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (q && !searchMatch(row, q)) return false;
      for (const [idx, value] of Object.entries(activeFilters)) {
        if (value === "الكل" || !value) continue;
        const def = filters[Number(idx)];
        if (def && !def.match(row, value)) return false;
      }
      return true;
    });
  }, [rows, query, activeFilters, searchMatch, filters]);

  const hasActiveFilters = query.trim() !== "" || Object.values(activeFilters).some((v) => v && v !== "الكل");

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 ps-8"
          />
        </div>
        {filters.map((def, idx) => (
          <div key={def.label} className="flex flex-wrap gap-1.5">
            {["الكل", ...def.options.map((o) => o.value)].map((value) => {
              const label = value === "الكل" ? `${def.label}: الكل` : def.options.find((o) => o.value === value)?.label ?? value;
              const active = (activeFilters[idx] ?? "الكل") === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveFilters((prev) => ({ ...prev, [idx]: value }))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-algeria-green bg-algeria-green/10 text-algeria-green"
                      : "border-border bg-card text-muted-foreground hover:border-algeria-green/50 hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ))}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveFilters({});
            }}
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" /> مسح الفلاتر
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        عرض <strong className="text-foreground">{filtered.length}</strong> من أصل {rows.length}
      </p>

      {filtered.length === 0 ? (
        <EmptyState title={noResultsTitle} />
      ) : (
        <div className="space-y-3">{filtered.map(renderRow)}</div>
      )}
    </div>
  );
}
