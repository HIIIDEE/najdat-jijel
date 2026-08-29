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
import { deleteOrganization } from "@/actions/organizations";

export function DeleteOrganizationButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <>
      <Button variant="ghost" size="icon-sm" aria-label="حذف الجمعية" onClick={() => setOpen(true)}>
        <Trash2 className="size-4 text-destructive" />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف جمعية {name}؟</AlertDialogTitle>
            <AlertDialogDescription>سيُحذف سجل الجمعية نهائيًا. لا يمكن التراجع.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpen(false);
                startTransition(async () => {
                  const res = await deleteOrganization(id);
                  if (!res.success) toast.error(res.error ?? "حدث خطأ");
                  else toast.success("تم حذف الجمعية");
                });
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
