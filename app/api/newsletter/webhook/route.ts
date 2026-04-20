import { NextResponse } from "next/server";
import { readCampaigns, writeCampaigns } from "@/lib/newsletter-store";

// Resend webhook events: email.delivered, email.opened, email.clicked, email.bounced, email.complained
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { type, data } = payload;

    // Extrai o campaign_id das tags do email
    const tags = data?.tags as Record<string, string> | undefined;
    const campaignId = tags?.campaign_id;

    if (!campaignId) {
      return NextResponse.json({ ok: true, skipped: "no campaign_id tag" });
    }

    const campaigns = await readCampaigns();
    const updated = campaigns.map((c) => {
      if (c.id !== campaignId) return c;
      const stats = c.stats ?? { delivered: 0, opened: 0, clicked: 0, bounced: 0 };
      if (type === "email.delivered") stats.delivered++;
      if (type === "email.opened")    stats.opened++;
      if (type === "email.clicked")   stats.clicked++;
      if (type === "email.bounced" || type === "email.complained") stats.bounced++;
      return { ...c, stats };
    });

    await writeCampaigns(updated);
    return NextResponse.json({ ok: true, type, campaignId });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
