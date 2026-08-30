"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, MapPin, Gift, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileBottomNavLabels {
  home: string;
  needs: string;
  haveAid: string;
  map: string;
  needHelp: string;
}

/**
 * مكوّن عميل: لا يستطيع قراءة القاموس بنفسه، فالتسميات تصله من التخطيط
 * (مكوّن خادم) عبر الخصائص.
 */
export function MobileBottomNav({ labels }: { labels: MobileBottomNavLabels }) {
  const pathname = usePathname();

  const items = [
    { href: "/", label: labels.home, icon: Home },
    { href: "/needs", label: labels.needs, icon: ListChecks },
    { href: "/donate", label: labels.haveAid, icon: Gift },
    { href: "/map", label: labels.map, icon: MapPin },
    { href: "/help", label: labels.needHelp, icon: LifeBuoy },
  ];

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-xs font-semibold",
                active ? "text-algeria-green" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
