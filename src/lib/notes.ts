/**
 * حقول الملاحظات المستوردة تأتي بالصيغة: "تفاصيل ميدانية | مصدر البيانات: ..."
 * هذه الدالة تفصل الجزأين لعرضهما بشكل مناسب في الواجهة.
 */
export function splitNeedNotes(notes: string | null | undefined): {
  detail: string | null;
  source: string | null;
} {
  if (!notes) return { detail: null, source: null };
  const idx = notes.indexOf("مصدر البيانات:");
  if (idx === -1) return { detail: notes.trim(), source: null };
  const detail = notes.slice(0, idx).replace(/\s*\|\s*$/, "").trim();
  const source = notes.slice(idx).trim();
  return { detail: detail || null, source: source || null };
}
