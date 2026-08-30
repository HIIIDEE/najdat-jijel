"use client";

import { useActionState, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SuccessPanel } from "@/components/shared/success-panel";
import { submitDamageAssessment, type DamageAssessmentActionState } from "@/actions/damage-assessments";
import { campaignWilayas } from "@/config/site";

const initialState: DamageAssessmentActionState = { success: false };

// حقول الأضرار المُعرَّفة بدل التكرار — كل حقل هو خانة اختيار native (لا Radix) حتى يصل اسمه
// وقيمته إلى FormData مباشرة، وهو ما يتطلبه رفع الملفات عبر Server Action.
const damageOptions = [
  { name: "needs_flooring", label: "أضرار في الأرضية" },
  { name: "needs_roofing", label: "أضرار في السقف" },
  { name: "needs_plumbing", label: "أضرار في التمديدات الصحية" },
  { name: "needs_electrical", label: "أضرار في التمديدات الكهربائية" },
] as const;

export function DamageAssessmentForm() {
  const [state, formAction, pending] = useActionState(submitDamageAssessment, initialState);
  const [needsPaint, setNeedsPaint] = useState(false);

  if (state.success) {
    return (
      <SuccessPanel
        title="تم تسجيل تقييم الأضرار بنجاح"
        description="سيراجع فريق التنسيق طلبك، ويُحوَّل تقدير المواد اللازمة تلقائيًا إلى احتياج يظهر للمتبرعين. سنتواصل معك عند إيجاد حرفي مناسب."
        primaryHref="/needs"
        primaryLabel="تصفّح الاحتياجات"
      />
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 px-5 pt-6">
          <h2 className="font-bold">بياناتك</h2>

          <div>
            <Label className="mb-1.5">الاسم الكامل *</Label>
            <Input name="full_name" required />
          </div>

          <div>
            <Label className="mb-1.5">رقم الهاتف *</Label>
            <Input dir="ltr" name="phone" placeholder="0555xxxxxx" required />
          </div>

          <div>
            <Label className="mb-1.5">الولاية *</Label>
            <select
              name="wilaya"
              defaultValue={campaignWilayas[0]}
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
            >
              {campaignWilayas.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-1.5">البلدية *</Label>
            <Input name="commune" required />
          </div>

          <div>
            <Label className="mb-1.5">الحي / أقرب معلم (اختياري)</Label>
            <Input name="address_note" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-5 pt-6">
          <h2 className="font-bold">تفاصيل الأضرار</h2>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="needs_paint"
              checked={needsPaint}
              onChange={(e) => setNeedsPaint(e.target.checked)}
              className="size-4 rounded border-input"
            />
            حاجة إلى الدهان (طلاء الجدران)
          </label>
          {needsPaint && (
            <div>
              <Label className="mb-1.5">المساحة التقريبية المراد دهنها (م²)</Label>
              <Input type="number" min={1} step={1} name="paint_area_sqm" placeholder="مثال: 60" />
            </div>
          )}

          {damageOptions.map((opt) => (
            <label key={opt.name} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={opt.name} className="size-4 rounded border-input" />
              {opt.label}
            </label>
          ))}

          <div>
            <Label className="mb-1.5">تفاصيل إضافية عن الأضرار والتشطيبات (اختياري)</Label>
            <Textarea name="finishing_notes" placeholder="أي تفاصيل تساعد في تقدير المواد اللازمة..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 px-5 pt-6">
          <h2 className="flex items-center gap-2 font-bold">
            <Upload className="size-4" /> صور الأضرار
          </h2>
          <p className="text-sm text-muted-foreground">
            أرفق صورًا واضحة للأضرار — تساعد فريق التنسيق على المراجعة السريعة (اختياري لكن مستحسَن
            بشدة).
          </p>
          <input
            type="file"
            name="photos"
            multiple
            accept="image/*"
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
        </CardContent>
      </Card>

      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        إرسال تقييم الأضرار
      </Button>
    </form>
  );
}
