import Link from "next/link";
import { siteConfig } from "@/config/site";

const columns = [
  {
    title: "المنصة",
    links: [
      { href: "/needs", label: "الاحتياجات العاجلة" },
      { href: "/map", label: "خريطة الإغاثة" },
      { href: "/transparency", label: "الشفافية" },
      { href: "/official-information", label: "معلومات رسمية" },
    ],
  },
  {
    title: "شارك",
    links: [
      { href: "/donate", label: "لدي مساعدات" },
      { href: "/transport", label: "أستطيع النقل" },
      { href: "/help", label: "أحتاج مساعدة" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-bold text-lg">{siteConfig.shortName}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">{siteConfig.tagline}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-semibold text-sm text-foreground">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>{siteConfig.legalNotice}</p>
          <p className="mt-2">
            جزء من البيانات الميدانية (مراكز الإيواء والجمعيات وبلديات جيجل) مصدرها منصة{" "}
            <a
              href="https://sanad-ca736.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground hover:underline"
            >
              سند — Sanad
            </a>{" "}
            من تطوير Quanta Club، مع الشكر لهم على جهدهم في جمعها والتحقق منها.
          </p>
          <p className="mt-2">
            <Link href="/admin/login" className="hover:text-foreground">
              دخول فرق التنسيق
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
