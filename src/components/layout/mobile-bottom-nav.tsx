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
