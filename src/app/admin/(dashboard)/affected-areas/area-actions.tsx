"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteAffectedArea } from "@/actions/affected-areas";

export function AreaActions({ id, spot }: { id: string; spot: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="حذف"
        onClick={() => setOpen(true)}
        className="text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المنطقة المتضررة؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف &quot;{spot}&quot; نهائياً من سجل المناطق المتضررة. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await deleteAffectedArea(id);
                  if (!res.success) {
                    toast.error(res.error ?? "حدث خطأ");
                  } else {
                    toast.success("تم حذف المنطقة");
                  }
                });
              }}
            >
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
