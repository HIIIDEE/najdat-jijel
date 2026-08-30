import type { Metadata } from "next";
import { ArtisanForm } from "./artisan-form";

export const metadata: Metadata = {
  title: "أنا حرفي متطوع",
  description: "انضم إلى شبكة الحرفيين المتطوعين (دهان، بناء، سباكة، كهرباء...) للمساهمة في ترميم منازل المتضررين.",
};

export default function ArtisansPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">التطوع الحرفي لترميم المنازل</h1>
        <p className="mt-2 text-muted-foreground">
          سجّل بياناتك وتخصصك للمساهمة في أعمال الترميم (دهان، بناء، سباكة، كهرباء...) لدى الأسر
          المتضررة.
        </p>
      </div>
      <ArtisanForm />
    </div>
  );
}
