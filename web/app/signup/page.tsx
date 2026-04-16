'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const colors = {
  brand: { 950: '#020617', 900: '#0A1628', 800: '#0F1E34', 700: '#162B44', 600: '#1E3A5F' },
  accent: { 500: '#3B82F6', 400: '#60A5FA' },
  text: { primary: '#F8FAFC', secondary: '#94A3B8', muted: '#64748B' },
};

// SoundManager
class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  private constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {}
    }
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  playTone(startFreq: number, endFreq: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext) return;
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    gain.gain.setValueAtTime(this.volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playClick() { this.playTone(800, 400, 0.08, 'sine'); }
  playHover() { this.playTone(600, 600, 0.03, 'sine'); }
  playSuccess() { 
    this.playTone(523, 523, 0.1, 'sine'); 
    setTimeout(() => this.playTone(659, 659, 0.1, 'sine'), 80);
    setTimeout(() => this.playTone(784, 784, 0.15, 'sine'), 160);
  }
  setEnabled(v: boolean) { this.enabled = v; }
}

const soundManager = SoundManager.getInstance();

const roles = ['CEO / Founder', 'CFO / Finance', 'COO / Operations', 'Business Analyst', 'Strategy Consultant'];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('CEO / Founder');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleNext = () => {
    soundManager.playClick();
    if (fullName && companyName) setStep(2);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  const handleGoogleAuth = () => {
    soundManager.playClick();
    setLoading(true);
    setTimeout(() => window.location.href = '/dashboard', 1500);
  };

  const handleAppleAuth = () => {
    soundManager.playClick();
    setLoading(true);
    setTimeout(() => window.location.href = '/dashboard', 1500);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.brand[950],
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: 'fixed',
          top: '-30%',
          right: '-10%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header - Logo Centered */}
      <header style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 0',
        position: 'relative',
        zIndex: 10,
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 26, color: '#fff' }}>⬡</span>
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.text.primary,
            }}
          >
            IntelCore SaaS
          </motion.span>
        </motion.div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        position: 'relative',
        zIndex: 10,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <div style={{
            background: colors.brand[800],
            border: `1px solid ${colors.brand[600]}40`,
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}>
            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: step >= 1 ? colors.accent[500] : colors.brand[600] }} />
              <div style={{ width: 40, height: 2, background: step >= 2 ? colors.accent[500] : colors.brand[600] }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: step >= 2 ? colors.accent[500] : colors.brand[600] }} />
            </div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: 4,
              }}
            >
              {step === 1 ? 'Create Account' : 'Set Up Login'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                color: colors.text.secondary, 
                fontSize: 14, 
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              {step === 1 ? 'Tell us about yourself' : 'Choose how you sign in'}
            </motion.p>

            {step === 1 ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      color: colors.text.muted,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 8,
                    }}>Full Name</label>
                    <motion.input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => { setFocused('fullName'); soundManager.playHover(); }}
                      onBlur={() => setFocused('')}
                      placeholder="Your name"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: colors.brand[700],
                        border: `1px solid ${focused === 'fullName' ? colors.accent[500] : colors.brand[600]}`,
                        borderRadius: 12,
                        color: colors.text.primary,
                        fontSize: 15,
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      color: colors.text.muted,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 8,
                    }}>Company Name</label>
                    <motion.input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      onFocus={() => { setFocused('companyName'); soundManager.playHover(); }}
                      onBlur={() => setFocused('')}
                      placeholder="Company name"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: colors.brand[700],
                        border: `1px solid ${focused === 'companyName' ? colors.accent[500] : colors.brand[600]}`,
                        borderRadius: 12,
                        color: colors.text.primary,
                        fontSize: 15,
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      color: colors.text.muted,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 8,
                    }}>Your Role</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {roles.map((r) => (
                        <motion.button
                          key={r}
                          type="button"
                          onClick={() => { setRole(r); soundManager.playClick(); }}
                          whileHover={{ scale: 1.02 }}
                          style={{
                            padding: '8px 14px',
                            background: role === r ? 'rgba(59, 130, 246, 0.2)' : colors.brand[700],
                            border: `1px solid ${role === r ? colors.accent[500] : colors.brand[600]}`,
                            borderRadius: 20,
                            color: role === r ? colors.accent[400] : colors.text.secondary,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {r}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.button
                  type="button"
                  onClick={handleNext}
                  disabled={!fullName || !companyName}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: (!fullName || !companyName) ? 'rgba(59, 130, 246, 0.5)' : colors.accent[500],
                    border: 'none',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: (fullName && companyName) ? 'pointer' : 'default',
                    marginTop: 24,
                  }}
                >
                  Continue →
                </motion.button>
              </>
            ) : (
              <>
                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', color: colors.text.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Email</label>
                    <motion.input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => { setFocused('email'); soundManager.playHover(); }}
                      onBlur={() => setFocused('')}
                      placeholder="you@company.com"
                      style={{ width: '100%', padding: '14px 16px', background: colors.brand[700], border: `1px solid ${focused === 'email' ? colors.accent[500] : colors.brand[600]}`, borderRadius: 12, color: colors.text.primary, fontSize: 15, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: colors.text.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
                    <motion.input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => { setFocused('password'); soundManager.playHover(); }}
                      onBlur={() => setFocused('')}
                      placeholder="Min 8 characters"
                      style={{ width: '100%', padding: '14px 16px', background: colors.brand[700], border: `1px solid ${focused === 'password' ? colors.accent[500] : colors.brand[600]}`, borderRadius: 12, color: colors.text.primary, fontSize: 15, outline: 'none' }}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading || !email || !password}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: '100%', padding: '14px 24px', background: (!email || !password) ? 'rgba(59, 130, 246, 0.5)' : colors.accent[500], border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 600, cursor: (email && password) ? 'pointer' : 'default' }}
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </motion.button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
                  <div style={{ flex: 1, height: 1, background: colors.brand[600] }} />
                  <span style={{ color: colors.text.muted, fontSize: 12 }}>or</span>
                  <div style={{ flex: 1, height: 1, background: colors.brand[600] }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                  <motion.button type="button" onClick={handleGoogleAuth} whileHover={{ scale: 1.02 }} style={{ width: '100%', padding: '12px 16px', background: colors.brand[700], border: `1px solid ${colors.brand[600]}`, borderRadius: 12, color: colors.text.primary, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.772 2.717l2.909 1.93c.846-1.835 1.3-3.891 1.3-6.288z"/><path fill="#34A853" d="M9 18c1.498 0 2.733-.497 3.647-1.34l-2.91-1.93c-.497.333-1.136.533-1.737.533-1.337 0-2.47-.904-2.879-2.117l-2.914 1.931C3.216 16.347 5.907 18 9 18z"/><path fill="#FBBC05" d="M5.373 10.267c-.202-.601-.314-1.239-.314-2.267s.112-1.666.314-2.267l-.006-.061L2.82 5.16c-.656.437-1.028 1.072-1.028 1.84s.372 1.403 1.028 1.84l2.553.053z"/><path fill="#EA4335" d="M9 3.582c.772 0 1.467.265 2.012.785l2.56-2.56C12.732.916 11.498 0 9 0 5.907 0 3.216 1.653 2.053 4.267l2.914 1.931C5.53 4.498 6.663 3.582 9 3.582z"/></svg>
                    Continue with Google
                  </motion.button>
                  <motion.button type="button" onClick={handleAppleAuth} whileHover={{ scale: 1.02 }} style={{ width: '100%', padding: '12px 16px', background: '#000', border: '1px solid #333', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    Continue with Apple
                  </motion.button>
                </div>

                <p style={{ textAlign: 'center', marginTop: 24, color: colors.text.secondary, fontSize: 14 }}>
                  Already have an account? <Link href="/login" style={{ color: colors.accent[400], textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </main>

      <footer style={{ textAlign: 'center', padding: 16, color: colors.text.muted, fontSize: 12, position: 'relative', zIndex: 10 }}>
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </footer>

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>
    </div>
  );
}