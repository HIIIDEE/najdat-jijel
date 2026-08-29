import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type VerificationLevel = Database["public"]["Enums"]["verification_level"];

export type VerifiableEntity =
  | "beneficiary_request"
  | "collection_point"
  | "relief_hub"
  | "need"
  | "organization";

const tableByEntity: Record<VerifiableEntity, string> = {
  beneficiary_request: "beneficiary_requests",
  collection_point: "collection_points",
  relief_hub: "relief_hubs",
  need: "needs",
  organization: "organizations",
};

export interface VerifySubmissionInput {
  entityType: VerifiableEntity;
  entityId: string;
  level: VerificationLevel;
  verifiedBy: string;
  note?: string;
}

/**
 * verifySubmission
 * يحدّث مستوى التحقق لأي عنصر (طلب مساعدة، نقطة تجميع، مركز استقبال، احتياج، جمعية)
 * ويسجّل العملية في سجل التحقق verification_records للمساءلة والتدقيق.
 */
export async function verifySubmission(
  supabase: SupabaseClient<Database>,
  input: VerifySubmissionInput,
) {
  const table = tableByEntity[input.entityType];

  const { error: updateError } = await supabase
    .from(table as "beneficiary_requests")
    .update({
      verification_level: input.level,
      verified_by: input.verifiedBy,
      verified_at: new Date().toISOString(),
    })
    .eq("id", input.entityId);

  if (updateError) return { error: updateError };

  return supabase.from("verification_records").insert({
    entity_type: input.entityType,
    entity_id: input.entityId,
    level: input.level,
    verified_by: input.verifiedBy,
    note: input.note,
  });
}
