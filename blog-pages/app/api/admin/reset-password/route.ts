import { NextRequest, NextResponse } from 'next/server';
import { verifyResetCode, clearResetCode, setPasswordOverride } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
    const { email, code, newPassword } = await req.json().catch(() => ({}));

    if (!email || !code || !newPassword) {
        return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres' }, { status: 400 });
    }

    const valid = await verifyResetCode(email.toLowerCase().trim(), String(code).trim());
    if (!valid) {
        return NextResponse.json({ error: 'Código inválido ou expirado' }, { status: 401 });
    }

    await setPasswordOverride(newPassword);
    await clearResetCode(email.toLowerCase().trim());

    return NextResponse.json({ ok: true });
}
