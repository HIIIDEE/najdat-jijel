import { Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

/**
 * شريط الأخبار العاجلة — خلفية حمراء وخط أبيض، يديره الطاقم من لوحة الإدارة.
 * إن لم توجد رسائل مفعّلة يظهر التنبيه الثابت الافتراضي.
 */
export async function NewsTicker() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("id, message")
    .eq("is_active", true)
    .order("sort_order")
    .order("created_at", { ascending: false });

  const messages = data ?? [];

  if (messages.length === 0) {
    return (
      <div className="bg-priority-critical text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm font-medium">
          <Megaphone className="size-4 shrink-0" />
          <p>
            <strong>تنبيه هام:</strong> يُرجى التنسيق المسبق مع نقاط التجميع ومراكز الإيواء قبل توجيه القوافل لضمان وصول المساعدات مباشرة للمتضررين.
          </p>
        </div>
      </div>
    );
  }

  // مدة الحركة تتناسب مع طول النص حتى تبقى سرعة القراءة ثابتة
  const totalChars = messages.reduce((n, m) => n + m.message.length, 0);
  const duration = Math.max(25, Math.min(120, Math.round(totalChars / 4)));

  return (
    <div className="bg-priority-critical text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2">
        <span className="flex shrink-0 items-center gap-1.5 text-xs sm:text-sm font-bold">
          <Megaphone className="size-4 animate-pulse" />
          <span className="hidden sm:inline">عاجل</span>
        </span>

        <div className="ticker-viewport relative flex-1 overflow-hidden">
          <div
            className="animate-ticker whitespace-nowrap text-xs sm:text-sm text-center"
            style={{ "--ticker-duration": `${duration}s` } as React.CSSProperties}
          >
            {messages.map((m, i) => (
              <span key={m.id}>
                {i > 0 && <span className="mx-4 opacity-60">•</span>}
                {m.message}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* نسخة ثابتة لقارئات الشاشة ولمن عطّل الحركة */}
      <div className="sr-only">
        {messages.map((m) => (
          <p key={m.id}>{m.message}</p>
        ))}
      </div>
    </div>
  );
}
