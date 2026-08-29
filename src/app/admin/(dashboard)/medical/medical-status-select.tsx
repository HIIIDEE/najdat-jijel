"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { medicalVerificationStatusLabels, type MedicalVerificationStatus } from "@/lib/constants";
import { updateMedicalVolunteerStatus } from "@/actions/medical";

export function MedicalStatusSelect({
  id,
  status,
}: {
  id: string;
  status: MedicalVerificationStatus;
}) {
  return (
    <InlineSelect
      value={status}
      options={Object.entries(medicalVerificationStatusLabels).map(([value, label]) => ({
        value,
        label,
      }))}
      onChange={(v) => updateMedicalVolunteerStatus(id, v as MedicalVerificationStatus)}
    />
  );
}
