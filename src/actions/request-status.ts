"use server";

import { createClient } from "@/lib/supabase/server";
import {
  requestStatusLookupSchema,
  type RequestStatusLookupInput,
} from "@/schemas/request-status";
import type { Database } from "@/types/database";

export type RequestStatus = Database["public"]["Enums"]["request_status"];

export interface LookupRequestStatusResult {
  success: boolean;
  /** المرجع ورقم الهاتف لا يتطابقان مع أي طلب — ليس خطأ تقنيًا. */
  notFound?: boolean;
  error?: string;
  request?: {
    reference: string;
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * حالة طلب مساعدة، بالمرجع ورقم الهاتف معًا.
 *
 * تمرّ عبر دالة `security definer` لأن الزائر لا يقرأ جدول الطلبات، والدالة
 * لا ترجع إلا الحالة والتاريخين — لا اسم ولا عنوان ولا احتياجات.
 */
export async function lookupRequestStatus(
  input: RequestStatusLookupInput,
): Promise<LookupRequestStatusResult> {
  const parsed = requestStatusLookupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "الرجاء التحقق من الحقول المدخلة." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_beneficiary_request_status", {
    // يُمرَّر كما كتبه المستخدم: الدالة تطبّع المُعامل بنفسها، وهي المرجع
    // الوحيد في المقارنة لأن الـ RPC مفتوحة لأي نداء لا لهذا النموذج وحده.
    p_reference: parsed.data.reference,
    p_phone: parsed.data.phone,
  });

  if (error) {
    return { success: false, error: "تعذّر الاستعلام الآن. حاول مرة أخرى بعد قليل." };
  }

  const row = data?.[0];
  if (!row) return { success: false, notFound: true };

  return {
    success: true,
    request: {
      reference: row.reference,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  };
}
