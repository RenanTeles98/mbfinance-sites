import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const HEYGEN_API_URL = 'https://api.heygen.com/v3/videos';
type HeyGenResponse = Record<string, unknown>;

async function isAuthorized(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && await verifySession(token);
}

function getApiKey() {
    return process.env.HEYGEN_API_KEY || '';
}

function normalizeAspectRatio(value: string) {
    return ['16:9', '9:16', '1:1'].includes(value) ? value : '9:16';
}

function asRecord(value: unknown): HeyGenResponse {
    return value && typeof value === 'object' ? value as HeyGenResponse : {};
}

function getString(value: unknown) {
    return typeof value === 'string' ? value : '';
}

function getHeyGenMessage(data: unknown, fallback: string) {
    const root = asRecord(data);
    const error = asRecord(root.error);
    return getString(error.message) || getString(root.message) || fallback;
}

export async function POST(req: NextRequest) {
    if (!(await isAuthorized(req))) {
        return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        return NextResponse.json({ error: 'HEYGEN_API_KEY nao configurada no servidor.' }, { status: 503 });
    }

    const body = asRecord(await req.json().catch(() => ({})));
    const title = getString(body.title).trim().slice(0, 120);
    const script = getString(body.script).trim();
    const avatarId = getString(body.avatarId).trim();
    const voiceId = getString(body.voiceId).trim();
    const aspectRatio = normalizeAspectRatio(getString(body.aspectRatio) || '9:16');

    if (!title || !script || !avatarId || !voiceId) {
        return NextResponse.json({ error: 'Titulo, roteiro, Avatar ID e Voice ID sao obrigatorios.' }, { status: 400 });
    }

    const heygenRes = await fetch(HEYGEN_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({
            type: 'avatar',
            avatar_id: avatarId,
            title,
            aspect_ratio: aspectRatio,
            script,
            voice_id: voiceId,
            caption: { file_format: 'srt', style: 'default' },
            output_format: 'mp4',
        }),
    });

    const data: unknown = await heygenRes.json().catch(() => ({}));
    if (!heygenRes.ok) {
        return NextResponse.json({ error: getHeyGenMessage(data, 'Erro ao criar video no HeyGen.') }, { status: heygenRes.status });
    }

    const root = asRecord(data);
    const nested = asRecord(root.data);
    const videoId = getString(nested.id) || getString(root.id) || getString(root.video_id);
    return NextResponse.json({ ok: true, videoId, data });
}

export async function GET(req: NextRequest) {
    if (!(await isAuthorized(req))) {
        return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        return NextResponse.json({ error: 'HEYGEN_API_KEY nao configurada no servidor.' }, { status: 503 });
    }

    const videoId = String(req.nextUrl.searchParams.get('videoId') || '').trim();
    if (!videoId) {
        return NextResponse.json({ error: 'videoId obrigatorio.' }, { status: 400 });
    }

    const heygenRes = await fetch(HEYGEN_API_URL + '/' + encodeURIComponent(videoId), {
        method: 'GET',
        headers: { 'x-api-key': apiKey },
        cache: 'no-store',
    });

    const data: unknown = await heygenRes.json().catch(() => ({}));
    if (!heygenRes.ok) {
        return NextResponse.json({ error: getHeyGenMessage(data, 'Erro ao consultar video no HeyGen.') }, { status: heygenRes.status });
    }

    const root = asRecord(data);
    const rootData = asRecord(root.data);
    const detail = Object.keys(rootData).length ? rootData : root;
    const duration = typeof detail.duration === 'number' ? detail.duration : null;

    return NextResponse.json({
        ok: true,
        videoId: getString(detail.id) || videoId,
        videoUrl: getString(detail.video_url),
        captionedVideoUrl: getString(detail.captioned_video_url),
        thumbnailUrl: getString(detail.thumbnail_url),
        subtitleUrl: getString(detail.subtitle_url),
        videoPageUrl: getString(detail.video_page_url),
        duration,
        failureCode: getString(detail.failure_code),
        failureMessage: getString(detail.failure_message),
        data,
    });
}
