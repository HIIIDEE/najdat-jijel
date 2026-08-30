"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { artisanVerificationStatusLabels, type ArtisanVerificationStatus } from "@/lib/constants";
import { updateArtisanVolunteerStatus } from "@/actions/artisans";

export function ArtisanStatusSelect({
  id,
  status,
}: {
  id: string;
  status: ArtisanVerificationStatus;
}) {
  return (
    <InlineSelect
      value={status}
      options={Object.entries(artisanVerificationStatusLabels).map(([value, label]) => ({
        value,
        label,
      }))}
      onChange={(v) => updateArtisanVolunteerStatus(id, v as ArtisanVerificationStatus)}
    />
  );
}
