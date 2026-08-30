import type { Metadata } from "next";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { TrackForm } from "./track-form";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.track.pageTitle,
    description: t.track.pageSubtitle,
  };
}

export default async function TrackPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center sm:text-start">
        <h1 className="text-3xl font-extrabold">{t.track.pageTitle}</h1>
        <p className="mt-2 text-muted-foreground">{t.track.pageSubtitle}</p>
      </div>

      <TrackForm
        locale={locale}
        labels={{
          referenceLabel: t.track.referenceLabel,
          phoneLabel: t.track.phoneLabel,
          submitBtn: t.track.submitBtn,
          submitting: t.track.submitting,
          resultTitle: t.track.resultTitle,
          submittedOn: t.track.submittedOn,
          lastUpdate: t.track.lastUpdate,
          searchAgain: t.track.searchAgain,
          notFoundTitle: t.track.notFoundTitle,
          notFoundDesc: t.track.notFoundDesc,
          newRequest: t.track.newRequest,
          privacyNote: t.track.privacyNote,
          errorGeneric: t.common.errorGeneric,
        }}
      />
    </div>
  );
}
