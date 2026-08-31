import { NextResponse } from "next/server";
import { syncOfficialNews, OFFICIAL_ALGERIAN_SOURCES } from "@/lib/services/news-ingestion";
import { isApiRequestAuthorized } from "@/lib/api-auth";

export async function GET(req: Request) {
  if (!isApiRequestAuthorized(req)) {
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

export async function POST(req: Request) {
  if (!isApiRequestAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncOfficialNews();
  return NextResponse.json({
    success: result.success,
    syncedCount: result.syncedCount,
    sourcesCount: OFFICIAL_ALGERIAN_SOURCES.length,
    items: result.items,
    error: result.error,
  });
}
