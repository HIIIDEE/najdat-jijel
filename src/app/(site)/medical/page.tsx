import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MedicalVolunteerForm } from "./medical-volunteer-form";
import { MedicalVolunteersList } from "./medical-volunteers-list";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.cta.volunteerMedical,
    description: t.medical.pageSubtitle,
  };
}

export default async function MedicalPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const supabase = await createClient();
  const { data: volunteers } = await supabase.rpc("get_public_medical_volunteers");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">{t.medical.pageTitle}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.medical.pageSubtitle}
        </p>
      </div>
      <MedicalVolunteerForm locale={locale} />
      <MedicalVolunteersList volunteers={volunteers ?? []} locale={locale} />
    </div>
  );
}
