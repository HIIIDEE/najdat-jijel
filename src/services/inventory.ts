import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type InventoryTxnType = Database["public"]["Enums"]["inventory_txn_type"];
type UnitType = Database["public"]["Enums"]["unit_type"];

export interface UpdateInventoryInput {
  hubId: string;
  categoryId: string;
  type: InventoryTxnType;
  quantity: number;
  unit: UnitType;
  performedBy?: string;
  sourceHubId?: string;
  destinationHubId?: string;
  note?: string;
}

/**
 * updateInventory
 * يسجّل حركة مخزون واحدة (وارد / صادر / تسوية / نقل بين مراكز).
 * التعديل الفعلي على أرصدة المخزون (inventory_items) يتم تلقائيًا عبر trigger في قاعدة البيانات،
 * وكذلك توليد/إغلاق أي "احتياج تلقائي" عند تجاوز الحد الأدنى — لا حاجة لتكرار هذا المنطق هنا.
 */
export async function updateInventory(
  supabase: SupabaseClient<Database>,
  input: UpdateInventoryInput,
) {
  return supabase.from("inventory_transactions").insert({
    hub_id: input.hubId,
    category_id: input.categoryId,
    type: input.type,
    quantity: input.quantity,
    unit: input.unit,
    performed_by: input.performedBy,
    source_hub_id: input.sourceHubId,
    destination_hub_id: input.destinationHubId,
    note: input.note,
  });
}
