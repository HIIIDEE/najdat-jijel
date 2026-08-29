import Script from "next/script";

/**
 * Google Analytics 4 — يُحمَّل فقط إذا ضُبط NEXT_PUBLIC_GA_ID،
 * فيبقى التطوير المحلي والنسخ غير المضبوطة بلا أي تتبّع.
 *
 * ملاحظات خصوصية مقصودة:
 * - المكوّن مُركَّب في تخطيط الصفحات العامة فقط، ولا يعمل إطلاقًا داخل /admin
 *   حيث تُعرض بيانات الأسر المتضررة (أسماء وهواتف وعناوين).
 * - تُعطَّل إشارات الإعلانات و Google Signals، احترامًا لما تعلنه المنصة
 *   من عدم جمع معطيات لأغراض تجارية أو إعلانية.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}
