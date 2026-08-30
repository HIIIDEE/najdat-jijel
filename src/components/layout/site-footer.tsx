import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function SiteFooter() {
  const t = await getDictionary(await getLocale());

  const columns = [
    {
      title: t.footer.platformColumn,
      links: [
        { href: "/affected-areas", label: t.nav.affectedAreas },
        { href: "/medical", label: t.nav.medical },
        { href: "/map", label: t.footer.reliefMap },
        { href: "/news", label: t.nav.news },
        { href: "/transparency", label: t.nav.transparency },
        { href: "/official-information", label: t.nav.officialInformation },
        { href: "/track", label: t.help.referenceTrackLink },
      ],
    },
    {
      title: t.footer.participateColumn,
      links: [
        { href: "/donate", label: t.cta.haveAid },
        { href: "/transport", label: t.cta.canTransport },
        { href: "/medical", label: t.cta.volunteerMedical },
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-bold text-lg">{siteConfig.shortName}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">{t.site.tagline}</p>
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
          <p>{t.site.legalNotice}</p>
          <p className="mt-2">
            {t.footer.dataCreditBefore}{" "}
            <a
              href="https://sanad-ca736.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground hover:underline"
            >
              {t.footer.dataCreditLink}
            </a>{" "}
            {t.footer.dataCreditAfter}
          </p>
          <p className="mt-2">
            <Link href="/admin/login" className="hover:text-foreground">
              {t.footer.staffLogin}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
