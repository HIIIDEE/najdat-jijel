"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roleLabels } from "@/lib/constants";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const columns: { header: string; value: (r: ProfileRow) => string | number }[] = [
  { header: "الاسم الكامل", value: (r) => r.full_name ?? "" },
  { header: "الهاتف", value: (r) => r.phone ?? "" },
  { header: "الدور", value: (r) => roleLabels[r.role] },
  { header: "الولاية", value: (r) => r.wilaya ?? "" },
  { header: "تاريخ الانضمام", value: (r) => new Date(r.created_at).toLocaleString("ar-DZ") },
];

function toCsvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function buildCsv(rows: ProfileRow[]): string {
  const header = columns.map((c) => toCsvCell(c.header)).join(",");
  const lines = rows.map((r) => columns.map((c) => toCsvCell(c.value(r))).join(","));
  // BOM so Excel opens the Arabic text as UTF-8 instead of mangling it.
  return "﻿" + [header, ...lines].join("\r\n");
}

export function ExportUsersCsvButton({ rows }: { rows: ProfileRow[] }) {
  const handleExport = () => {
    const csv = buildCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
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
