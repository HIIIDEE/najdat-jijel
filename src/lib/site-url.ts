import "server-only";
import { siteConfig } from "@/config/site";

/**
 * الرابط المطلق للموقع، لملفات الفهرسة وصور المشاركة.
 *
 * `siteConfig.url` يرجع إلى `http://localhost:3000` إذا لم تُضبط
 * `NEXT_PUBLIC_SITE_URL`. لا ضرر في ذلك محليًا، لكنه كارثي في هذين الملفين
 * تحديدًا: `robots.txt` سيعلن خريطة موقع على localhost، وكل روابط الخريطة
 * ستشير إلى localhost — أي أن الملفين يفعلان عكس الغرض منهما تمامًا، بصمت
 * وبلا أي خطأ يلفت النظر.
 *
 * لذلك نرجع إلى النطاق الذي تعرّفه Vercel نفسها قبل الرجوع إلى localhost.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return siteConfig.url.replace(/\/$/, "");
}

/** اسم المضيف وحده (habadz.life)، للعرض داخل صورة المشاركة. */
export function getSiteHost(): string {
  try {
    return new URL(getSiteUrl()).host;
  } catch {
    return getSiteUrl();
  }
}
