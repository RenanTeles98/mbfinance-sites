import { Redis } from '@upstash/redis';

const COOKIE_NAME  = 'mb_admin_session';
const SESSION_MS   = 8 * 60 * 60 * 1000; // 8 horas
const CODE_TTL_SEC = 15 * 60;             // 15 minutos

// ---------------------------------------------------------------------------
// Fallback in-memory store for dev (when Redis is not configured)
// ---------------------------------------------------------------------------
const _devCodes = new Map<string, { code: string; exp: number }>();
let   _devPassOverride: string | null = null;

function getRedis(): Redis | null {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
    return new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! });
}

// ---------------------------------------------------------------------------
// Session token
// ---------------------------------------------------------------------------
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
        const key      = await getKey();
        const sigBytes = Buffer.from(sigB64, 'base64');
        return await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(payloadB64));
    } catch {
        return false;
    }
}

// ---------------------------------------------------------------------------
// Password override (allows changing password without touching env vars)
// ---------------------------------------------------------------------------
const PASS_OVERRIDE_KEY = 'mb_admin_password_override';

export async function getPasswordOverride(): Promise<string | null> {
    const redis = getRedis();
    if (redis) return redis.get<string>(PASS_OVERRIDE_KEY);
    return _devPassOverride;
}

export async function setPasswordOverride(newPassword: string): Promise<void> {
    const redis = getRedis();
    if (redis) {
        await redis.set(PASS_OVERRIDE_KEY, newPassword);
    } else {
        _devPassOverride = newPassword;
    }
}

// ---------------------------------------------------------------------------
// Reset code (one-time 6-char code sent by email, expires in 15 min)
// ---------------------------------------------------------------------------
function makeCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem 0/O/I/1 pra evitar confusão
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

export async function createResetCode(email: string): Promise<string> {
    const code  = makeCode();
    const redis = getRedis();
    if (redis) {
        await redis.set(`mb_admin_reset:${email}`, code, { ex: CODE_TTL_SEC });
    } else {
        _devCodes.set(email, { code, exp: Date.now() + CODE_TTL_SEC * 1000 });
    }
    return code;
}

export async function verifyResetCode(email: string, code: string): Promise<boolean> {
    const redis = getRedis();
    if (redis) {
        const stored = await redis.get<string>(`mb_admin_reset:${email}`);
        return stored === code.toUpperCase();
    }
    const entry = _devCodes.get(email);
    if (!entry) return false;
    if (Date.now() > entry.exp) { _devCodes.delete(email); return false; }
    return entry.code === code.toUpperCase();
}

export async function clearResetCode(email: string): Promise<void> {
    const redis = getRedis();
    if (redis) {
        await redis.del(`mb_admin_reset:${email}`);
    } else {
        _devCodes.delete(email);
    }
}

export { COOKIE_NAME };
