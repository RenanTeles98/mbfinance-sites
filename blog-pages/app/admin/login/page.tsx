'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);
    const router = useRouter();

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
                    <div style={{ marginBottom: '20px' }}>
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
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            required
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '14px 16px',
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
                        {error && (
                            <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>
                                {error}
                            </div>
                        )}
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
