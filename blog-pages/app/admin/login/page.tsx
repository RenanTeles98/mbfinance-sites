'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const REMEMBER_KEY = 'mb_admin_saved_pass';

export default function AdminLoginPage() {
    const [password,    setPassword]    = useState('');
    const [showPass,    setShowPass]    = useState(false);
    const [remember,    setRemember]    = useState(false);
    const [error,       setError]       = useState('');
    const [loading,     setLoading]     = useState(false);
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem(REMEMBER_KEY);
        if (saved) {
            setPassword(saved);
            setRemember(true);
        }
    }, []);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/admin/login', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ password }),
        });

        if (res.ok) {
            if (remember) {
                localStorage.setItem(REMEMBER_KEY, password);
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }
            router.push('/admin');
        } else {
            const data = await res.json().catch(() => ({}));
            setError(data.error || 'Senha incorreta');
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #002840 0%, #003956 60%, #004d73 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            padding: '20px',
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '48px 40px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '28px', fontWeight: '900', color: '#003956' }}>mb</span>
                        <span style={{ fontSize: '28px', fontWeight: '900', color: '#0099dd' }}>negócios.</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Painel administrativo
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                            marginBottom: '8px',
                        }}>
                            Senha de acesso
                        </label>

                        {/* Input + toggle wrapper */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                required
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '14px 48px 14px 16px',
                                    border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    color: '#1e293b',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box',
                                    background: '#f8fafc',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#0099dd'; e.target.style.background = '#fff'; }}
                                onBlur={e  => { e.target.style.borderColor = error ? '#ef4444' : '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                            />
                            {/* Botão ver/ocultar senha */}
                            <button
                                type="button"
                                onClick={() => setShowPass(v => !v)}
                                title={showPass ? 'Ocultar senha' : 'Ver senha'}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    color: '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#0099dd')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                            >
                                {showPass ? (
                                    /* Olho fechado */
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                ) : (
                                    /* Olho aberto */
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                        {error && (
                            <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Lembrar senha + Esqueceu a senha */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={e => setRemember(e.target.checked)}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    accentColor: '#0099dd',
                                    cursor: 'pointer',
                                }}
                            />
                            <span style={{ fontSize: '13px', color: '#64748b', userSelect: 'none' }}>Lembrar senha</span>
                        </label>

                        <a
                            href="/admin/forgot-password"
                            style={{
                                fontSize: '13px',
                                color: '#0099dd',
                                textDecoration: 'none',
                                fontWeight: '500',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                        >
                            Esqueceu a senha?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !password}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading || !password ? '#94a3b8' : 'linear-gradient(135deg, #003956, #0099dd)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: loading || !password ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.2s',
                            letterSpacing: '0.3px',
                        }}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    padding: '12px 16px',
                    background: '#f0f9ff',
                    borderRadius: '10px',
                    border: '1px solid #bae6fd',
                    fontSize: '12px',
                    color: '#0369a1',
                    textAlign: 'center',
                    lineHeight: '1.5',
                }}>
                    Sessão expira em 8 horas por segurança.
                </div>
            </div>
        </div>
    );
}
