import { NextResponse } from "next/server";
import { getCampaignData, isGa4SiteConfigured } from "@/lib/ga4";

export const revalidate = 900;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const site = searchParams.get("site") || "mb-finance";
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";

    if (!isGa4SiteConfigured(site)) {
      return NextResponse.json({ configured: false, rows: [] }, { status: 200 });
    }

    const rows = await getCampaignData(startDate, endDate, site);
    return NextResponse.json({ configured: true, rows }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao carregar campanhas";
    return NextResponse.json(
      { configured: false, error: message },
      { status: 500 }
    );
  }
}
