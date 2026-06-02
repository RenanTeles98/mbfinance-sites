'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const bgStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #002840 0%, #003956 60%, #004d73 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: '20px',
};

const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
};

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const prefillEmail = searchParams.get('email') ?? '';

    const [email,       setEmail]       = useState(prefillEmail);
    const [code,        setCode]        = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm,     setConfirm]     = useState('');
    const [showNew,     setShowNew]     = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState('');
    const [success,     setSuccess]     = useState(false);
    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');

        if (newPassword !== confirm) {
            setError('As senhas não coincidem.');
            return;
        }
        if (newPassword.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }

        setLoading(true);

        const res = await fetch('/api/admin/reset-password', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email: email.trim(), code: code.trim().toUpperCase(), newPassword }),
        });

        if (res.ok) {
            setSuccess(true);
            setTimeout(() => router.push('/admin/login'), 3000);
        } else {
            const data = await res.json().catch(() => ({}));
            setError(data.error || 'Código inválido ou expirado. Solicite um novo código.');
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div style={bgStyle}>
                <div style={cardStyle}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>
                            Senha atualizada!
                        </h3>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                            Sua senha foi redefinida com sucesso. Redirecionando para o login...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={bgStyle}>
            <div style={cardStyle}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '28px', fontWeight: '900', color: '#003956' }}>mb</span>
                        <span style={{ fontSize: '28px', fontWeight: '900', color: '#0099dd' }}>negócios.</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Nova senha
                    </div>
                </div>

                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
                    Insira o código de 6 dígitos enviado para o seu e-mail e escolha uma nova senha.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* E-mail (oculto se veio via query param) */}
                    {!prefillEmail && (
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = '#0099dd'; e.target.style.background = '#fff'; }}
                                onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                            />
                        </div>
                    )}

                    {/* Código */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Código recebido por e-mail</label>
                        <input
                            type="text"
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                            placeholder="Ex: A3KZ7M"
                            required
                            maxLength={6}
                            autoFocus
                            style={{
                                ...inputStyle,
                                fontSize: '20px',
                                letterSpacing: '6px',
                                fontWeight: '700',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                            }}
                            onFocus={e => { e.target.style.borderColor = '#0099dd'; e.target.style.background = '#fff'; }}
                            onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                        />
                    </div>

                    {/* Nova senha */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Nova senha</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                required
                                style={{ ...inputStyle, paddingRight: '48px' }}
                                onFocus={e => { e.target.style.borderColor = '#0099dd'; e.target.style.background = '#fff'; }}
                                onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                            />
                            <EyeButton show={showNew} onToggle={() => setShowNew(v => !v)} />
                        </div>
                    </div>

                    {/* Confirmar senha */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Confirmar nova senha</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                placeholder="Repita a senha"
                                required
                                style={{
                                    ...inputStyle,
                                    paddingRight: '48px',
                                    borderColor: confirm && confirm !== newPassword ? '#ef4444' : undefined,
                                }}
                                onFocus={e => { e.target.style.borderColor = '#0099dd'; e.target.style.background = '#fff'; }}
                                onBlur={e  => { e.target.style.borderColor = confirm && confirm !== newPassword ? '#ef4444' : '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                            />
                            <EyeButton show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                        </div>
                        {confirm && confirm !== newPassword && (
                            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>As senhas não coincidem.</div>
                        )}
                    </div>

                    {error && (
                        <div style={{
                            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
                            padding: '10px 14px', fontSize: '13px', color: '#ef4444', marginBottom: '16px',
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !code || !newPassword || !confirm}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading || !code || !newPassword || !confirm ? '#94a3b8' : 'linear-gradient(135deg, #003956, #0099dd)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: loading || !code || !newPassword || !confirm ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.2s',
                            letterSpacing: '0.3px',
                        }}
                    >
                        {loading ? 'Salvando...' : 'Definir nova senha'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a
                        href="/admin/forgot-password"
                        style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#0099dd')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                    >
                        ← Solicitar novo código
                    </a>
                </div>
            </div>
        </div>
    );
}

// Shared styles
const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#1e293b',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    background: '#f8fafc',
};

function EyeButton({ show, onToggle }: { show: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            title={show ? 'Ocultar senha' : 'Ver senha'}
            style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0099dd')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
        >
            {show ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            )}
        </button>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div style={{ ...bgStyle, color: '#fff', fontSize: '14px' }}>Carregando...</div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
