import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createHmac } from "crypto";
import sanitizeHtml from "sanitize-html";
import { readSubscribers, readCampaigns, writeCampaigns } from "@/lib/newsletter-store";
import type { Campaign } from "@/types/newsletter";

function makeUnsubToken(email: string): string {
  const secret = process.env.UNSUB_SECRET || process.env.BLOG_ADMIN_TOKEN || "";
  const sig = createHmac("sha256", secret).update(email).digest("base64url");
  const payload = Buffer.from(email).toString("base64url");
  return `${payload}.${sig}`;
}

const ALLOWED_EMAIL_TAGS = ["p", "br", "strong", "em", "b", "i", "u", "ul", "ol", "li", "h2", "h3", "h4", "a", "blockquote", "span", "div"];

function buildEmailHtml(subject: string, previewText: string, body: string, email: string): string {
  const token = makeUnsubToken(email);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mbfinance-sites.vercel.app";

  const safeSubject = subject.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] ?? c));
  const safeBody = sanitizeHtml(body, {
    allowedTags: ALLOWED_EMAIL_TAGS,
    allowedAttributes: { a: ["href"], span: ["style"], div: ["style"], p: ["style"] },
    allowedSchemes: ["https", "mailto"],
    disallowedTagsMode: "discard",
  });
  const safePreview = previewText.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] ?? c));

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${safePreview}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#003956;padding:28px 40px;">
              <p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                mb<span style="color:#0099dd;">finance.</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;color:#1e293b;font-size:16px;line-height:1.75;">
              ${safeBody}
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                Voc� est� recebendo este email porque se inscreveu na newsletter da Mb Finance.<br>
                <a href="${siteUrl}/api/newsletter/unsubscribe?token=${token}" style="color:#0099dd;text-decoration:none;">Cancelar inscri��o</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  const adminToken = process.env.BLOG_ADMIN_TOKEN;
  if (!adminToken || request.headers.get("x-blog-admin-token") !== adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY n�o configurada. Adicione a vari�vel de ambiente na Vercel." },
      { status: 500 }
    );
  }

  const { subject, previewText, body, targetTag, recipientId, fromName, fromEmail, replyTo } = await request.json();

  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ ok: false, error: "Assunto e conte�do s�o obrigat�rios" }, { status: 400 });
  }

  const subscribers = await readSubscribers();
  const active = subscribers.filter((s) => {
    if (!s.active) return false;
    if (recipientId) return s.id === recipientId;
    if (!targetTag) return true;
    return (s.tags || []).includes(targetTag);
  });

  if (active.length === 0) {
    return NextResponse.json({ ok: false, error: "Nenhum inscrito ativo para enviar" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const senderEmail = fromEmail || process.env.RESEND_FROM_EMAIL || "newsletter@mbfinance.com.br";
  const senderName  = fromName  || "Mb Finance";

  // Criar ID da campanha antes do envio para rastrear eventos
  const campaignId = crypto.randomUUID();

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  // Resend batch: m�x 100 por requisi��o
  const BATCH = 100;
  for (let i = 0; i < active.length; i += BATCH) {
    const chunk = active.slice(i, i + BATCH);
    try {
      const emails = chunk.map((sub) => ({
        from: `${senderName} <${senderEmail}>`,
        to: sub.email,
        subject,
        html: buildEmailHtml(subject, previewText || "", body, sub.email),
        ...(replyTo && { replyTo }),
        tags: [{ name: "campaign_id", value: campaignId }],
      }));

      const { data: batchData, error } = await resend.batch.send(emails);
      if (error) {
        failed += chunk.length;
        errors.push(`[${error.name}] ${error.message}`);
      } else if (batchData) {
        sent += chunk.length;
      }
    } catch (err: unknown) {
      failed += chunk.length;
      errors.push(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }

  // Salvar registro da campanha com stats zerados
  const campaigns = await readCampaigns();
  const campaign: Campaign = {
    id: campaignId,
    subject,
    previewText: previewText || "",
    body,
    sentAt: new Date().toISOString(),
    recipientCount: sent,
    ...(targetTag && { targetTag }),
    stats: { delivered: 0, opened: 0, clicked: 0, bounced: 0 },
  };
  await writeCampaigns([campaign, ...campaigns]);

  return NextResponse.json({
    ok: sent > 0 || failed === 0,
    sent,
    failed,
    ...(errors.length > 0 && { errors, firstError: errors[0] }),
  });
}
