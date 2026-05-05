"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        setMessage("Inscrito com sucesso! Em breve você receberá nossos conteúdos.");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Erro ao inscrever. Tente novamente.");
      }
    } catch {
      setStatus("error");
      setMessage("Erro de conexão. Tente novamente.");
    }
  }

  return (
    <section className="bg-[#003956] px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.28em] text-sky-300">
          Newsletter
        </p>
        <h2 className="mt-2 font-sans text-3xl font-bold text-white md:text-4xl">
          Conteúdo financeiro direto no seu email
        </h2>
        <p className="mt-4 text-base text-white/60">
          Receba artigos sobre crédito empresarial, gestão financeira e oportunidades para PJ. Sem spam.
        </p>

        {status === "success" ? (
          <div className="mt-8 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-6 py-5">
            <p className="font-semibold text-sky-300">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome (opcional)"
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-sky-400 focus:bg-white/15"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-sky-400 focus:bg-white/15"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-[#0099dd] px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Inscrevendo..." : "Quero receber conteúdos gratuitos"}
            </button>
            {status === "error" && <p className="text-sm text-red-400">{message}</p>}
          </form>
        )}

        <p className="mt-4 text-xs text-white/40">Pode cancelar quando quiser. Seus dados estão seguros.</p>
      </div>
    </section>
  );
}
