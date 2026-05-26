'use client';

import { useEffect, useState, useRef } from 'react';

export interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  approved: boolean;
}

interface PostEngagementProps {
  slug: string;
  initialComments: Comment[];
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getFingerprint(): string {
  const stored = localStorage.getItem('mb_fp');
  if (stored) return stored;
  const fp = generateUUID();
  localStorage.setItem('mb_fp', fp);
  return fp;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function PostEngagement({ slug, initialComments }: PostEngagementProps) {
  // ── Like state ──────────────────────────────────────────────
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(true);

  useEffect(() => {
    const fp = getFingerprint();
    fetch(`/api/blog/posts/${slug}/like?fp=${encodeURIComponent(fp)}`)
      .then((r) => r.json())
      .then((data: { count: number; liked: boolean }) => {
        setLikeCount(data.count ?? 0);
        setLiked(data.liked ?? false);
      })
      .catch(() => {})
      .finally(() => setLikeLoading(false));
  }, [slug]);

  async function handleLike() {
    const fp = getFingerprint();
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/blog/posts/${slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fp }),
      });
      const data: { count: number; liked: boolean } = await res.json();
      setLikeCount(data.count ?? 0);
      setLiked(data.liked ?? false);
    } catch {
      // silent
    } finally {
      setLikeLoading(false);
    }
  }

  // ── Comments state ───────────────────────────────────────────
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [authorInput, setAuthorInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/blog/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: authorInput, body: bodyInput }),
      });
      const data: { ok?: boolean; error?: string } = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? 'Erro ao enviar o comentário. Tente novamente.');
      } else {
        setSuccessMsg('Comentário enviado! Será publicado após moderação.');
        setAuthorInput('');
        setBodyInput('');
      }
    } catch {
      setErrorMsg('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  const likeLabel =
    likeCount === 1 ? '1 curtida' : `${likeCount} curtidas`;

  return (
    <div className="mt-10 space-y-8">
      {/* ── Like section ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          aria-label={liked ? 'Remover curtida' : 'Curtir este artigo'}
          className={[
            'flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0099dd]',
            liked
              ? 'bg-[#e6f4fb] text-[#0099dd] border border-[#0099dd]'
              : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-[#0099dd] hover:text-[#0099dd]',
            likeLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          {/* Heart SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill={liked ? '#0099dd' : 'none'}
            stroke={liked ? '#0099dd' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-150 ${liked ? 'scale-110' : 'scale-100'}`}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{likeLabel}</span>
        </button>
        <p className="text-sm text-slate-400">
          {liked ? 'Você curtiu este artigo.' : 'Gostou do artigo? Deixe sua curtida!'}
        </p>
      </div>

      {/* ── Comments section ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-[#003956] mb-6 flex items-center gap-2">
          Comentários
          {comments.length > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#e6f4fb] text-[#0099dd] text-xs font-semibold">
              {comments.length}
            </span>
          )}
        </h2>

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="text-slate-400 text-sm mb-8">
            Seja o primeiro a comentar neste artigo.
          </p>
        ) : (
          <ul className="space-y-6 mb-8">
            {[...comments]
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              )
              .map((c) => (
                <li key={c.id} className="border-b border-slate-50 pb-5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#003956] text-sm">{c.author}</span>
                    <time
                      dateTime={c.createdAt}
                      className="text-xs text-slate-400"
                    >
                      {formatDate(c.createdAt)}
                    </time>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{c.body}</p>
                </li>
              ))}
          </ul>
        )}

        {/* Comment form */}
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
          <h3 className="font-semibold text-[#003956] text-base">Deixe seu comentário</h3>

          <div>
            <label htmlFor="comment-author" className="block text-sm font-medium text-slate-700 mb-1">
              Seu nome <span className="text-red-500">*</span>
            </label>
            <input
              id="comment-author"
              type="text"
              required
              maxLength={60}
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0099dd] focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="comment-body" className="block text-sm font-medium text-slate-700 mb-1">
              Comentário <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment-body"
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              value={bodyInput}
              onChange={(e) => setBodyInput(e.target.value)}
              placeholder="Escreva seu comentário..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0099dd] focus:border-transparent transition resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{bodyInput.length}/1000</p>
          </div>

          <p className="text-xs text-slate-400">
            Comentários passam por moderação antes de aparecer.
          </p>

          {successMsg && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              {successMsg}
            </p>
          )}

          {errorMsg && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={[
              'px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003956]',
              submitting
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#003956] hover:bg-[#0099dd] cursor-pointer',
            ].join(' ')}
          >
            {submitting ? 'Enviando...' : 'Enviar comentário'}
          </button>
        </form>
      </div>
    </div>
  );
}
