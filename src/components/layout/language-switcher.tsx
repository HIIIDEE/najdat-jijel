"use client";

import { useTransition } from "react";
import { Check, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocale } from "@/actions/locale";
import { AVAILABLE_LOCALES, localeMeta, type AvailableLocale } from "@/i18n/locales";

interface LanguageSwitcherProps {
  current: AvailableLocale;
  /** نص متاح لقارئات الشاشة، مترجَم مثل بقية الواجهة. */
  label: string;
}

export function LanguageSwitcher({ current, label }: LanguageSwitcherProps) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={label}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
      >
        <Languages className="size-4" />
        {/* اسم اللغة الحالية بلغتها — يبقى مفهومًا لمن لا يقرأ لغة الواجهة الحالية. */}
        <span className="hidden sm:inline">{localeMeta[current].endonym}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-40">
        {AVAILABLE_LOCALES.map((code) => (
          <DropdownMenuItem
            key={code}
            lang={localeMeta[code].htmlLang}
            dir={localeMeta[code].dir}
            className="justify-between gap-4"
            onClick={() => startTransition(() => void setLocale(code))}
          >
            <span>{localeMeta[code].endonym}</span>
            {code === current && <Check className="size-4" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
