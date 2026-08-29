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
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  medicalVolunteerSchema,
  type MedicalVolunteerInput,
} from "@/schemas/medical-volunteer";
import { SuccessPanel } from "@/components/shared/success-panel";
import { submitMedicalVolunteer } from "@/actions/medical";

export function MedicalVolunteerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MedicalVolunteerInput>({
    resolver: zodResolver(medicalVolunteerSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      specialty: "",
      license_number: "",
      wilaya_code: "18",
      commune_id: "",
      current_workplace: "",
      can_field_intervene: true,
      can_teleconsult: false,
      has_emergency_kit: false,
      show_phone_publicly: false,
      notes: "",
    },
  });

  const canFieldIntervene = watch("can_field_intervene");
  const canTeleconsult = watch("can_teleconsult");
  const hasEmergencyKit = watch("has_emergency_kit");
  const showPhonePublicly = watch("show_phone_publicly");

  async function onSubmit(values: MedicalVolunteerInput) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitMedicalVolunteer(values);
      if (!res.success) {
        setSubmitError(res.message ?? "حدث خطأ أثناء تسجيل بياناتك. حاول مرة أخرى.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("حدث خطأ أثناء تسجيل بياناتك. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SuccessPanel
        title="شكراً لمبادرتكم الإنسانية"
        description="تم تسجيل بياناتكم بنجاح. ستتواصل معكم خلية التنسيق الطبي والبيطري عند الحاجة لأي تدخل أو استشارة."
        primaryHref="/"
        primaryLabel="العودة للرئيسية"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 px-5 pt-6">
          <h2 className="font-bold">المعلومات المهنية والشخصية</h2>

          <div>
            <Label className="mb-1.5">الاسم واللقب *</Label>
            <Input placeholder="د. محمد بلحاج" {...register("full_name")} />
            {errors.full_name && (
              <p className="mt-1 text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1.5">رقم الهاتف *</Label>
            <Input dir="ltr" placeholder="0555xxxxxx" {...register("phone")} />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1.5">التخصص الطبي أو البيطري *</Label>
            <Input
              placeholder="طب بشري عام، طب بيطري، استعجالات، تمريض..."
              {...register("specialty")}
            />
            {errors.specialty && (
              <p className="mt-1 text-sm text-destructive">{errors.specialty.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1.5">البلدية أو مكان التواجد *</Label>
            <Input placeholder="مثال: جيجل، تاكسنة، الميلية، الشقفة..." {...register("commune_id")} />
            {errors.commune_id && (
              <p className="mt-1 text-sm text-destructive">{errors.commune_id.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1.5">رقم التسجيل في العمادة أو بطاقة المهنة (اختياري)</Label>
            <Input placeholder="رقم الاعتماد أو بطاقة المهنة" {...register("license_number")} />
          </div>

          <div>
            <Label className="mb-1.5">مقر العمل أو الممارسة (اختياري)</Label>
            <Input
              placeholder="مستشفى، عيادة بيطرية، عيادة خاصة، حر..."
              {...register("current_workplace")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-5 pt-6">
          <h2 className="font-bold">مجالات التطوع والاستعداد</h2>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={canFieldIntervene}
              onCheckedChange={(v) => setValue("can_field_intervene", Boolean(v))}
            />
            الاستعداد للتنقل والتدخل الميداني في المناطق المتضررة
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={canTeleconsult}
              onCheckedChange={(v) => setValue("can_teleconsult", Boolean(v))}
            />
            تقديم استشارات طبية / بيطرية وتوجيه أولي عبر الهاتف
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={hasEmergencyKit}
              onCheckedChange={(v) => setValue("has_emergency_kit", Boolean(v))}
            />
            حيازة حقيبة إسعافات أولية أو معدات بيطرية متنقلة
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={showPhonePublicly}
              onCheckedChange={(v) => setValue("show_phone_publicly", Boolean(v))}
            />
            أوافق على نشر رقم هاتفي للعموم في قائمة الأطقم الطبية بعد التحقق من انضمامي
          </label>

          <div>
            <Label className="mb-1.5">ملاحظات إضافية (أوقات التوفر، أدوية متوفرة...)</Label>
            <Textarea
              placeholder="أي تفاصيل تساعد فريق التنسيق الطبي..."
              {...register("notes")}
            />
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
        تأكيد تسجيل التطوع
      </Button>
    </form>
  );
}