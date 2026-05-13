import { NextResponse } from "next/server";
import { getCampaignData, hasGa4Config } from "@/lib/ga4";

export const revalidate = 900;

export async function GET(request: Request) {
  try {
    if (!hasGa4Config()) {
      return NextResponse.json({ configured: false }, { status: 200 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";

    const rows = await getCampaignData(startDate, endDate);
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
