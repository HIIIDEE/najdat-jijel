"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryEmoji, priorityLabels, priorityEmoji } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-all",
        active
          ? "border-algeria-green bg-algeria-green text-algeria-green-foreground font-semibold"
          : "border-border bg-card hover:border-algeria-green/50 hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

export function NeedsFilters({
  categories,
  communes,
}: {
  categories: Category[];
  communes: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = {
    category: searchParams.get("category"),
    commune: searchParams.get("commune"),
    priority: searchParams.get("priority"),
  };
  const hasFilters = Boolean(current.category || current.commune || current.priority);

  function toggle(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    router.push(params.toString() ? `${pathname}?${params}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">الأولوية</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(priorityLabels).map(([value, label]) => (
            <Chip
              key={value}
              active={current.priority === value}
              onClick={() => toggle("priority", value)}
            >
              {priorityEmoji[value as keyof typeof priorityEmoji]} {label}
            </Chip>
          ))}
        </div>
      </div>

      {communes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">البلدية</p>
          <div className="flex flex-wrap gap-2">
            {communes.map((c) => (
              <Chip key={c} active={current.commune === c} onClick={() => toggle("commune", c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">نوع المادة</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip
              key={c.id}
              active={current.category === c.slug}
              onClick={() => toggle("category", c.slug)}
            >
              {categoryEmoji[c.slug] ?? "📦"} {c.name_ar}
            </Chip>
          ))}
        </div>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname, { scroll: false })}>
          <X className="size-4" /> مسح كل الفلاتر
        </Button>
      )}
    </div>
  );
}
