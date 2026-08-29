"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function InlineSelect({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => Promise<{ success: boolean; error?: string }>;
  className?: string;
}) {
  const [current, setCurrent] = useState(value);
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={current}
      onValueChange={(v: string | null) => {
        if (!v || v === current) return;
        const previous = current;
        setCurrent(v);
        startTransition(async () => {
          const res = await onChange(v);
          if (!res.success) {
            setCurrent(previous);
            toast.error(res.error ?? "حدث خطأ أثناء التحديث");
          }
        });
      }}
    >
      <SelectTrigger className={cn("h-8 text-xs", className)} disabled={pending}>
        <SelectValue>{(val: string) => options.find((o) => o.value === val)?.label ?? val}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
