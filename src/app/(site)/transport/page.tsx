import type { Metadata } from "next";
import { TransportForm } from "./transport-form";

export const metadata: Metadata = {
  title: "أستطيع النقل",
  description: "سجّل سيارتك أو شاحنتك لنقل المساعدات، وسنعرض عليك ما يمكن تحميله على مسارك.",
};

export default function TransportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">هل تستطيع نقل المساعدات؟</h1>
        <p className="mt-2 text-muted-foreground">
          سجّل بيانات مركبتك ومسارك، وسنعرض عليك المساعدات المسجَّلة القريبة من طريقك.
        </p>
      </div>
      <TransportForm />
    </div>
  );
}
