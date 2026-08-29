import type { Metadata } from "next";
import { getCategories } from "@/lib/data/public";
import { DonationForm } from "./donation-form";

export const metadata: Metadata = {
  title: "لدي مساعدات",
  description: "سجّل المساعدات التي تملكها وسنقترح عليك أفضل نقطة تسليم بناءً على الاحتياج الحالي.",
};

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [categories, params] = await Promise.all([getCategories(), searchParams]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">ماذا لديك؟</h1>
        <p className="mt-2 text-muted-foreground">
          سجّل المساعدات التي تملكها، وسنقترح عليك أفضل نقطة تسليم بناءً على نوعها وموقعك والاحتياج
          الحالي.
        </p>
      </div>

      <DonationForm categories={categories} defaultCategorySlug={params.category} />
    </div>
  );
}
