"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { priorityLabels, categoryEmoji } from "@/lib/constants";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];

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

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Select
        defaultValue={searchParams.get("category") ?? "all"}
        onValueChange={(v) => setParam("category", v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="النوع">
            {(value: string) => {
              if (value === "all") return "كل الأنواع";
              const c = categories.find((cat) => cat.slug === value);
              return c ? `${categoryEmoji[c.slug] ?? "📦"} ${c.name_ar}` : "النوع";
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الأنواع</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.slug}>
              {categoryEmoji[c.slug] ?? "📦"} {c.name_ar}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("commune") ?? "all"}
        onValueChange={(v) => setParam("commune", v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="البلدية" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل البلديات</SelectItem>
          {communes.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("priority") ?? "all"}
        onValueChange={(v) => setParam("priority", v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="الأولوية">
            {(value: string) =>
              value === "all"
                ? "كل الأولويات"
                : (priorityLabels[value as keyof typeof priorityLabels] ?? "الأولوية")
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الأولويات</SelectItem>
          {Object.entries(priorityLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
