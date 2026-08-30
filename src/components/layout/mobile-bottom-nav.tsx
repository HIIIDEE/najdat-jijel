"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TriangleAlert, MapPin, Gift, Truck, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/affected-areas", label: "المناطق", icon: TriangleAlert },
  { href: "/donate", label: "المساعدات", icon: Gift },
  { href: "/transport", label: "النقل", icon: Truck },
  { href: "/medical", label: "الأطقم الطبية", icon: Stethoscope },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom,0px)] shadow-lg backdrop-blur-md supports-backdrop-filter:bg-background/85 md:hidden">
      <div className="grid grid-cols-5 items-center">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 text-[10px] sm:text-xs font-bold transition-all",
                active
                  ? "text-algeria-green"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full transition-all",
                  active && "bg-algeria-green/15 text-algeria-green scale-110",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
