"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { pointStatusLabels, verificationLabels, type PointStatus, type VerificationLevel } from "@/lib/constants";
import { updateReliefHubStatus, updateReliefHubVerification } from "@/actions/points";

export function HubActions({
  id,
  status,
  verificationLevel,
}: {
  id: string;
  status: PointStatus;
  verificationLevel: VerificationLevel;
}) {
  return (
    <div className="flex items-center gap-2">
      <InlineSelect
        value={verificationLevel}
        options={Object.entries(verificationLabels).map(([value, label]) => ({ value, label }))}
        onChange={(v) => updateReliefHubVerification(id, v as VerificationLevel)}
      />
      <InlineSelect
        value={status}
        options={Object.entries(pointStatusLabels).map(([value, label]) => ({ value, label }))}
        onChange={(v) => updateReliefHubStatus(id, v as PointStatus)}
      />
    </div>
  );
}
