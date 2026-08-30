"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TriangleAlert, MapPin, Gift, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileBottomNavLabels {
  home: string;
  officialInfo?: string;
  haveAid: string;
  map: string;
  medical?: string;
}

export function MobileBottomNav({ labels }: { labels?: MobileBottomNavLabels }) {
  const pathname = usePathname();

  const items = [
    { href: "/", label: labels?.home || "الرئيسية", icon: Home },
    { href: "/official-information", label: labels?.officialInfo || "البيانات", icon: TriangleAlert },
    { href: "/donate", label: labels?.haveAid || "تقديم عون", icon: Gift, isPrimary: true },
    { href: "/map", label: labels?.map || "الخريطة", icon: MapPin },
    { href: "/medical", label: labels?.medical || "الأطباء", icon: Stethoscope },
  ];

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 pb-[max(env(safe-area-inset-bottom),0.75rem)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl supports-backdrop-filter:bg-background/80 md:hidden">
      <div className="grid grid-cols-5 items-center px-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative -top-3 flex flex-col items-center justify-center"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-algeria-green text-white shadow-lg shadow-algeria-green/30 ring-4 ring-background transition-transform duration-200 active:scale-95 group-hover:scale-105">
                  <Icon className="size-5" />
                </span>
                <span className="mt-1 text-[10px] font-extrabold text-algeria-green">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-bold transition-all active:scale-95",
                active
                  ? "text-algeria-green font-extrabold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-xl transition-all",
                  active && "bg-algeria-green/15 text-algeria-green scale-110",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
