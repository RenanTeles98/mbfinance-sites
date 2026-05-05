import { NextResponse } from "next/server";
import { getGa4Overview } from "@/lib/ga4";

export async function GET() {
  try {
    const data = await getGa4Overview();
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
