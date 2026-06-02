import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createResetCode } from '@/lib/admin-auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'jennifer.vidal@mbfinance.com.br';

export async function POST(req: NextRequest) {
    const { email } = await req.json().catch(() => ({}));

    if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'E-mail obrigatório' }, { status: 400 });
    }

    // Verifica se é o e-mail autorizado
    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase()) {
        // Resposta genérica para não revelar qual e-mail está cadastrado
        return NextResponse.json({ ok: true });
    }

    const code = await createResetCode(email.toLowerCase().trim());

    // Envia e-mail com o código
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@mbfinance.com.br';

    if (resendKey) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
            from: `MB Negócios <${fromEmail}>`,
            to:   email,
            subject: 'Código de redefinição de senha — Painel Admin',
            html: `
                <div style="font-family:'Inter',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;">
                    <div style="text-align:center;margin-bottom:32px;">
                        <span style="font-size:24px;font-weight:900;color:#003956;">mb</span><span style="font-size:24px;font-weight:900;color:#0099dd;">negócios.</span>
                    </div>
                    <h2 style="font-size:18px;color:#1e293b;margin-bottom:12px;">Redefinição de senha</h2>
                    <p style="color:#64748b;font-size:14px;line-height:1.6;margin-bottom:24px;">
                        Recebemos uma solicitação para redefinir a senha do painel administrativo. Use o código abaixo para continuar:
                    </p>
                    <div style="background:#f0f9ff;border:2px solid #bae6fd;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                        <div style="font-size:36px;font-weight:900;letter-spacing:8px;color:#003956;">${code}</div>
                        <div style="font-size:12px;color:#64748b;margin-top:8px;">Válido por 15 minutos</div>
                    </div>
                    <p style="color:#94a3b8;font-size:12px;line-height:1.6;">
                        Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha não será alterada.
                    </p>
                </div>
            `,
        });
    }

    return NextResponse.json({ ok: true });
}
