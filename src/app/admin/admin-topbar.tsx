"use client";

import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AdminSidebarNav } from "@/components/layout/admin-sidebar";
import { signOut } from "@/actions/auth";
import { roleLabels, type AppRole } from "@/lib/constants";

export function AdminTopbar({
  fullName,
  role,
  counts,
}: {
  fullName: string | null;
  role: AppRole;
  counts?: Record<string, number>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="size-4" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-72 p-4">
            <SheetTitle className="mb-4 text-right">القائمة</SheetTitle>
            <AdminSidebarNav onNavigate={() => setOpen(false)} counts={counts} />
          </SheetContent>
        </Sheet>
        <p className="font-bold md:hidden">لوحة الإدارة</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-end sm:block">
          <p className="text-sm font-medium leading-tight">{fullName || "بدون اسم"}</p>
          <p className="text-xs text-muted-foreground leading-tight">{roleLabels[role]}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="icon" aria-label="تسجيل الخروج">
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
