import { NextResponse } from "next/server";
import { getGa4Overview, getGa4SiteOptions } from "@/lib/ga4";

export async function GET(request: Request) {
  const site = new URL(request.url).searchParams.get("site") || undefined;

  try {
    const data = await getGa4Overview(site);
    return NextResponse.json(
      {
        ...data,
        sites: getGa4SiteOptions(),
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao carregar analytics";

    return NextResponse.json(
      {
        configured: false,
        sites: getGa4SiteOptions(),
        error: message,
      },
      { status: 500 }
    );
  }
}
