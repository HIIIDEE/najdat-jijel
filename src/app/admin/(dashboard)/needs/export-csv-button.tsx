"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  priorityLabels,
  needStatusLabels,
  verificationLabels,
  unitLabels,
} from "@/lib/constants";
import type { Database } from "@/types/database";

type NeedRow = Database["public"]["Tables"]["needs"]["Row"] & {
  categories: { slug: string; name_ar: string } | null;
};

const columns: { header: string; value: (n: NeedRow) => string | number }[] = [
  { header: "العنوان", value: (n) => n.title || n.categories?.name_ar || "" },
  { header: "الفئة", value: (n) => n.categories?.name_ar ?? "" },
  { header: "الولاية", value: (n) => n.wilaya },
  { header: "البلدية", value: (n) => n.commune },
  { header: "الكمية المتوفرة", value: (n) => Number(n.quantity_available) },
  { header: "الكمية المطلوبة", value: (n) => Number(n.quantity_needed) },
  { header: "الوحدة", value: (n) => unitLabels[n.unit] },
  { header: "الأولوية", value: (n) => priorityLabels[n.priority] },
  { header: "الحالة", value: (n) => needStatusLabels[n.status] },
  { header: "توليد تلقائي", value: (n) => (n.is_auto_generated ? "نعم" : "لا") },
  { header: "حالة التحقق", value: (n) => verificationLabels[n.verification_level] },
  { header: "ملاحظات", value: (n) => n.notes ?? "" },
  { header: "تاريخ الإنشاء", value: (n) => new Date(n.created_at).toLocaleString("ar-DZ") },
];

function toCsvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function buildCsv(rows: NeedRow[]): string {
  const header = columns.map((c) => toCsvCell(c.header)).join(",");
  const lines = rows.map((r) => columns.map((c) => toCsvCell(c.value(r))).join(","));
  // BOM so Excel opens the Arabic text as UTF-8 instead of mangling it.
  return "﻿" + [header, ...lines].join("\r\n");
}

export function ExportNeedsCsvButton({ rows }: { rows: NeedRow[] }) {
  const handleExport = () => {
    const csv = buildCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `needs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={rows.length === 0}>
      <Download className="size-4" /> تصدير CSV
    </Button>
  );
}
