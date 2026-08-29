"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { donationStatusLabels, type DonationStatus } from "@/lib/constants";
import { updateDonationStatus } from "@/actions/donations-admin";

export function DonationStatusSelect({ id, status }: { id: string; status: DonationStatus }) {
  return (
    <InlineSelect
      value={status}
      options={Object.entries(donationStatusLabels).map(([value, label]) => ({ value, label }))}
      onChange={(v) => updateDonationStatus(id, v as DonationStatus)}
    />
  );
}
