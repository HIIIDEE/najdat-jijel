// استيراد قائمة المناطق المتضررة من الحرائق إلى جدول affected_areas.
// الاستخدام: node scripts/import-affected-areas.mjs
// يقرأ scripts/affected-areas.json ويستخدم SUPABASE_SERVICE_ROLE_KEY من .env.local

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf-8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i === -1) continue;
  const k = t.slice(0, i).trim();
  let v = t.slice(i + 1).trim();
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  process.env[k] ??= v;
}

const SEVERITY = {
  "Ravagé / dégâts importants": "ravaged",
  "Victimes / dégâts": "ravaged",
  "Évacuation": "evacuated",
  "Évacuations": "evacuated",
  "Évacuation préventive": "evacuated",
  "Familles évacuées": "evacuated",
  "Habitations menacées / évacuations": "evacuated",
  "Habitations menacées": "threatened",
  "Menacés": "threatened",
  "Incendie / habitations menacées": "threatened",
  "Incendie": "burning",
  "Incendie encore signalé": "burning",
  "Touchés": "burning",
  "Secteur touché": "burning",
  "Signalements/vidéos": "unconfirmed",
  "Signalement réseaux sociaux": "unconfirmed",
  "Réseaux sociaux à confirmer": "unconfirmed",
};

const SPOT_AR = {
  "Secteurs de la commune": "مناطق متفرقة من البلدية",
  "Plusieurs villages": "عدة قرى",
  "Secteurs résidentiels": "أحياء سكنية",
  "Secteurs montagneux": "مناطق جبلية",
  "Villages / montagne": "قرى ومناطق جبلية",
  "Plusieurs secteurs": "عدة مناطق",
};

const split = (s) => {
  if (s.includes("—")) {
    const [fr, ar] = s.split("—");
    return [fr.trim(), ar.trim()];
  }
  return [s.trim(), SPOT_AR[s.trim()] ?? s.trim()];
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const { data: campaign } = await supabase
  .from("campaigns").select("id").eq("slug", "northeast-fires-2026").single();
if (!campaign) throw new Error("الحملة النشطة غير موجودة");

const raw = JSON.parse(readFileSync(join(__dirname, "affected-areas.json"), "utf-8"));
const rows = raw.map((r) => {
  const [wilaya_fr, wilaya] = split(r.wilaya);
  const [daira_fr, daira] = split(r.daira);
  const [commune_fr, commune] = split(r.commune);
  const [spot_fr, spot] = split(r.spot);
  const severity = SEVERITY[r.status];
  if (!severity) throw new Error(`حالة غير معروفة: ${r.status}`);
  return {
    campaign_id: campaign.id,
    wilaya, wilaya_fr, daira, daira_fr, commune, commune_fr, spot, spot_fr,
    status_raw: r.status,
    severity,
    source: "قائمة موثقة من فريق التنسيق — أوت 2026",
  };
});

const { error, count } = await supabase
  .from("affected_areas").insert(rows, { count: "exact" });
if (error) {
  console.error("فشل الاستيراد:", error.message);
  process.exit(1);
}
console.log(`تم استيراد ${count ?? rows.length} منطقة متضررة.`);
