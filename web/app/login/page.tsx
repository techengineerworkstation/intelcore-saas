'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const colors = {
  brand: { 950: '#020617', 900: '#0A1628', 800: '#0F1E34', 700: '#162B44', 600: '#1E3A5F' },
  accent: { 500: '#3B82F6', 400: '#60A5FA', 300: '#93C5FD' },
  text: { primary: '#F8FAFC', secondary: '#94A3B8', muted: '#64748B' },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => window.location.href = '/dashboard', 1500);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.brand[950],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-20%',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-40%',
          left: '-20%',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
        }} />
        {/* Grid Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${colors.brand[700]}15 1px, transparent 1px),
                           linear-gradient(90deg, ${colors.brand[700]}15 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }} />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          textDecoration: 'none',
        }}
      >
        <div style={{
          width: 44,
          height: 44,
          background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)',
        }}>
          <span style={{ fontSize: 22, color: '#fff' }}>⬡</span>
        </div>
        <span style={{ fontSize: 22, fontWeight: 700, color: colors.text.primary }}>
          IntelCore SaaS
        </span>
      </motion.div>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          width: '100%',
          maxWidth: 400,
          padding: 32,
        }}
      >
        <div style={{
          background: colors.brand[800],
          border: `1px solid ${colors.brand[600]}40`,
          borderRadius: 24,
          padding: 32,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}>
          <h1 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: colors.text.primary,
            marginBottom: 4,
          }}>Welcome back</h1>
          <p style={{ color: colors.text.secondary, fontSize: 14, marginBottom: 28 }}>
            Sign in to your performance dashboard
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email Input */}
            <div>
              <label style={{
                display: 'block',
                color: colors.text.muted,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                placeholder="you@company.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: colors.brand[700],
                  border: `1px solid ${focused === email ? colors.accent[500] : colors.brand[600]}`,
                  borderRadius: 12,
                  color: colors.text.primary,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{
                display: 'block',
                color: colors.text.muted,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: colors.brand[700],
                  border: `1px solid ${focused === password ? colors.accent[500] : colors.brand[600]}`,
                  borderRadius: 12,
                  color: colors.text.primary,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: loading ? 'rgba(59, 130, 246, 0.7)' : colors.accent[500],
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                  Signing in...
                </>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 24,
            marginBottom: 24,
          }}>
            <div style={{ flex: 1, height: 1, background: colors.brand[600] }} />
            <span style={{ color: colors.text.muted, fontSize: 12 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: colors.brand[600] }} />
          </div>

          {/* OAuth Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button style={{
              width: '100%',
              padding: '12px 16px',
              background: colors.brand[700],
              border: `1px solid ${colors.brand[600]}`,
              borderRadius: 12,
              color: colors.text.primary,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'all 0.2s ease',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.772 2.717l2.909 1.93c.846-1.835 1.3-3.891 1.3-6.288z"/>
                <path fill="#34A853" d="M9 18c1.498 0 2.733-.497 3.647-1.34l-2.91-1.93c-.497.333-1.136.533-1.737.533-1.337 0-2.47-.904-2.879-2.117l-2.914 1.931C3.216 16.347 5.907 18 9 18z"/>
                <path fill="#FBBC05" d="M5.373 10.267c-.202-.601-.314-1.239-.314-2.267s.112-1.666.314-2.267l-.006-.061L2.82 5.16c-.656.437-1.028 1.072-1.028 1.84s.372 1.403 1.028 1.84l2.553.053z"/>
                <path fill="#EA4335" d="M9 3.582c.772 0 1.467.265 2.012.785l2.56-2.56C12.732.916 11.498 0 9 0 5.907 0 3.216 1.653 2.053 4.267l2.914 1.931C5.53 4.498 6.663 3.582 9 3.582z"/>
              </svg>
              Continue with Google
            </button>
            <button style={{
              width: '100%',
              padding: '12px 16px',
              background: '#000',
              border: '1px solid #333',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.67-.8-3.1-.8-1.4 0-1.9.78-3.08.78-1.37 0-2.22-.82-3.63-.84-1.73-.03-3.15 1.03-3.96 2.53-1.61 2.97-1.16 7.25.38 9.27 1.05 1.4 2.35 1.52 3.2 1.52 1.4 0 1.73-.97 3.14-.97s1.73.97 3.14.97c.9 0 2.15-.16 3.24-1.5.96-1.18 1.27-2.44 1.28-2.6.02-.7.6-1.1 1.46-1.17.63-.04 1.13.37 1.5.75.64.67.76 1.6.77 1.6l.02.02c-.05-2.6-.38-4.5-2.17-6.3z"/>
                <path d="M12.46 6.5c.92-.12 1.72-.7 2.03-1.5-.1-.6-.47-1.1-.97-1.4-.64-.4-1.4-.54-2.14-.3-.56.2-.96.68-1.18 1.27.06.67.56 1.23 1.26 1.57v.36z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Signup Link */}
          <p style={{ 
            textAlign: 'center', 
            marginTop: 24, 
            color: colors.text.secondary, 
            fontSize: 14,
          }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: colors.accent[400], textDecoration: 'none', fontWeight: 500 }}>
              Create one
            </a>
          </p>
        </div>

        {/* Footer */}
        <p style={{ 
          textAlign: 'center', 
          marginTop: 24, 
          color: colors.text.muted, 
          fontSize: 12,
        }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #64748B; }
        button:hover { background: #2563EB !important; }
      `}</style>
    </div>
  );
}