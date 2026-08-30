import type { Metadata } from "next";
import Link from "next/link";
import { DamageAssessmentForm } from "./damage-assessment-form";

export const metadata: Metadata = {
  title: "تقييم أضرار السكن",
  description: "صرّح بأضرار منزلك مع صور، ليُحوَّل تلقائيًا إلى تقدير للمواد اللازمة (دهان، بناء...) ومطابقة مع متبرعين وحرفيين متطوعين.",
};

export default function DamageAssessmentPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">تقييم أضرار السكن</h1>
        <p className="mt-2 text-muted-foreground">
          صف الأضرار وأرفق صورًا — نحوّل ذلك تلقائيًا إلى احتياج مواد يظهر للمتبرعين، ونحاول إيجاد
          حرفي متطوع مناسب.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          هل أنت حرفي وتريد التطوع لأعمال الترميم؟{" "}
          <Link href="/artisans" className="font-medium text-algeria-green hover:underline">
            سجّل هنا
          </Link>
          .
        </p>
      </div>
      <DamageAssessmentForm />
    </div>
  );
}
