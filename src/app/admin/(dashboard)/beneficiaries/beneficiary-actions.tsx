"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import {
  priorityLabels,
  requestStatusLabels,
  verificationLabels,
  type PriorityLevel,
  type RequestStatus,
  type VerificationLevel,
} from "@/lib/constants";
import {
  updateBeneficiaryPriority,
  updateBeneficiaryStatus,
  updateBeneficiaryVerification,
} from "@/actions/beneficiaries";

export function BeneficiaryActions({
  id,
  status,
  priority,
  verificationLevel,
}: {
  id: string;
  status: RequestStatus;
  priority: PriorityLevel;
  verificationLevel: VerificationLevel;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <InlineSelect
        value={verificationLevel}
        options={Object.entries(verificationLabels).map(([value, label]) => ({ value, label }))}
        onChange={(v) => updateBeneficiaryVerification(id, v as VerificationLevel)}
      />
      <InlineSelect
        value={priority}
        options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))}
        onChange={(v) => updateBeneficiaryPriority(id, v as PriorityLevel)}
      />
      <InlineSelect
        value={status}
        options={Object.entries(requestStatusLabels).map(([value, label]) => ({ value, label }))}
        onChange={(v) => updateBeneficiaryStatus(id, v as RequestStatus)}
      />
    </div>
  );
}
