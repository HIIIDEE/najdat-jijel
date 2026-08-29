import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type UnitType = Database["public"]["Enums"]["unit_type"];

export interface CreateDistributionInput {
  campaignId: string;
  hubId: string;
  categoryId: string;
  quantity: number;
  unit: UnitType;
  beneficiaryFamilyCount: number;
  distributionDate?: string;
  responsibleName: string;
  responsibleId?: string;
  proofFilePath?: string;
  notes?: string;
}

/**
 * createDistribution
 * يسجّل عملية توزيع ميدانية. يُنشئ تلقائيًا حركة صرف (out) من المخزون عبر trigger في قاعدة البيانات،
 * فتنخفض الكمية المتوفرة بالمركز فورًا دون الحاجة لتحديث يدوي مزدوج.
 */
export async function createDistribution(
  supabase: SupabaseClient<Database>,
  input: CreateDistributionInput,
) {
  return supabase
    .from("distributions")
    .insert({
      campaign_id: input.campaignId,
      hub_id: input.hubId,
      category_id: input.categoryId,
      quantity: input.quantity,
      unit: input.unit,
      beneficiary_family_count: input.beneficiaryFamilyCount,
      distribution_date: input.distributionDate,
      responsible_name: input.responsibleName,
      responsible_id: input.responsibleId,
      proof_file_path: input.proofFilePath,
      notes: input.notes,
    })
    .select()
    .single();
}
