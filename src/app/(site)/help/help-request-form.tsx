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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  beneficiaryRequestSchema,
  needCategoryOptions,
  type BeneficiaryRequestInput,
} from "@/schemas/beneficiary-request";
import { submitBeneficiaryRequest } from "@/actions/beneficiary-requests";

export function HelpRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BeneficiaryRequestInput>({
    resolver: zodResolver(beneficiaryRequestSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      commune: "",
      address_note: "",
      family_members_count: 1,
      children_count: 0,
      housing_status: "",
      is_housing_habitable: "unknown",
      has_injuries: false,
      injuries_note: "",
      needs_medical: false,
      medical_note: "",
      lost_livestock: false,
      lost_income: false,
      needed_categories: [],
      other_needs_note: "",
    },
  });

  const neededCategories = watch("needed_categories");
  const hasInjuries = watch("has_injuries");
  const needsMedical = watch("needs_medical");

  function toggleCategory(value: string) {
    const current = neededCategories ?? [];
    setValue(
      "needed_categories",
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      { shouldValidate: true },
    );
  }

  async function onSubmit(values: BeneficiaryRequestInput) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitBeneficiaryRequest(values);
      if (!res.success) {
        setSubmitError(res.error ?? "حدث خطأ أثناء تسجيل طلبك. حاول مرة أخرى.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("حدث خطأ أثناء تسجيل طلبك. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Alert className="border-algeria-green/40 bg-algeria-green/5">
        <AlertTitle className="text-algeria-green">تم استلام طلبك بنجاح 🙏</AlertTitle>
        <AlertDescription>
          سيراجع فريق التنسيق طلبك ويتواصل معك في أقرب وقت ممكن. بياناتك محمية ولا تُعرض للعامة.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 px-5">
          <h2 className="font-bold">بياناتك</h2>
          <div>
            <Label className="mb-1.5">الاسم الكامل</Label>
            <Input {...register("full_name")} />
            {errors.full_name && (
              <p className="mt-1 text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>
          <div>
            <Label className="mb-1.5">رقم الهاتف</Label>
            <Input dir="ltr" placeholder="0555xxxxxx" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div>
            <Label className="mb-1.5">البلدية</Label>
            <Input {...register("commune")} />
            {errors.commune && (
              <p className="mt-1 text-sm text-destructive">{errors.commune.message}</p>
            )}
          </div>
          <div>
            <Label className="mb-1.5">الحي / أقرب معلم (اختياري)</Label>
            <Input {...register("address_note")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-5">
          <h2 className="font-bold">وضع الأسرة</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5">عدد أفراد الأسرة</Label>
              <Input
                type="number"
                min={1}
                {...register("family_members_count", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label className="mb-1.5">عدد الأطفال</Label>
              <Input
                type="number"
                min={0}
                {...register("children_count", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5">حالة السكن (اختياري)</Label>
            <Input placeholder="مثال: متضرر جزئيًا، محترق كليًا..." {...register("housing_status")} />
          </div>

          <div>
            <Label className="mb-2">هل السكن صالح للسكن؟</Label>
            <RadioGroup
              value={watch("is_housing_habitable")}
              onValueChange={(v: string | null) =>
                v && setValue("is_housing_habitable", v as BeneficiaryRequestInput["is_housing_habitable"])
              }
              className="flex gap-4"
            >
              <label className="flex items-center gap-1.5 text-sm">
                <RadioGroupItem value="yes" /> نعم
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <RadioGroupItem value="no" /> لا
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <RadioGroupItem value="unknown" /> غير متأكد
              </label>
            </RadioGroup>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={hasInjuries}
              onCheckedChange={(v) => setValue("has_injuries", Boolean(v))}
            />
            توجد إصابات في الأسرة
          </label>
          {hasInjuries && (
            <Input placeholder="تفاصيل مختصرة (اختياري)" {...register("injuries_note")} />
          )}

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={needsMedical}
              onCheckedChange={(v) => setValue("needs_medical", Boolean(v))}
            />
            توجد حاجة طبية
          </label>
          {needsMedical && (
            <Input placeholder="تفاصيل مختصرة (اختياري)" {...register("medical_note")} />
          )}

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={watch("lost_livestock")}
              onCheckedChange={(v) => setValue("lost_livestock", Boolean(v))}
            />
            فقدت الأسرة الماشية
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={watch("lost_income")}
              onCheckedChange={(v) => setValue("lost_income", Boolean(v))}
            />
            فقدت الأسرة مصدر الدخل
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-5">
          <h2 className="font-bold">ما الذي تحتاجه الأسرة؟</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {needCategoryOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={neededCategories?.includes(opt.value)}
                  onCheckedChange={() => toggleCategory(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.needed_categories && (
            <p className="text-sm text-destructive">{errors.needed_categories.message}</p>
          )}
          <div>
            <Label className="mb-1.5">تفاصيل إضافية (اختياري)</Label>
            <Textarea {...register("other_needs_note")} />
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
        إرسال الطلب
      </Button>
    </form>
  );
}
