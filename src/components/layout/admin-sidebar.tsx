"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ListChecks,
  TriangleAlert,
  Gift,
  Boxes,
  MapPin,
  Warehouse,
  Truck,
  PackageCheck,
  UserCog,
  ShieldCheck,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/beneficiaries", label: "الأسر المتضررة", icon: Users },
  { href: "/admin/needs", label: "الاحتياجات", icon: ListChecks },
  { href: "/admin/affected-areas", label: "المناطق المتضررة", icon: TriangleAlert },
  { href: "/admin/donations", label: "المساعدات", icon: Gift },
  { href: "/admin/inventory", label: "المخزون", icon: Boxes },
  { href: "/admin/collection-points", label: "نقاط التجميع", icon: MapPin },
  { href: "/admin/relief-hubs", label: "مراكز الاستقبال", icon: Warehouse },
  { href: "/admin/transport", label: "النقل", icon: Truck },
  { href: "/admin/distributions", label: "عمليات التوزيع", icon: PackageCheck },
  { href: "/admin/users", label: "المستخدمون", icon: UserCog },
  { href: "/admin/verification", label: "التحقق", icon: ShieldCheck },
  { href: "/admin/reports", label: "التقارير", icon: BarChart3 },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-0.5">
      {sections.map((section) => {
        const active =
          section.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(section.href);
        const Icon = section.icon;
        return (
          <Link
            key={section.href}
            href={section.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-algeria-green/10 text-algeria-green"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
