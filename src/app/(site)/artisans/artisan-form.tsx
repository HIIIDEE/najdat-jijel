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
import { artisanVolunteerSchema, type ArtisanVolunteerInput } from "@/schemas/artisan-volunteer";
import { SuccessPanel } from "@/components/shared/success-panel";
import { submitArtisanVolunteer } from "@/actions/artisans";

export function ArtisanForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArtisanVolunteerInput>({
    resolver: zodResolver(artisanVolunteerSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      specialty: "",
      wilaya_code: "18",
      commune_id: "",
      can_travel: true,
      has_own_tools: false,
      show_phone_publicly: false,
      notes: "",
    },
  });

  const canTravel = watch("can_travel");
  const hasOwnTools = watch("has_own_tools");
  const showPhonePublicly = watch("show_phone_publicly");

  async function onSubmit(values: ArtisanVolunteerInput) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitArtisanVolunteer(values);
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
        description="تم تسجيل بياناتكم بنجاح. ستتواصل معكم خلية التنسيق عند وجود أعمال ترميم تحتاج تخصصكم."
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
            <Input placeholder="محمد بلحاج" {...register("full_name")} />
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
            <Label className="mb-1.5">التخصص الحرفي *</Label>
            <Input placeholder="دهان، بناء، سباك، كهربائي..." {...register("specialty")} />
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-5 pt-6">
          <h2 className="font-bold">مجالات التطوع والاستعداد</h2>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={canTravel}
              onCheckedChange={(v) => setValue("can_travel", Boolean(v))}
            />
            الاستعداد للتنقل إلى المناطق المتضررة الأخرى
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={hasOwnTools}
              onCheckedChange={(v) => setValue("has_own_tools", Boolean(v))}
            />
            حيازة أدوات العمل الخاصة
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={showPhonePublicly}
              onCheckedChange={(v) => setValue("show_phone_publicly", Boolean(v))}
            />
            أوافق على نشر رقم هاتفي للعموم في قائمة الحرفيين بعد التحقق من انضمامي
          </label>

          <div>
            <Label className="mb-1.5">ملاحظات إضافية (أوقات التوفر...)</Label>
            <Textarea placeholder="أي تفاصيل تساعد فريق التنسيق..." {...register("notes")} />
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
