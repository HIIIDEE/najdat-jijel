import { TriangleAlert } from "lucide-react";

export function EmergencyBanner() {
  return (
    <div className="bg-priority-critical text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 text-sm">
        <TriangleAlert className="size-4 shrink-0" />
        <p>
          <strong>قبل إرسال أي مساعدات:</strong> تحقق من الاحتياجات الحالية ونقاط الاستقبال. لا
          ترسل مساعدات عشوائيًا حتى لا تتكدس المواد في نقطة واحدة.
        </p>
      </div>
    </div>
  );
}
