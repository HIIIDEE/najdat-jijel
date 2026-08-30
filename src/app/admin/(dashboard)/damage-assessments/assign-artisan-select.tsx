"use client";

import { InlineSelect } from "@/components/admin/inline-select";
import { assignArtisanToAssessment } from "@/actions/damage-assessments";

export interface ArtisanCandidate {
  id: string;
  full_name: string;
  specialty: string;
  distanceLabel: string;
}

export function AssignArtisanSelect({
  assessmentId,
  currentArtisanId,
  candidates,
}: {
  assessmentId: string;
  currentArtisanId: string | null;
  candidates: ArtisanCandidate[];
}) {
  return (
    <InlineSelect
      className="w-full sm:w-64"
      value={currentArtisanId ?? "none"}
      options={[
        { value: "none", label: "بدون إسناد" },
        ...candidates.map((c) => ({
          value: c.id,
          label: `${c.full_name} — ${c.specialty} (${c.distanceLabel})`,
        })),
      ]}
      onChange={(v) => assignArtisanToAssessment(assessmentId, v === "none" ? null : v)}
    />
  );
}
