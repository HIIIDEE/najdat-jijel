import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig, campaignWilayasLabel } from "@/config/site";
import { getSiteHost } from "@/lib/site-url";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// نفس خط الموقع، محمّل من `public/fonts`. صيغة OTF مطلوبة هنا: مولّد الصور
// لا يقرأ woff2.
const thmanyahBold = await readFile(
  join(process.cwd(), "public", "fonts", "thmanyahsans-Bold.otf"),
);

/**
 * سطر عربي.
 *
 * محرّك توليد الصور يصل الحروف داخل الكلمة صحيحًا لكنه يتجاهل `direction: rtl`
 * ويرصّ الكلمات من اليسار إلى اليمين، فتظهر الجملة معكوسة الكلمات. الحل: كل
 * كلمة عنصر مستقل داخل صف `row-reverse`، فيتكفّل الـ flex بترتيب الكلمات.
 */
function RtlLine({
  text,
  style,
}: {
  text: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        columnGap: "0.18em",
        rowGap: "0.15em",
        ...style,
      }}
    >
      {text.split(" ").map((word, index) => (
        <div key={index} style={{ display: "flex" }}>
          {word}
        </div>
      ))}
    </div>
  );
}

/**
 * صورة المشاركة (OpenGraph).
 *
 * الموقع يُتداول أساسًا عبر فيسبوك وواتساب: رابط بلا صورة يمرّ دون أن يُرى.
 * تُولَّد هنا بدل رفع ملف ثابت حتى تبقى متوافقة مع اسم المنصة وولايات الحملة
 * إذا تغيّرا في `config/site.ts`.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          padding: 80,
          color: "#ffffff",
          backgroundColor: "#04351d",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, #00843d 0%, #04351d 60%, #021a0f 100%)",
          fontFamily: "Thmanyah",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#8ff0b8", letterSpacing: 2 }}>
          {getSiteHost()}
        </div>

        <RtlLine text={siteConfig.shortName} style={{ fontSize: 104, lineHeight: 1.2 }} />

        <RtlLine
          text={siteConfig.tagline}
          style={{ fontSize: 42, color: "#d8f3e3", lineHeight: 1.5, maxWidth: 940 }}
        />

        <RtlLine
          text={campaignWilayasLabel}
          style={{
            marginTop: 12,
            padding: "14px 40px",
            fontSize: 34,
            border: "2px solid rgba(255,255,255,0.35)",
            borderRadius: 999,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Thmanyah", data: thmanyahBold, style: "normal", weight: 700 }],
    },
  );
}
