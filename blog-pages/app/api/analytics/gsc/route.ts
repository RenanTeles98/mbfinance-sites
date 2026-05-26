import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

async function requireAuth(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value ?? '';
  return verifySession(token);
}

async function getAccessToken(credentials: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const toBase64url = (s: string) => Buffer.from(s).toString('base64url');

  const header = toBase64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = toBase64url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  );

  const signingInput = `${header}.${payload}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(
    credentials.private_key.replace(/\\n/g, '\n'),
    'base64url'
  );
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error('Failed to obtain GSC access token');
  }
  return data.access_token;
}

export async function GET(_request: NextRequest) {
  const authed = await requireAuth();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gscKeyRaw = process.env.GOOGLE_GSC_KEY ?? '';
  const gscSite = process.env.GOOGLE_GSC_SITE ?? '';

  if (!gscKeyRaw || !gscSite) {
    return NextResponse.json({ configured: false });
  }

  let credentials: { client_email: string; private_key: string };
  try {
    credentials = JSON.parse(gscKeyRaw) as {
      client_email: string;
      private_key: string;
    };
    if (!credentials.client_email || !credentials.private_key) {
      return NextResponse.json({ configured: false });
    }
  } catch {
    return NextResponse.json({ configured: false });
  }

  try {
    const accessToken = await getAccessToken(credentials);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 28);

    const toIso = (d: Date) => d.toISOString().slice(0, 10);

    const apiUrl = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      gscSite
    )}/searchAnalytics/query`;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: toIso(startDate),
        endDate: toIso(endDate),
        dimensions: ['query', 'page'],
        rowLimit: 50,
        orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { configured: true, error: `GSC API error: ${text}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      rows?: Array<{
        keys: string[];
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
      }>;
    };

    return NextResponse.json({
      configured: true,
      rows: data.rows ?? [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { configured: true, error: message },
      { status: 500 }
    );
  }
}
