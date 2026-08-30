import { NextResponse } from "next/server";
import { syncOfficialNews, OFFICIAL_ALGERIAN_SOURCES } from "@/lib/services/news-ingestion";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const authKey = searchParams.get("key");
  const cronSecret = process.env.CRON_SECRET;

  // If CRON_SECRET is set, ensure request is authorized
  if (cronSecret && authKey !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncOfficialNews();
  return NextResponse.json({
    success: result.success,
    syncedCount: result.syncedCount,
    sourcesCount: OFFICIAL_ALGERIAN_SOURCES.length,
    items: result.items.slice(0, 10),
    error: result.error,
  });
}

export async function POST() {
  const result = await syncOfficialNews();
  return NextResponse.json({
    success: result.success,
    syncedCount: result.syncedCount,
    sourcesCount: OFFICIAL_ALGERIAN_SOURCES.length,
    items: result.items,
    error: result.error,
  });
}
