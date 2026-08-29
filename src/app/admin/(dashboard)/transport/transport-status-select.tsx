"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { transportStatusLabels, type TransportStatus } from "@/lib/constants";
import { updateTransportOfferStatus } from "@/actions/transport-admin";

export function TransportStatusSelect({ id, status }: { id: string; status: TransportStatus }) {
  return (
    <InlineSelect
      value={status}
      options={Object.entries(transportStatusLabels).map(([value, label]) => ({ value, label }))}
      onChange={(v) => updateTransportOfferStatus(id, v as TransportStatus)}
    />
  );
}
