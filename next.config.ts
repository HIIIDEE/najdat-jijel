import type { NextConfig } from "next";

/**
 * سياسة أمن المحتوى — بوضع الإبلاغ أولًا.
 *
 * الخريطة هي أكثر ما يمكن أن تكسره سياسة خاطئة هنا: MapLibre يستعمل عمّال
 * `blob:` ويجلب بلاطات من OpenStreetMap. وكسر الخريطة على منصّة إغاثة يعني
 * منع أحدهم من العثور على أقرب مركز إيواء — ضرر أكبر من الثغرة التي نسدّها.
 *
 * لذلك تُنشر السياسة بترويسة `Report-Only`: المتصفّح يبلّغ عمّا كان سيُمنع
 * دون منعه. بعد أيام من المراقبة على الإنتاج، يكفي تغيير اسم الترويسة إلى
 * `Content-Security-Policy` لتصير نافذة. لم يكن بوسعي التحقّق منها في متصفّح
 * حقيقي من هنا، وهذا سبب اختيار وضع الإبلاغ لا الفرض.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // `unsafe-inline` و`unsafe-eval` مطلوبان لسكربتات Next المضمّنة؛ تضييقهما
  // يحتاج nonce لكل طلب، وهو تغيير أعمق من هذه الهجرة الأمنية.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  // الخطوط مستضافة ذاتيًا عبر next/font، فلا حاجة لنطاق خارجي.
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://www.google-analytics.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://www.google-analytics.com https://va.vercel-scripts.com",
  // MapLibre يشغّل عامل الخريطة من blob:
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // لا تخمين لنوع المحتوى: يمنع تحويل ملف مرفوع إلى سكربت قابل للتنفيذ.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // لا تأطير الموقع: يمنع سرقة النقرات على لوحة الإدارة.
  { key: "X-Frame-Options", value: "DENY" },
  // لا نسرّب المسار الكامل — وقد يحمل معرّفات — إلى المواقع الخارجية.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // الموقع لا يحتاج شيئًا من هذه، والخريطة تعمل بلا تحديد الموقع.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HTTPS إلزامي بعد أول زيارة.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
