"use client";

import { useState } from "react";
import { Phone, TriangleAlert } from "lucide-react";
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
import type { AvailableLocale } from "@/i18n/locales";

export function EmergencyFab({ locale = "ar" }: { locale?: AvailableLocale }) {
  const [open, setOpen] = useState(false);
  const isFr = locale === "fr";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={isFr ? "Numéros d'urgence" : "أرقام الطوارئ"}
        className={cn(
          "fixed bottom-20 start-4 z-50 flex items-center gap-2 rounded-full bg-priority-critical px-4 py-3",
          "text-sm font-bold text-white shadow-lg shadow-priority-critical/30",
          "transition-transform hover:scale-105 active:scale-95 md:bottom-6",
        )}
      >
        <TriangleAlert className="size-5" />
        <span className="hidden sm:inline">{isFr ? "Urgences" : "طوارئ"}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="size-5 text-priority-critical" />
              {isFr ? "Numéros d'urgence" : "أرقام الطوارئ"}
            </DialogTitle>
            <DialogDescription>
              {isFr
                ? "Numéros officiels gratuits accessibles 24h/24 et 7j/7 sur tout le territoire national."
                : "أرقام رسمية مجانية تعمل على مدار الساعة في كامل التراب الوطني."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            {emergencyContacts.map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-border p-3 transition-colors hover:border-priority-critical/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-priority-critical/10 text-priority-critical">
                      <c.icon className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-medium leading-tight">{c.label}</span>
                      {c.hint && (
                        <span className="block text-xs text-muted-foreground">{c.hint}</span>
                      )}
                    </span>
                  </span>
                  <a
                    href={`tel:${c.number}`}
                    className="flex items-center gap-1.5 rounded-lg bg-priority-critical px-3 py-1.5 text-sm font-bold tabular-nums text-white"
                  >
                    <Phone className="size-3.5" />
                    {c.number}
                  </a>
                </div>
                {c.greenNumber && (
                  <a
                    href={`tel:${c.greenNumber}`}
                    className="mt-2 flex items-center justify-between rounded-lg bg-algeria-green/10 px-3 py-1.5 text-xs font-semibold text-algeria-green"
                  >
                    <span>{isFr ? "Numéro vert" : "الرقم الأخضر"}</span>
                    <span className="tabular-nums">{c.greenNumber}</span>
                  </a>
                )}
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
            {isFr ? "Fermer" : "إغلاق"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
