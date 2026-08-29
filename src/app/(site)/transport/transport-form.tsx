"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EmptyState } from "@/components/shared/empty-state";
import { transportOfferSchema, vehicleOptions, type TransportOfferInput } from "@/schemas/transport-offer";
import { wilayaNames } from "@/lib/wilayas";
import { formatQuantity } from "@/lib/constants";
import { submitTransportOffer, type SubmitTransportResult } from "@/actions/transport";

export function TransportForm() {
  const [result, setResult] = useState<SubmitTransportResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransportOfferInput>({
    resolver: zodResolver(transportOfferSchema),
    defaultValues: {
      driver_name: "",
      phone: "",
      origin_wilaya: "",
      origin_note: "",
      destination_wilaya: "جيجل",
      destination_note: "",
      vehicle_type: "van",
      available_space_note: "",
      time_window: "",
      has_empty_space: true,
      notes: "",
    },
  });

  async function onSubmit(values: TransportOfferInput) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitTransportOffer(values);
      if (!res.success) {
        setSubmitError(res.error ?? "حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
        return;
      }
      setResult(res);
    } catch {
      setSubmitError("حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.success) {
    return (
      <div className="space-y-5">
        <Alert className="border-algeria-green/40 bg-algeria-green/5">
          <AlertTitle className="text-algeria-green">تم تسجيل عرض النقل بنجاح 🚚</AlertTitle>
          <AlertDescription>سيتواصل فريق التنسيق معك لتأكيد التفاصيل والمسار.</AlertDescription>
        </Alert>

        <h2 className="font-bold">مساعدات يمكن تحميلها على مسارك</h2>
        {!result.candidates || result.candidates.length === 0 ? (
          <EmptyState
            title="لا توجد حاليًا مساعدات تحتاج نقلًا على مسارك"
            description="سيتم تحديث القائمة باستمرار — يمكنك مراجعة لوحة الإشعارات لاحقًا."
          />
        ) : (
          <div className="space-y-3">
            {result.candidates.map((c) => (
              <Card key={c.donationId}>
                <CardContent className="flex items-center justify-between gap-3 px-5">
                  <div>
                    <p className="font-bold">{c.itemsSummary || "مساعدات متنوعة"}</p>
                    <p className="text-sm text-muted-foreground">من: {c.donorWilaya}</p>
                  </div>
                  {c.distanceKm !== null && (
                    <span className="shrink-0 text-sm text-muted-foreground">
                      ~{formatQuantity(c.distanceKm)} كم
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 px-5">
          <h2 className="font-bold">بياناتك</h2>
          <div>
            <Label className="mb-1.5">الاسم الكامل</Label>
            <Input {...register("driver_name")} />
            {errors.driver_name && (
              <p className="mt-1 text-sm text-destructive">{errors.driver_name.message}</p>
            )}
          </div>
          <div>
            <Label className="mb-1.5">رقم الهاتف</Label>
            <Input dir="ltr" placeholder="0555xxxxxx" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-5">
          <h2 className="font-bold">المسار والمركبة</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5">نقطة الانطلاق</Label>
              <Select
                value={watch("origin_wilaya")}
                onValueChange={(v: string | null) => v && setValue("origin_wilaya", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="الولاية" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {wilayaNames.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.origin_wilaya && (
                <p className="mt-1 text-sm text-destructive">{errors.origin_wilaya.message}</p>
              )}
            </div>
            <div>
              <Label className="mb-1.5">الوجهة</Label>
              <Select
                value={watch("destination_wilaya")}
                onValueChange={(v: string | null) => v && setValue("destination_wilaya", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="الولاية" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {wilayaNames.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-1.5">نوع المركبة</Label>
            <Select
              value={watch("vehicle_type")}
              onValueChange={(v: string | null) =>
                v && setValue("vehicle_type", v as TransportOfferInput["vehicle_type"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string) => vehicleOptions.find((o) => o.value === value)?.label ?? value}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {vehicleOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5">الحمولة القصوى (كغ) — اختياري</Label>
              <Input type="number" min={0} {...register("max_capacity_kg", { valueAsNumber: true })} />
            </div>
            <div>
              <Label className="mb-1.5">التاريخ (اختياري)</Label>
              <Input type="date" {...register("travel_date")} />
            </div>
          </div>

          <div>
            <Label className="mb-1.5">الوقت المتاح (اختياري)</Label>
            <Input placeholder="مثال: صباحًا، بعد الظهر" {...register("time_window")} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={watch("has_empty_space")}
              onCheckedChange={(v) => setValue("has_empty_space", Boolean(v))}
            />
            لدي مساحة فارغة متاحة
          </label>

          <div>
            <Label className="mb-1.5">ملاحظات (اختياري)</Label>
            <Textarea {...register("notes")} />
          </div>
        </CardContent>
      </Card>

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" />}
        إرسال
      </Button>
    </form>
  );
}
