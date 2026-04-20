import { NextResponse } from "next/server";
import { readSubscribers, writeSubscribers, readCampaigns } from "@/lib/newsletter-store";
import type { Subscriber } from "@/types/newsletter";

const ADMIN_TOKEN = process.env.BLOG_ADMIN_TOKEN || "mbfinance2026";

function authorized(request: Request): boolean {
  return request.headers.get("x-blog-admin-token") === ADMIN_TOKEN;
}

// GET: lista inscritos + campanhas
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [subscribers, campaigns] = await Promise.all([readSubscribers(), readCampaigns()]);
  return NextResponse.json({ subscribers, campaigns });
}

// POST: adicionar inscrito manualmente
export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, name, tags } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Email inválido" }, { status: 400 });
  }

  const subscribers = await readSubscribers();

  if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase().trim())) {
    return NextResponse.json({ ok: false, error: "Email já cadastrado" }, { status: 400 });
  }

  const newSub: Subscriber = {
    id: crypto.randomUUID(),
    email: email.toLowerCase().trim(),
    name: name?.trim() || "",
    createdAt: new Date().toISOString(),
    active: true,
    tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
  };

  await writeSubscribers([...subscribers, newSub]);
  return NextResponse.json({ ok: true, subscriber: newSub });
}

// PATCH: atualizar tags de um inscrito
export async function PATCH(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, tags } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  const subscribers = await readSubscribers();
  const updated = subscribers.map((s) =>
    s.id === id ? { ...s, tags: Array.isArray(tags) ? tags : [] } : s
  );
  await writeSubscribers(updated);
  return NextResponse.json({ ok: true });
}

// DELETE: remover inscrito por ID
export async function DELETE(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  const subscribers = await readSubscribers();
  await writeSubscribers(subscribers.filter((s) => s.id !== id));
  return NextResponse.json({ ok: true });
}
