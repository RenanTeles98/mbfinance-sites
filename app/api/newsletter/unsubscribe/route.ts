import { readSubscribers, writeSubscribers } from "@/lib/newsletter-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Link inválido.", { status: 400 });
  }

  try {
    const email = Buffer.from(token, "base64url").toString("utf8");
    const subscribers = await readSubscribers();
    const updated = subscribers.map((s) =>
      s.email === email ? { ...s, active: false } : s
    );
    await writeSubscribers(updated);

    return new Response(
      `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Inscrição cancelada — MB Finance</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:48px 24px;">
    <p style="margin:0 0 8px;font-size:22px;font-weight:900;color:#003956;">mb<span style="color:#0099dd;">finance.</span></p>
    <h1 style="margin:24px 0 12px;font-size:28px;font-weight:800;color:#1e293b;">Inscrição cancelada</h1>
    <p style="margin:0 0 32px;color:#64748b;max-width:400px;">Você foi removido da nossa newsletter com sucesso. Lamentamos vê-lo partir!</p>
    <a href="https://mbfinance.com.br" style="display:inline-block;background:#003956;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:14px;">Voltar ao site</a>
  </div>
</body>
</html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch {
    return new Response("Erro ao processar sua solicitação.", { status: 500 });
  }
}
