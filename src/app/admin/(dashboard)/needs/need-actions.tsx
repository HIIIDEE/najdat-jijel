"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { needStatusLabels, priorityLabels, type NeedStatus, type PriorityLevel } from "@/lib/constants";
import { updateNeedPriority, updateNeedStatus } from "@/actions/needs";

export function NeedActions({
  id,
  priority,
  status,
}: {
  id: string;
  priority: PriorityLevel;
  status: NeedStatus;
}) {
  return (
    <div className="flex items-center gap-2">
      <InlineSelect
        value={priority}
        options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))}
        onChange={(v) => updateNeedPriority(id, v as PriorityLevel)}
      />
      <InlineSelect
        value={status}
        options={Object.entries(needStatusLabels).map(([value, label]) => ({ value, label }))}
        onChange={(v) => updateNeedStatus(id, v as NeedStatus)}
      />
    </div>
  );
}
