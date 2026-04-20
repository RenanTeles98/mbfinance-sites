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
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.10);
      max-width: 480px;
      width: 100%;
      overflow: hidden;
    }
    .card-header {
      background: #003956;
      padding: 28px 40px;
    }
    .logo {
      font-size: 22px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -0.5px;
    }
    .logo span { color: #0099dd; }
    .card-body {
      padding: 48px 40px 40px;
      text-align: center;
    }
    .icon {
      width: 72px;
      height: 72px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    .icon svg { width: 36px; height: 36px; }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 12px;
    }
    p {
      color: #64748b;
      font-size: 15px;
      line-height: 1.7;
      margin-bottom: 32px;
    }
    .btn {
      display: inline-block;
      background: #003956;
      color: #fff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      transition: background 0.2s;
    }
    .btn:hover { background: #002840; }
    .footer {
      margin-top: 32px;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-header">
      <div class="logo">mb<span>finance.</span></div>
    </div>
    <div class="card-body">
      <div class="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </div>
      <h1>Inscrição cancelada</h1>
      <p>
        Você foi removido da nossa newsletter com sucesso.<br>
        Não enviaremos mais emails para este endereço.<br><br>
        Se mudar de ideia, pode se inscrever novamente a qualquer momento pelo nosso site.
      </p>
      <a href="https://mbfinance-sites.vercel.app/mb-finance-completo.html" class="btn">Voltar ao site</a>
    </div>
  </div>
  <div class="footer">
    &copy; MB Finance — Hub Financeiro para Empresas PJ
  </div>
</body>
</html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch {
    return new Response("Erro ao processar sua solicitação.", { status: 500 });
  }
}
