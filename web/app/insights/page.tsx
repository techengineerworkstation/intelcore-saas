'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const colors = {
  brand: { 950: '#020617', 900: '#0A1628', 800: '#0F1E34', 700: '#162B44', 600: '#1E3A5F' },
  accent: { 500: '#3B82F6', 400: '#60A5FA' },
  text: { primary: '#F8FAFC', secondary: '#94A3B8', muted: '#64748B' },
};

const sidebarItems = [
  { icon: '◫', label: 'Dashboard', href: '/dashboard', active: false },
  { icon: '✦', label: 'AI Insights', href: '/insights', active: true },
  { icon: '◈', label: 'KPIs', href: '/kpis', active: false },
  { icon: '◉', label: 'Alerts', href: '/alerts', badge: 3 },
  { icon: '⊕', label: 'Sources', href: '/sources', active: false },
  { icon: '📊', label: 'Reports', href: '/reports', active: false },
];

// SoundManager
class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  private constructor() {
    if (typeof window !== 'undefined') {
      try { this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch (e) {}
    }
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) SoundManager.instance = new SoundManager();
    return SoundManager.instance;
  }

  playTone(startFreq: number, endFreq: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext) return;
    const ctx = this.audioContext, now = ctx.currentTime;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
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

  playClick() { this.playTone(800, 400, 0.08); }
  playHover() { this.playTone(600, 600, 0.03); }
}

const soundManager = SoundManager.getInstance();

// Sample AI Insights data
const insightsData = [
  { id: 1, question: 'What is our profit margin trend?', answer: 'Profit margin increased by 2.1% to 22.7%. This is driven by reduced operational costs and increased revenue per customer.', time: '2h ago' },
  { id: 2, question: 'Which department has highest cost inefficiency?', answer: 'Marketing shows 36% cost above benchmark. Recommended actions: review campaign ROI and optimize ad spend.', time: '5h ago' },
  { id: 3, question: 'What is driving revenue growth?', answer: 'Enterprise segment growing 24% YoY. Upsell opportunities in 847 accounts identified.', time: '1d ago' },
];

const aiSuggestions = [
  'Analyze customer churn risk factors',
  'Forecast next quarter revenue',
  'Identify cost optimization opportunities',
  'Compare performance across regions',
];

export default function InsightsPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(insightsData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    soundManager.playClick();
    setLoading(true);
    
    const newMessage = {
      id: Date.now(),
      question: query,
      answer: 'Analyzing your business data... This includes financial metrics, customer behavior patterns, and market trends. Expected insights generated within 2-3 seconds.',
      time: 'Just now'
    };
    
    setTimeout(() => {
      setMessages([...messages, newMessage]);
      setLoading(false);
      setQuery('');
    }, 2000);
  };

  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    soundManager.playClick();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.brand[950], fontFamily: "'Outfit', sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Animated Background */}
      <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity }} style={{ position: 'fixed', top: '-30%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Sidebar */}
      <aside style={{ width: 80, background: colors.brand[900], borderRight: `1px solid ${colors.brand[600]}30`, display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'relative', zIndex: 10 }}>
        <div style={{ padding: '0 20px', marginBottom: 32 }}>
          <motion.a href="/dashboard" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', borderRadius: 12, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)', textDecoration: 'none' }}>
            <span style={{ fontSize: 20, color: '#fff' }}>⬡</span>
          </motion.a>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px' }}>
          {sidebarItems.map((item) => (
            <motion.a key={item.label} href={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.05 }} onHoverStart={() => soundManager.playHover()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 8px', borderRadius: 12, background: item.active ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: item.active ? colors.accent[400] : colors.text.muted, textDecoration: 'none', position: 'relative' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
              {item.badge && <span style={{ position: 'absolute', top: 8, right: 12, width: 16, height: 16, background: '#EF4444', borderRadius: '50%', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{item.badge}</span>}
            </motion.a>
          ))}
        </nav>
        <motion.a href="/settings" whileHover={{ scale: 1.05 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 8px', color: colors.text.muted, textDecoration: 'none', margin: '0 12px' }}>
          <span style={{ fontSize: 20 }}>⚙</span>
          <span style={{ fontSize: 10 }}>Settings</span>
        </motion.a>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 32, position: 'relative', zIndex: 10, overflow: 'auto' }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>AI Insights</h1>
          <p style={{ color: colors.text.secondary, fontSize: 14 }}>Ask questions about your business performance</p>
        </header>

        {/* Query Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: colors.brand[800], border: `1px solid ${colors.brand[600]}30`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about revenue, costs, customers, trends..."
              style={{ flex: 1, padding: '14px 16px', background: colors.brand[700], border: `1px solid ${colors.brand[600]}`, borderRadius: 12, color: colors.text.primary, fontSize: 15, outline: 'none' }}
            />
            <motion.button type="submit" disabled={loading || !query.trim()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ padding: '14px 24px', background: loading ? 'rgba(59, 130, 246, 0.5)' : colors.accent[500], border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer' }}>
              {loading ? 'Analyzing...' : 'Ask ✦'}
            </motion.button>
          </form>

          {/* Suggestions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {aiSuggestions.map((suggestion) => (
              <motion.button key={suggestion} onClick={() => handleSuggestion(suggestion)} whileHover={{ scale: 1.02 }} style={{ padding: '8px 14px', background: colors.brand[700], border: `1px solid ${colors.brand[600]}`, borderRadius: 20, color: colors.text.secondary, fontSize: 12, cursor: 'pointer' }}>
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Insights History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ color: colors.text.primary, fontSize: 16, fontWeight: 600 }}>Recent Insights</h3>
          {messages.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: colors.brand[800], border: `1px solid ${colors.brand[600]}30`, borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ color: colors.accent[400], fontSize: 14, fontWeight: 600 }}>{msg.question}</p>
                <span style={{ color: colors.text.muted, fontSize: 12 }}>{msg.time}</span>
              </div>
              <p style={{ color: colors.text.primary, fontSize: 14, lineHeight: 1.6 }}>{msg.answer}</p>
            </motion.div>
          ))}
        </div>

        <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>
      </main>
    </div>
  );
}