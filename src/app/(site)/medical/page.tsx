import type { Metadata } from "next";
import { MedicalVolunteerForm } from "./medical-volunteer-form";

export const metadata: Metadata = {
  title: "أنا طبيب بشري / بيطري",
  description: "انضم إلى شبكة الأطباء، البياطرة والكوادر الصحية لإغاثة المتضررين وتقديم الدعم الميداني والاستشارات.",
};

export default function MedicalPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">التطوع الطبي والبيطري</h1>
        <p className="mt-2 text-muted-foreground">
          سجّل بياناتك وتخصصك للمساهمة في تقديم الرعاية الصحية الميدانية أو الاستشارات الهاتفية.
        </p>
      </div>
      <MedicalVolunteerForm />
    </div>
  );
}