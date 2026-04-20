"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { BlogPost } from "@/types/blog";
import type { Subscriber, Campaign } from "@/types/newsletter";

const DEFAULT_TOKEN = "mbfinance2025";
const TOKEN_STORAGE_KEY = "mb_blog_admin_token";

const categoryOptions = [
  { value: "credito", label: "Credito Empresarial" },
  { value: "gestao", label: "Gestao Financeira" },
  { value: "conta-pj", label: "Conta PJ" },
  { value: "mercado", label: "Mercado" },
  { value: "antecipacao", label: "Antecipacao" },
  { value: "noticias", label: "Noticias" },
];

type DraftPost = BlogPost;

function createEmptyPost(): DraftPost {
  return {
    id: crypto.randomUUID(),
    title: "",
    slug: "",
    category: "credito",
    categoryLabel: "Credito Empresarial",
    excerpt: "",
    image: "",
    content: "<p></p>",
    readTime: "5 min",
    date: new Date().toISOString().slice(0, 10),
    featured: false,
    published: true,
    seoTitle: "",
    seoDesc: "",
    keywords: "",
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 90);
}

function categoryLabel(category: string) {
  return categoryOptions.find((item) => item.value === category)?.label || category;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Newsletter Section ────────────────────────────────────────────────────

function NewsletterSection({ token }: { token: string }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<"send" | "history">("send");

  // Add subscriber form
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Compose campaign
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribers", {
        headers: { "x-blog-admin-token": token },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers || []);
        setCampaigns(data.campaigns || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleAddSubscriber(e: FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddMsg("");
    const res = await fetch("/api/newsletter/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-blog-admin-token": token },
      body: JSON.stringify({ email: newEmail, name: newName }),
    });
    const data = await res.json();
    if (data.ok) {
      setNewEmail("");
      setNewName("");
      setAddMsg("Inscrito adicionado!");
      await loadAll();
    } else {
      setAddMsg(data.error || "Erro ao adicionar");
    }
    setAdding(false);
    setTimeout(() => setAddMsg(""), 3000);
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Remover ${email}?`)) return;
    await fetch(`/api/newsletter/subscribers?id=${id}`, {
      method: "DELETE",
      headers: { "x-blog-admin-token": token },
    });
    await loadAll();
  }

  async function handleSendCampaign() {
    const activeCount = subscribers.filter((s) => s.active).length;
    if (!confirm(`Enviar campanha para ${activeCount} inscrito(s)?`)) return;

    setSending(true);
    setSendResult(null);

    const res = await fetch("/api/newsletter/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-blog-admin-token": token },
      body: JSON.stringify({ subject, previewText, body: emailBody }),
    });
    const data = await res.json();

    if (data.ok) {
      setSendResult({ ok: true, text: `Enviado para ${data.sent} inscrito(s)!${data.failed ? ` (${data.failed} falhas)` : ""}` });
      setSubject("");
      setPreviewText("");
      setEmailBody("");
      await loadAll();
    } else {
      setSendResult({ ok: false, text: data.error || "Erro ao enviar" });
    }
    setSending(false);
  }

  const activeCount = subscribers.filter((s) => s.active).length;
  const filtered = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* Sidebar: inscritos */}
      <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-sky-600">Inscritos</p>
          <div className="mt-2 flex gap-3">
            <div className="flex-1 rounded-xl bg-slate-50 p-3 text-center">
              <p className="text-2xl font-black text-[#003956]">{subscribers.length}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
            <div className="flex-1 rounded-xl bg-sky-50 p-3 text-center">
              <p className="text-2xl font-black text-sky-600">{activeCount}</p>
              <p className="text-xs text-slate-500">Ativos</p>
            </div>
          </div>
        </div>

        {/* Adicionar inscrito */}
        <form onSubmit={handleAddSubscriber} className="mb-4 space-y-2 border-b border-slate-100 pb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Adicionar manualmente</p>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email@empresa.com"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome (opcional)"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={adding}
            className="w-full rounded-xl bg-[#003956] py-2 text-sm font-bold text-white transition hover:bg-sky-600 disabled:opacity-60"
          >
            {adding ? "Adicionando..." : "Adicionar"}
          </button>
          {addMsg && (
            <p className={`text-xs font-semibold ${addMsg.includes("Erro") || addMsg.includes("já") ? "text-red-500" : "text-green-600"}`}>
              {addMsg}
            </p>
          )}
        </form>

        {/* Busca */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar inscrito..."
          className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />

        {/* Lista */}
        {loading ? (
          <p className="text-sm text-slate-400 text-center py-4">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Nenhum inscrito ainda.</p>
        ) : (
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {filtered.map((sub) => (
              <div
                key={sub.id}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 ${sub.active ? "bg-white border border-slate-100" : "bg-slate-50 opacity-60"}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#003956]">{sub.email}</p>
                  <p className="text-[11px] text-slate-400">
                    {sub.name || "Sem nome"} · {sub.active ? "Ativo" : "Cancelado"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(sub.id, sub.email)}
                  className="shrink-0 text-slate-300 transition hover:text-red-500 text-lg leading-none"
                  title="Remover"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main: compor e histórico */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Sub-tabs */}
        <div className="mb-6 flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
          {(["send", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`rounded-xl px-5 py-2 text-sm font-bold transition ${
                subTab === tab ? "bg-white text-[#003956] shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "send" ? "Novo Disparo" : "Histórico"}
            </button>
          ))}
        </div>

        {subTab === "send" && (
          <div className="space-y-5">
            {/* Aviso se Resend não configurado */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              <strong>Configure antes de disparar:</strong> adicione as variáveis{" "}
              <code className="rounded bg-amber-100 px-1 font-mono text-xs">RESEND_API_KEY</code> e{" "}
              <code className="rounded bg-amber-100 px-1 font-mono text-xs">RESEND_FROM_EMAIL</code> nas configurações da Vercel.
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-sky-50 px-5 py-3">
              <span className="text-2xl font-black text-sky-600">{activeCount}</span>
              <span className="text-sm text-slate-600">
                inscrito(s) ativo(s) receberão este email
              </span>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Assunto *</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: 5 formas de conseguir crédito mais barato em 2026"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Texto de prévia</span>
              <input
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Aparece na caixa de entrada antes de abrir o email..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Conteúdo do email (HTML) *</span>
              <p className="mb-2 text-xs text-slate-400">
                Use HTML básico: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;a href=&quot;...&quot;&gt;
              </p>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={14}
                placeholder="<h2>Olá!</h2><p>Conteúdo do email aqui...</p>"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-sky-500"
              />
            </label>

            {sendResult && (
              <div
                className={`rounded-2xl px-5 py-4 text-sm font-semibold ${
                  sendResult.ok
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {sendResult.text}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSendCampaign}
                disabled={sending || !subject.trim() || !emailBody.trim()}
                className="rounded-xl bg-[#003956] px-8 py-3 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Enviando..." : `Disparar para ${activeCount} inscrito(s)`}
              </button>
            </div>
          </div>
        )}

        {subTab === "history" && (
          <div>
            {campaigns.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
                Nenhuma campanha enviada ainda.
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#003956]">{camp.subject}</p>
                        {camp.previewText && (
                          <p className="mt-1 text-sm text-slate-500">{camp.previewText}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="inline-block rounded-xl bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                          {camp.recipientCount} enviados
                        </span>
                        <p className="mt-1 text-xs text-slate-400">{formatDate(camp.sentAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Main Admin App ────────────────────────────────────────────────────────

export default function BlogAdminApp() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPost | null>(null);
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [status, setStatus] = useState("Carregando posts...");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "newsletter">("posts");

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    loadPosts();
  }, []);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedId) || null,
    [posts, selectedId]
  );

  async function loadPosts() {
    setStatus("Carregando posts...");
    const response = await fetch("/api/blog/posts", { cache: "no-store" });
    const data = await response.json();
    const nextPosts = Array.isArray(data.posts) ? data.posts : [];
    setPosts(nextPosts);
    if (nextPosts.length) {
      setSelectedId((current) => current || nextPosts[0].id);
      setDraft((current) => current || nextPosts[0]);
    } else {
      const empty = createEmptyPost();
      setSelectedId(empty.id);
      setDraft(empty);
    }
    setStatus(`${nextPosts.length} post(s) carregado(s)`);
  }

  function selectPost(post: BlogPost) {
    setSelectedId(post.id);
    setDraft(post);
  }

  function handleNewPost() {
    const empty = createEmptyPost();
    setSelectedId(empty.id);
    setDraft(empty);
    setStatus("Novo rascunho criado");
  }

  function updateDraft<K extends keyof DraftPost>(field: K, value: DraftPost[K]) {
    if (!draft) return;
    const next = { ...draft, [field]: value };
    if (field === "title") {
      next.slug = slugify(String(value));
      next.seoTitle = next.seoTitle || String(value);
    }
    if (field === "category") {
      next.categoryLabel = categoryLabel(String(value));
    }
    setDraft(next);
  }

  async function savePosts(nextPosts: BlogPost[]) {
    setSaving(true);
    setStatus("Publicando no blog oficial...");
    const response = await fetch("/api/blog/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-blog-admin-token": token,
      },
      body: JSON.stringify({ posts: nextPosts }),
    });

    if (!response.ok) {
      setSaving(false);
      setStatus("Falha ao publicar. Verifique o token.");
      return;
    }

    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setPosts(nextPosts);
    setSaving(false);
    setStatus("Publicado com sucesso no blog oficial");
  }

  async function handleSave() {
    if (!draft) return;
    const normalized = {
      ...draft,
      slug: slugify(draft.slug || draft.title),
      categoryLabel: categoryLabel(draft.category),
    };

    const exists = posts.some((post) => post.id === normalized.id);
    const nextPosts = exists
      ? posts.map((post) => (post.id === normalized.id ? normalized : post))
      : [normalized, ...posts];

    setDraft(normalized);
    setSelectedId(normalized.id);
    await savePosts(nextPosts);
  }

  async function handleDelete() {
    if (!draft) return;
    if (!posts.some((post) => post.id === draft.id)) {
      setDraft(createEmptyPost());
      return;
    }

    const confirmed = window.confirm(`Excluir "${draft.title}"?`);
    if (!confirmed) return;

    const nextPosts = posts.filter((post) => post.id !== draft.id);
    const fallback = nextPosts[0] || createEmptyPost();
    setDraft(fallback);
    setSelectedId(fallback.id);
    await savePosts(nextPosts);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-[#003956] px-6 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-300">Blog Admin</p>
              <h1 className="mt-1 text-2xl font-black">Painel oficial do blog</h1>
            </div>
            {/* Tab switcher */}
            <div className="flex gap-1 rounded-2xl bg-white/10 p-1">
              {(["posts", "newsletter"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-5 py-2 text-sm font-bold transition ${
                    activeTab === tab
                      ? "bg-white text-[#003956]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {tab === "posts" ? "Posts" : "Newsletter"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="w-52 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40"
              placeholder="Token do painel"
            />
            <a
              href="/blog"
              target="_blank"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Ver blog
            </a>
          </div>
        </div>
      </div>

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-sky-600">Posts</p>
                <p className="mt-1 text-sm text-slate-500">{status}</p>
              </div>
              <button
                onClick={handleNewPost}
                className="rounded-xl bg-[#003956] px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-600"
              >
                Novo
              </button>
            </div>

            <div className="space-y-2">
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => selectPost(post)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedId === post.id
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-bold text-[#003956]">{post.title}</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <span>{post.categoryLabel}</span>
                    <span>{post.published ? "Publicado" : "Rascunho"}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {draft ? (
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Titulo</span>
                    <input
                      value={draft.title}
                      onChange={(event) => updateDraft("title", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Slug</span>
                    <input
                      value={draft.slug}
                      onChange={(event) => updateDraft("slug", slugify(event.target.value))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                    />
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-4">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Categoria</span>
                    <select
                      value={draft.category}
                      onChange={(event) => updateDraft("category", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Data</span>
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(event) => updateDraft("date", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Tempo de leitura</span>
                    <input
                      value={draft.readTime}
                      onChange={(event) => updateDraft("readTime", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Resumo</span>
                  <textarea
                    value={draft.excerpt}
                    onChange={(event) => updateDraft("excerpt", event.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Imagem de capa</span>
                  <input
                    value={draft.image}
                    onChange={(event) => updateDraft("image", event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Conteudo HTML
                  </span>
                  <textarea
                    value={draft.content}
                    onChange={(event) => updateDraft("content", event.target.value)}
                    rows={18}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <div className="grid gap-5 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">SEO title</span>
                    <input
                      value={draft.seoTitle || ""}
                      onChange={(event) => updateDraft("seoTitle", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-bold text-slate-700">SEO description</span>
                    <input
                      value={draft.seoDesc || ""}
                      onChange={(event) => updateDraft("seoDesc", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Keywords</span>
                  <input
                    value={draft.keywords || ""}
                    onChange={(event) => updateDraft("keywords", event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-slate-50 px-5 py-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={draft.featured}
                      onChange={(event) => updateDraft("featured", event.target.checked)}
                    />
                    Destaque
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={draft.published}
                      onChange={(event) => updateDraft("published", event.target.checked)}
                    />
                    Publicado
                  </label>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    onClick={handleDelete}
                    className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    Excluir
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-[#003956] px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Publicando..." : "Salvar e publicar"}
                  </button>
                </div>

                {selectedPost ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-sky-600">
                      Preview rapido
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-black text-[#003956]">
                      {draft.title || "Titulo do artigo"}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                      {draft.excerpt || "O resumo do artigo aparece aqui."}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>
      )}

      {/* Newsletter Tab */}
      {activeTab === "newsletter" && <NewsletterSection token={token} />}
    </main>
  );
}
