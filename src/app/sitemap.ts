import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getPublishedPosts } from "@/lib/data/public";

/**
 * خريطة الموقع.
 *
 * الأولويات ليست زخرفة: صفحات الطوارئ والاحتياجات هي ما نريد أن يظهر أولًا
 * لمن يبحث عن "أرقام الطوارئ" أو "نقاط التجميع"، ولوحة الإدارة خارج الفهرسة
 * أصلًا عبر `robots.ts`.
 */
const staticRoutes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "hourly" },
  { path: "/official-information", priority: 0.9, changeFrequency: "hourly" },
  { path: "/needs", priority: 0.9, changeFrequency: "hourly" },
  { path: "/map", priority: 0.9, changeFrequency: "daily" },
  { path: "/help", priority: 0.8, changeFrequency: "weekly" },
  { path: "/help/damage-assessment", priority: 0.8, changeFrequency: "weekly" },
  { path: "/donate", priority: 0.8, changeFrequency: "weekly" },
  { path: "/affected-areas", priority: 0.8, changeFrequency: "daily" },
  { path: "/news", priority: 0.7, changeFrequency: "hourly" },
  { path: "/transport", priority: 0.6, changeFrequency: "weekly" },
  { path: "/medical", priority: 0.6, changeFrequency: "weekly" },
  { path: "/artisans", priority: 0.6, changeFrequency: "weekly" },
  { path: "/transparency", priority: 0.5, changeFrequency: "daily" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  // لا `lastModified` للصفحات الثابتة: ختمها بتاريخ اليوم عند كل زحف يعني
  // إخبار محرّكات البحث أن كل شيء تغيّر، فتتوقّف عن الوثوق بالإشارة أصلًا.
  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // مقالات الأخبار: إن تعذّر الوصول إلى قاعدة البيانات ترجع القائمة فارغة
  // وتبقى خريطة الموقع صالحة بصفحاتها الثابتة بدل أن تفشل كلّها.
  const posts = await getPublishedPosts(200);

  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
