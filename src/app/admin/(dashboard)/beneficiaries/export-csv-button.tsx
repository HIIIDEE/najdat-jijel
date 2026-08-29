"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { needCategoryOptions } from "@/schemas/beneficiary-request";
import { priorityLabels, requestStatusLabels, verificationLabels } from "@/lib/constants";
import type { Database } from "@/types/database";

type BeneficiaryRow = Database["public"]["Tables"]["beneficiary_requests"]["Row"];

const columns: { header: string; value: (r: BeneficiaryRow) => string | number }[] = [
  { header: "الاسم الكامل", value: (r) => r.full_name },
  { header: "الهاتف", value: (r) => r.phone },
  { header: "الولاية", value: (r) => r.wilaya },
  { header: "البلدية", value: (r) => r.commune },
  { header: "عدد أفراد الأسرة", value: (r) => r.family_members_count },
  { header: "عدد الأطفال", value: (r) => r.children_count },
  {
    header: "الاحتياجات",
    value: (r) =>
      r.needed_categories
        .map((c) => needCategoryOptions.find((o) => o.value === c)?.label ?? c)
        .join(" / "),
  },
  { header: "الأولوية", value: (r) => priorityLabels[r.priority] },
  { header: "حالة التحقق", value: (r) => verificationLabels[r.verification_level] },
  { header: "حالة الطلب", value: (r) => requestStatusLabels[r.status] },
  {
    header: "السكن صالح؟",
    value: (r) => (r.is_housing_habitable === null ? "غير معروف" : r.is_housing_habitable ? "نعم" : "لا"),
  },
  { header: "توجد إصابات", value: (r) => (r.has_injuries ? "نعم" : "لا") },
  { header: "حاجة طبية", value: (r) => (r.needs_medical ? "نعم" : "لا") },
  { header: "تاريخ التسجيل", value: (r) => new Date(r.created_at).toLocaleString("ar-DZ") },
];

function toCsvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function buildCsv(rows: BeneficiaryRow[]): string {
  const header = columns.map((c) => toCsvCell(c.header)).join(",");
  const lines = rows.map((r) => columns.map((c) => toCsvCell(c.value(r))).join(","));
  // BOM so Excel opens the Arabic text as UTF-8 instead of mangling it.
  return "﻿" + [header, ...lines].join("\r\n");
}

export function ExportBeneficiariesCsvButton({ rows }: { rows: BeneficiaryRow[] }) {
  const handleExport = () => {
    const csv = buildCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beneficiaries-${new Date().toISOString().slice(0, 10)}.csv`;
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
