// إعدادات عامة للمنصة — يمكن تغيير الاسم والشعار من هنا بسهولة دون المساس بالكود
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "نجدة جيجل",
  shortName: "نجدة جيجل",
  tagline: "ننسّق التضامن، ونوصل المساعدة لمن يحتاجها.",
  description:
    "منصة جزائرية لتنسيق المساعدات وتوجيهها إلى المناطق والأسر الأكثر احتياجًا في ولاية جيجل.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  legalNotice: "مبادرة رقمية مستقلة لتنسيق التضامن — غير حكومية وغير تابعة لأي جهة رسمية.",
} as const;

// الحملة النشطة حاليًا (slug من جدول campaigns في قاعدة البيانات)
// تصميم قاعدة البيانات يدعم حملات متعددة مستقبلًا (فيضانات، زلازل، ولايات أخرى)
export const activeCampaignSlug = "jijel-fires-2026";
