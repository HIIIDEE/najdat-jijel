import type { Metadata } from "next";
import { HelpRequestForm } from "./help-request-form";

export const metadata: Metadata = {
  title: "أحتاج مساعدة",
  description: "هل أنت أو عائلتك من المتضررين؟ سجّل طلبك بسرعة وبأقل قدر من المعلومات.",
};

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">هل أنت أو عائلتك من المتضررين؟</h1>
        <p className="mt-2 text-muted-foreground">
          سجّل طلبك خلال أقل من دقيقة. بياناتك لا تُعرض للعامة، ويراجعها فريق التنسيق مباشرة.
        </p>
      </div>
      <HelpRequestForm />
    </div>
  );
}
