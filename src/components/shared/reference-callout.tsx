"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";

export interface ReferenceCalloutLabels {
  title: string;
  description: string;
  copy: string;
  copied: string;
  trackLink: string;
}

/**
 * المرجع الذي يخرج به المتضرّر بعد إرسال طلبه.
 *
 * معروض بحجم كبير وبخط أحادي المسافة لأنه يُقرأ في الهاتف أو يُنسخ على ورقة،
 * غالبًا في وضع سيّئ: شاشة تحت الشمس، بطارية على وشك النفاد، شبكة متقطّعة.
 */
export function ReferenceCallout({
  reference,
  labels,
}: {
  reference: string;
  labels: ReferenceCalloutLabels;
}) {
  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      toast.success(labels.copied);
    } catch {
      // نسخ الحافظة يُرفض أحيانًا (سياق غير آمن أو إذن مرفوض): المرجع ظاهر
      // على الشاشة في كل الأحوال، فلا داعي لإزعاج المستخدم برسالة خطأ.
    }
  }

  return (
    // القالب محايد لا أخضر: هذا المكوّن يُعرض داخل لوحة النجاح الخضراء، فإطار
    // أخضر داخل إطار أخضر يذيب الحدّ بينهما ويضيع المرجع وسط اللون.
    <div className="rounded-xl border border-border bg-muted/40 p-5 text-center">
      <p className="font-semibold">{labels.title}</p>
      <p
        dir="ltr"
        className="mt-3 font-mono text-3xl font-extrabold tracking-widest text-algeria-green"
      >
        {reference}
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{labels.description}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copyReference}>
          <Copy className="size-4" aria-hidden /> {labels.copy}
        </Button>
        <LinkButton href="/track" variant="outline" size="sm">
          {labels.trackLink}
        </LinkButton>
      </div>
    </div>
  );
}
