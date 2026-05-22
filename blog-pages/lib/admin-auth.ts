const COOKIE_NAME = 'mb_admin_session';
const SESSION_MS   = 8 * 60 * 60 * 1000; // 8 horas

async function getKey(): Promise<CryptoKey> {
    const secret = process.env.ADMIN_SECRET ?? 'dev-only-insecure-secret';
    return crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
    );
}

export async function createSessionToken(): Promise<string> {
    const payload    = JSON.stringify({ exp: Date.now() + SESSION_MS });
    const payloadB64 = btoa(payload);
    const key        = await getKey();
    const sigBuf     = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
    const sigB64     = Buffer.from(sigBuf).toString('base64');
    return `${payloadB64}.${sigB64}`;
}

export async function verifySession(token: string): Promise<boolean> {
    try {
        const [payloadB64, sigB64] = token.split('.');
        if (!payloadB64 || !sigB64) return false;
        const { exp } = JSON.parse(atob(payloadB64));
        if (!exp || Date.now() > exp) return false;
        const key     = await getKey();
        const sigBytes = Buffer.from(sigB64, 'base64');
        return await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(payloadB64));
    } catch {
        return false;
    }
}

export { COOKIE_NAME };
