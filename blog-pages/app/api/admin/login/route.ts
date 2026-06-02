import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, COOKIE_NAME, getPasswordOverride } from '@/lib/admin-auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    const { password } = await req.json().catch(() => ({}));

    // Prioridade: senha override salva no Redis (via reset-password), depois env var
    const override = await getPasswordOverride();
    const expected = override ?? process.env.ADMIN_PASSWORD ?? '';

    if (!expected) {
        return NextResponse.json({ error: 'Servidor não configurado' }, { status: 500 });
    }
    if (!password) {
        return NextResponse.json({ error: 'Senha obrigatória' }, { status: 400 });
    }

    const a = Buffer.from(String(password));
    const b = Buffer.from(expected);
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!match) {
        await new Promise(r => setTimeout(r, 600)); // dificulta brute force
        return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    const token = await createSessionToken();
    const res   = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:   8 * 3600,
        path:     '/',
    });
    return res;
}
