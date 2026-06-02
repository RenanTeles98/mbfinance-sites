'use client';

import { useState, FormEvent } from 'react';

type Step = 'email' | 'sent';

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

export default function ForgotPasswordPage() {
    const [step,    setStep]    = useState<Step>('email');
    const [email,   setEmail]   = useState('');
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        await fetch('/api/admin/forgot-password', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email: email.trim() }),
        });

        // Resposta sempre "ok" para não revelar se o e-mail existe
        setLoading(false);
        setStep('sent');
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
                        Redefinir senha
                    </div>
                </div>

                {step === 'email' ? (
                    <>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
                            Informe o e-mail cadastrado no painel. Vamos enviar um código de 6 dígitos para você criar uma nova senha.
                        </p>

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
                                    E-mail de acesso
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
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
                                        boxSizing: 'border-box',
                                        background: '#f8fafc',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#0099dd'; e.target.style.background = '#fff'; }}
                                    onBlur={e  => { e.target.style.borderColor = error ? '#ef4444' : '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                                />
                                {error && (
                                    <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{error}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    background: loading || !email ? '#94a3b8' : 'linear-gradient(135deg, #003956, #0099dd)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    cursor: loading || !email ? 'not-allowed' : 'pointer',
                                    transition: 'opacity 0.2s',
                                    letterSpacing: '0.3px',
                                }}
                            >
                                {loading ? 'Enviando...' : 'Enviar código'}
                            </button>
                        </form>
                    </>
                ) : (
                    /* Passo 2: código enviado */
                    <>
                        <div style={{
                            width: '56px', height: '56px', background: '#f0fdf4', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', textAlign: 'center', marginBottom: '12px' }}>
                            Verifique seu e-mail
                        </h3>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', textAlign: 'center', marginBottom: '28px' }}>
                            Se o endereço <strong style={{ color: '#003956' }}>{email}</strong> estiver cadastrado, você receberá um código em instantes.
                        </p>

                        <a
                            href={`/admin/reset-password?email=${encodeURIComponent(email)}`}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '14px',
                                background: 'linear-gradient(135deg, #003956, #0099dd)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                letterSpacing: '0.3px',
                                textAlign: 'center',
                                textDecoration: 'none',
                                boxSizing: 'border-box',
                            }}
                        >
                            Inserir o código
                        </a>
                    </>
                )}

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a
                        href="/admin/login"
                        style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#0099dd')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                    >
                        ← Voltar para o login
                    </a>
                </div>
            </div>
        </div>
    );
}
