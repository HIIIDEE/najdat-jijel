"use client";

import { useState } from "react";
import { Phone, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { emergencyContacts } from "@/lib/emergency";
import { cn } from "@/lib/utils";

/**
 * زر طوارئ عائم متاح من كل صفحة.
 * أرقام رسمية مجانية — الضغط عليها يفتح تطبيق الهاتف مباشرة (tel:).
 */
export function EmergencyFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="أرقام الطوارئ"
        className={cn(
          "fixed bottom-20 start-4 z-50 flex items-center gap-2 rounded-full bg-priority-critical px-4 py-3",
          "text-sm font-bold text-white shadow-lg shadow-priority-critical/30",
          "transition-transform hover:scale-105 active:scale-95 md:bottom-6",
        )}
      >
        <TriangleAlert className="size-5" />
        <span className="hidden sm:inline">طوارئ</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="size-5 text-priority-critical" />
              أرقام الطوارئ
            </DialogTitle>
            <DialogDescription>
              أرقام رسمية مجانية تعمل على مدار الساعة في كامل التراب الوطني.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            {emergencyContacts.map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors hover:border-priority-critical hover:bg-priority-critical/5"
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <span className="font-medium">{c.label}</span>
                </span>
                <span className="flex items-center gap-2 font-bold tabular-nums text-priority-critical">
                  {c.number}
                  <Phone className="size-4" />
                </span>
              </a>
            ))}
          </div>

          <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
            <X className="size-4" /> إغلاق
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
