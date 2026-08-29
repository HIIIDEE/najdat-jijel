"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { roleLabels, type AppRole } from "@/lib/constants";
import { updateUserRole } from "@/actions/users";

export function UserRoleSelect({ id, role }: { id: string; role: AppRole }) {
  return (
    <InlineSelect
      value={role}
      options={Object.entries(roleLabels).map(([value, label]) => ({ value, label }))}
      onChange={(v) => updateUserRole(id, v as AppRole)}
    />
  );
}
