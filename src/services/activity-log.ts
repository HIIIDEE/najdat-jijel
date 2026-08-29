import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/types/database";

export interface LogActivityInput {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  before?: Json;
  after?: Json;
}

/**
 * logActivity
 * يسجّل عملية إدارية مهمة (من عدّلها، متى، وماذا تغيّر) في سجل التدقيق activity_logs.
 */
export async function logActivity(supabase: SupabaseClient<Database>, input: LogActivityInput) {
  return supabase.from("activity_logs").insert({
    actor_id: input.actorId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId,
    before: input.before,
    after: input.after,
  });
}
