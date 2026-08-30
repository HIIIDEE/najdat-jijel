import { TriangleAlert, ShieldOff, HeartHandshake, Lock } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { AvailableLocale } from "@/i18n/locales";

const REPO_URL = "https://github.com/oussamabenkortbi/najdat-jijel";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5C5.73.5.99 5.24.99 11.5c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.06.67-3.71-1.3-3.71-1.3-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.2.91.1-.71.38-1.19.69-1.46-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.29 3.02 1.13a10.4 10.4 0 0 1 5.5 0c2.1-1.42 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.39.34.74 1 .74 2.02 0 1.46-.01 2.63-.01 2.99 0 .29.2.64.76.53 4.36-1.46 7.51-5.57 7.51-10.43C23.01 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

const pointsAr = [
  {
    icon: ShieldOff,
    text: "لا تطلب المنصة أي معلومات بنكية أو مالية أو بريدية — لا أرقام حسابات، ولا بطاقات، ولا تحويلات، ولا أي وسيلة دفع مهما كانت.",
  },
  {
    icon: HeartHandshake,
    text: "ليست منصة لجمع التبرعات ولا لجمع الأموال. هدفها الأول والأخير تنظيم المساعدات العينية الموجّهة للولايات المتضررة من الحرائق، وليس لها أي هدف ربحي أو تجاري.",
  },
  {
    icon: Lock,
    text: "لا تُجمع أي معطيات شخصية لأغراض تجارية أو إعلانية. بيانات التواصل (الاسم والهاتف) تُستخدم حصريًا لتمكين فرق التنسيق من إيصال المساعدة، ولا تُعرض للعامة، ولا تُباع أو تُشارك مع أي جهة.",
  },
];

const pointsFr = [
  {
    icon: ShieldOff,
    text: "La plateforme ne demande aucune coordonnée bancaire, financière ou postale — pas de numéros de compte, pas de cartes, pas de virements ni aucun moyen de paiement.",
  },
  {
    icon: HeartHandshake,
    text: "Il ne s'agit pas d'une plateforme de collecte d'argent. Son unique vocation est de coordonner les dons matériels destinés aux wilayas touchées par les incendies, sans aucun but lucratif.",
  },
  {
    icon: Lock,
    text: "Aucune donnée personnelle n'est collectée à des fins commerciales. Les coordonnées de contact sont exclusivement réservées à l'équipe de coordination pour acheminer les secours.",
  },
];

export function PlatformNotice({ locale = "ar" }: { locale?: AvailableLocale }) {
  const isFr = locale === "fr";
  const points = isFr ? pointsFr : pointsAr;

  return (
    <section className="bg-priority-critical text-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="flex items-center justify-center gap-2 text-center text-2xl font-extrabold">
          <TriangleAlert className="size-6 shrink-0" />
          {isFr ? "Information importante" : "ملاحظة هامة"}
        </h2>

        <ul className="mt-6 space-y-4">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <p.icon className="mt-0.5 size-5 shrink-0" />
              <p className="text-base font-bold leading-relaxed">{p.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-white/25 pt-6 text-center">
          <p className="text-base font-bold leading-relaxed">
            {isFr
              ? `${siteConfig.shortName} est entièrement gratuite et open source — tout le monde peut consulter le code source complet sur GitHub.`
              : `${siteConfig.shortName} مجانية بالكامل ومفتوحة المصدر — يستطيع أي شخص الاطلاع على الكود المصدري كاملًا والتحقق بنفسه مما تفعله المنصة بالبيانات.`}
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-priority-critical transition-transform hover:scale-105"
          >
            <GithubMark className="size-5" />
            {isFr ? "Code source sur GitHub" : "الكود المصدري على GitHub"}
          </a>
        </div>
      </div>
    </section>
  );
}
