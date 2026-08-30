"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LinkButton } from "@/components/shared/link-button";
import { RequestStatusBadge } from "@/components/shared/status-badge";
import { formatRelativeTime } from "@/lib/constants";
import { REFERENCE_PREFIX } from "@/lib/reference";
import { localeMeta } from "@/i18n/locales";
import {
  requestStatusLookupSchema,
  type RequestStatusLookupInput,
} from "@/schemas/request-status";
import { lookupRequestStatus, type LookupRequestStatusResult } from "@/actions/request-status";
import type { AvailableLocale } from "@/i18n/locales";

interface TrackFormLabels {
  referenceLabel: string;
  phoneLabel: string;
  submitBtn: string;
  submitting: string;
  resultTitle: string;
  submittedOn: string;
  lastUpdate: string;
  searchAgain: string;
  notFoundTitle: string;
  notFoundDesc: string;
  newRequest: string;
  privacyNote: string;
  errorGeneric: string;
}

export function TrackForm({
  locale,
  labels,
}: {
  locale: AvailableLocale;
  labels: TrackFormLabels;
}) {
  // حالة واحدة لا ثلاث: مع حالات منفصلة للخطأ وعدم العثور، كان بحثٌ فاشل بعد
  // بحثٍ بلا نتيجة يعرض التنبيهين معًا.
  const [result, setResult] = useState<LookupRequestStatusResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestStatusLookupInput>({
    resolver: zodResolver(requestStatusLookupSchema),
    defaultValues: { reference: "", phone: "" },
  });

  const errorMessage =
    result && !result.success && !result.notFound ? (result.error ?? labels.errorGeneric) : null;

  async function onSubmit(values: RequestStatusLookupInput) {
    try {
      setResult(await lookupRequestStatus(values));
    } catch {
      setResult({ success: false, error: labels.errorGeneric });
    }
  }

  function searchAgain() {
    setResult(null);
    reset();
  }

  if (result?.request) {
    const { reference, status, createdAt, updatedAt } = result.request;
    const submittedOn = new Intl.DateTimeFormat(localeMeta[locale].htmlLang, {
      dateStyle: "long",
    }).format(new Date(createdAt));

    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-4 py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{labels.resultTitle}</p>
                <p className="font-mono text-xl font-bold tracking-widest">{reference}</p>
              </div>
              <RequestStatusBadge status={status} locale={locale} />
            </div>

            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <dt className="text-muted-foreground">{labels.submittedOn}</dt>
                <dd className="font-medium">{submittedOn}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="text-muted-foreground">{labels.lastUpdate}</dt>
                <dd className="font-medium">{formatRelativeTime(updatedAt, locale)}</dd>
              </div>
            </dl>

            <p className="text-xs text-muted-foreground">{labels.privacyNote}</p>
          </CardContent>
        </Card>

        <Button type="button" variant="outline" onClick={searchAgain}>
          {labels.searchAgain}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {result?.notFound ? (
        <Alert>
          <SearchX className="size-4" />
          <AlertDescription>
            <span className="font-semibold">{labels.notFoundTitle}</span>
            <span className="mt-1 block text-sm">{labels.notFoundDesc}</span>
            <span className="mt-3 flex flex-wrap gap-2">
              <LinkButton href="/help" size="sm" variant="outline">
                {labels.newRequest}
              </LinkButton>
            </span>
          </AlertDescription>
        </Alert>
      ) : null}

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="space-y-4 py-6">
          <div>
            <Label htmlFor="reference" className="mb-1.5">
              {labels.referenceLabel}
            </Label>
            <Input
              id="reference"
              dir="ltr"
              autoComplete="off"
              spellCheck={false}
              placeholder={`${REFERENCE_PREFIX}K7M2QX`}
              className="font-mono tracking-widest"
              {...register("reference")}
            />
            {errors.reference ? (
              <p className="mt-1 text-sm text-destructive">{errors.reference.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="phone" className="mb-1.5">
              {labels.phoneLabel}
            </Label>
            <Input
              id="phone"
              dir="ltr"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="0555000000"
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> {labels.submitting}
          </>
        ) : (
          labels.submitBtn
        )}
      </Button>
    </form>
  );
}
