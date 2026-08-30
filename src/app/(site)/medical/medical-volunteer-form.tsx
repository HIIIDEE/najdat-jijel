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
import type { AvailableLocale } from "@/i18n/locales";

export function MedicalVolunteerForm({
  locale = "ar",
}: {
  locale?: AvailableLocale;
}) {
  const isFr = locale === "fr";
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
        setSubmitError(
          res.message ??
            (isFr
              ? "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer."
              : "حدث خطأ أثناء تسجيل بياناتك. حاول مرة أخرى."),
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(
        isFr
          ? "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer."
          : "حدث خطأ أثناء تسجيل بياناتك. حاول مرة أخرى.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SuccessPanel
        title={isFr ? "Merci pour votre engagement humanitaire" : "شكراً لمبادرتكم الإنسانية"}
        description={
          isFr
            ? "Vos coordonnées ont été enregistrées avec succès. La cellule de coordination médicale vous contactera en cas de besoin."
            : "تم تسجيل بياناتكم بنجاح. ستتواصل معكم خلية التنسيق الطبي والبيطري عند الحاجة لأي تدخل أو استشارة."
        }
        primaryHref="/"
        primaryLabel={isFr ? "Retour à l'accueil" : "العودة للرئيسية"}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 px-5 pt-6">
          <h2 className="font-bold">{isFr ? "Informations professionnelles et personnelles" : "المعلومات المهنية والشخصية"}</h2>

          <div>
            <Label className="mb-1.5">{isFr ? "Nom et prénom *" : "الاسم واللقب *"}</Label>
            <Input placeholder={isFr ? "Dr. Mohamed Belhadj" : "د. محمد بلحاج"} {...register("full_name")} />
            {errors.full_name && (
              <p className="mt-1 text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1.5">{isFr ? "Numéro de téléphone *" : "رقم الهاتف *"}</Label>
            <Input dir="ltr" placeholder="0555xxxxxx" {...register("phone")} />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1.5">{isFr ? "Spécialité médicale ou vétérinaire *" : "التخصص الطبي أو البيطري *"}</Label>
            <Input
              placeholder={isFr ? "Médecin généraliste, vétérinaire, urgentiste, infirmier..." : "طب بشري عام، طب بيطري، استعجالات، تمريض..."}
              {...register("specialty")}
            />
            {errors.specialty && (
              <p className="mt-1 text-sm text-destructive">{errors.specialty.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1.5">{isFr ? "Commune ou lieu de résidence *" : "البلدية أو مكان التواجد *"}</Label>
            <Input placeholder={isFr ? "Ex: Jijel, Taher, El Milia..." : "مثال: جيجل، تاكسنة، الميلية، الشقفة..."} {...register("commune_id")} />
            {errors.commune_id && (
              <p className="mt-1 text-sm text-destructive">{errors.commune_id.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-1.5">{isFr ? "Numéro d'inscription à l'ordre / carte professionnelle (facultatif)" : "رقم التسجيل في العمادة أو بطاقة المهنة (اختياري)"}</Label>
            <Input placeholder={isFr ? "N° d'agrément ou carte professionnelle" : "رقم الاعتماد أو بطاقة المهنة"} {...register("license_number")} />
          </div>

          <div>
            <Label className="mb-1.5">{isFr ? "Lieu d'exercice actuel (facultatif)" : "مقر العمل أو الممارسة (اختياري)"}</Label>
            <Input
              placeholder={isFr ? "Hôpital, clinique vétérinaire, cabinet privé, libéral..." : "مستشفى، عيادة بيطرية، عيادة خاصة، حر..."}
              {...register("current_workplace")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-5 pt-6">
          <h2 className="font-bold">{isFr ? "Disponibilité et domaines d'intervention" : "مجالات التطوع والاستعداد"}</h2>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={canFieldIntervene}
              onCheckedChange={(v) => setValue("can_field_intervene", Boolean(v))}
            />
            {isFr ? "Prêt à se déplacer pour des interventions de terrain dans les zones sinistrées" : "الاستعداد للتنقل والتدخل الميداني في المناطق المتضررة"}
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={canTeleconsult}
              onCheckedChange={(v) => setValue("can_teleconsult", Boolean(v))}
            />
            {isFr ? "Prêt à donner des téléconsultations médicales / vétérinaires par téléphone" : "تقديم استشارات طبية / بيطرية وتوجيه أولي عبر الهاتف"}
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={hasEmergencyKit}
              onCheckedChange={(v) => setValue("has_emergency_kit", Boolean(v))}
            />
            {isFr ? "Dispose d'une trousse d'urgence ou d'un équipement vétérinaire mobile" : "حيازة حقيبة إسعافات أولية أو معدات بيطرية متنقلة"}
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={showPhonePublicly}
              onCheckedChange={(v) => setValue("show_phone_publicly", Boolean(v))}
            />
            {isFr ? "J'accepte la publication de mon numéro de téléphone dans l'annuaire après vérification" : "أوافق على نشر رقم هاتفي للعموم في قائمة الأطقم الطبية بعد التحقق من انضمامي"}
          </label>

          <div>
            <Label className="mb-1.5">{isFr ? "Remarques (disponibilités, matériel disponible...)" : "ملاحظات إضافية (أوقات التوفر، أدوية متوفرة...)"}</Label>
            <Textarea
              placeholder={isFr ? "Précisions utiles pour l'équipe de coordination..." : "أي تفاصيل تساعد فريق التنسيق الطبي..."}
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
        {isFr ? "Confirmer l'inscription" : "تأكيد تسجيل التطوع"}
      </Button>
    </form>
  );
}
