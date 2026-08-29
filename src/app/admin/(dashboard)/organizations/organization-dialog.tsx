"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wilayaNames } from "@/lib/wilayas";
import { createOrganization, updateOrganization, type OrganizationInput } from "@/actions/organizations";
import type { Database } from "@/types/database";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  org_type: z.string().optional(),
  contact_name: z.string().optional(),
  phone: z.string().optional(),
  wilaya: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

function toDefaults(org?: Organization): FormValues {
  return {
    name: org?.name ?? "",
    org_type: org?.org_type ?? "",
    contact_name: org?.contact_name ?? "",
    phone: org?.phone ?? "",
    wilaya: org?.wilaya ?? "",
  };
}

export function OrganizationDialog({ organization }: { organization?: Organization }) {
  const isEdit = Boolean(organization);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toDefaults(organization),
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const input: OrganizationInput = values;
    const res = isEdit
      ? await updateOrganization(organization!.id, input)
      : await createOrganization(input);
    setSubmitting(false);
    if (!res.success) {
      toast.error(res.error ?? "حدث خطأ");
      return;
    }
    toast.success(isEdit ? "تم تحديث بيانات الجمعية" : "تمت إضافة الجمعية بنجاح");
    if (!isEdit) reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) reset(toDefaults(organization));
      }}
    >
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon-sm" aria-label="تعديل بيانات الجمعية">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" /> إضافة جمعية
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "تعديل بيانات الجمعية" : "إضافة جمعية موثقة"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-1.5">اسم الجمعية</Label>
            <Input {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <Label className="mb-1.5">نوع الجمعية (اختياري)</Label>
            <Input placeholder="جمعية خيرية، مؤسسة، تعاونية..." {...register("org_type")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5">اسم المسؤول (اختياري)</Label>
              <Input {...register("contact_name")} />
            </div>
            <div>
              <Label className="mb-1.5">الهاتف (اختياري)</Label>
              <Input dir="ltr" {...register("phone")} />
            </div>
          </div>

          <div>
            <Label className="mb-1.5">الولاية (اختياري)</Label>
            <Select
              value={watch("wilaya") || undefined}
              onValueChange={(v: string | null) => setValue("wilaya", v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {wilayaNames.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
