import { NextResponse } from "next/server";
import { readSubscribers, writeSubscribers } from "@/lib/newsletter-store";
import type { Subscriber } from "@/types/newsletter";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Email inválido" }, { status: 400 });
    }

    const subscribers = await readSubscribers();

    const existing = subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      if (existing.active) {
        return NextResponse.json({ ok: false, error: "Email já cadastrado" }, { status: 400 });
      }
      // Reativar inscrito que tinha cancelado
      const updated = subscribers.map((s) =>
        s.id === existing.id ? { ...s, active: true } : s
      );
      await writeSubscribers(updated);
      return NextResponse.json({ ok: true });
    }

    const newSub: Subscriber = {
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      name: name?.trim() || "",
      createdAt: new Date().toISOString(),
      active: true,
      tags: [],
    };

    await writeSubscribers([...subscribers, newSub]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}
