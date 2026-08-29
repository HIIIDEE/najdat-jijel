"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { updateMinThreshold } from "@/actions/inventory";

export function ThresholdInput({
  hubId,
  categoryId,
  defaultValue,
}: {
  hubId: string;
  categoryId: string;
  defaultValue: number;
}) {
  const [value, setValue] = useState(String(defaultValue));
  const [, startTransition] = useTransition();

  return (
    <Input
      type="number"
      min={0}
      className="h-7 w-24 text-xs"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        const num = Number(value);
        if (Number.isNaN(num) || num === defaultValue) return;
        startTransition(async () => {
          const res = await updateMinThreshold({ hub_id: hubId, category_id: categoryId, min_threshold: num });
          if (!res.success) toast.error(res.error ?? "حدث خطأ");
          else toast.success("تم تحديث الحد الأدنى");
        });
      }}
    />
  );
}
