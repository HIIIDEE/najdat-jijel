"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { severityLabels, type AffectedSeverity } from "@/lib/constants";
import { updateAreaSeverity } from "@/actions/affected-areas";

export function SeveritySelect({ id, severity }: { id: string; severity: AffectedSeverity }) {
  return (
    <InlineSelect
      value={severity}
      options={Object.entries(severityLabels).map(([value, label]) => ({ value, label }))}
      onChange={(v) => updateAreaSeverity(id, v as AffectedSeverity)}
      className="w-40"
    />
  );
}
