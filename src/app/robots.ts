import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/**
 * ملف robots.txt.
 *
 * كل الصفحات العامة مفتوحة للفهرسة: في حالة طوارئ، الناس يصلون إلى المنصة
 * عبر البحث قبل أن يصلوا عبر الروابط المتداولة. الممنوع هو ما لا معنى
 * لفهرسته: لوحة الإدارة ومسارات الـ API.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
