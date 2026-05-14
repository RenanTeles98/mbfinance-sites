import { NextResponse } from "next/server";
import { getGa4Overview } from "@/lib/ga4";

export const revalidate = 1800;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const site = searchParams.get("site") || "mb-finance";
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";
    const data = await getGa4Overview(site, startDate, endDate);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao carregar analytics";

    return NextResponse.json(
      {
        configured: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
