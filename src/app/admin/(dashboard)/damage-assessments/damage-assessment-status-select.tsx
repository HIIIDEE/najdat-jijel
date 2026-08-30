"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { damageAssessmentStatusLabels, type DamageAssessmentStatus } from "@/lib/constants";
import { updateDamageAssessmentStatus } from "@/actions/damage-assessments";

export function DamageAssessmentStatusSelect({
  id,
  status,
}: {
  id: string;
  status: DamageAssessmentStatus;
}) {
  return (
    <InlineSelect
      value={status}
      options={Object.entries(damageAssessmentStatusLabels).map(([value, label]) => ({
        value,
        label,
      }))}
      onChange={(v) => updateDamageAssessmentStatus(id, v as DamageAssessmentStatus)}
    />
  );
}
