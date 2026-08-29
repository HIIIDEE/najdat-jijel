import Link from "next/link";
import { HeartHandshake, LifeBuoy, Gift } from "lucide-react";
import { siteConfig } from "@/config/site";
import { LinkButton } from "@/components/shared/link-button";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/needs", label: "الاحتياجات" },
  { href: "/affected-areas", label: "المناطق المتضررة" },
  { href: "/map", label: "الخريطة" },
  { href: "/news", label: "الأخبار" },
  { href: "/transparency", label: "الشفافية" },
  { href: "/official-information", label: "معلومات رسمية" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <span className="flex size-9 items-center justify-center rounded-full bg-algeria-green text-algeria-green-foreground">
            <HeartHandshake className="size-5" />
          </span>
          <span>{siteConfig.shortName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LinkButton href="/help" size="sm" variant="outline" className="hidden sm:inline-flex">
            <LifeBuoy className="size-4" /> أحتاج مساعدة
          </LinkButton>
          <LinkButton href="/donate" size="sm">
            <Gift className="size-4" /> لدي مساعدات
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
