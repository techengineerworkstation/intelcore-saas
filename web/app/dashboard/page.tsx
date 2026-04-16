'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// SoundManager - Web Audio API for UI sounds
class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {}
  }

  playClick() { this.playTone(800, 400, 0.08, 'sine'); }
  playHover() { this.playTone(600, 600, 0.03, 'sine'); }
  playSuccess() { 
    this.playTone(523, 523, 0.1, 'sine'); 
    setTimeout(() => this.playTone(659, 659, 0.1, 'sine'), 80);
    setTimeout(() => this.playTone(784, 784, 0.15, 'sine'), 160);
  }
  playError() { this.playTone(200, 100, 0.2, 'sawtooth'); }
  playScan() {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => this.playTone(440 + i * 60, 440 + i * 60, 0.06, 'sine'), i * 80);
    }
  }
  playNavOpen() { this.playTone(300, 600, 0.12, 'sine'); }

  private playTone(startFreq: number, endFreq: number, duration: number, type: OscillatorType) {
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

  toggle() { this.enabled = !this.enabled; return this.enabled; }
  isEnabled() { return this.enabled; }
  setVolume(v: number) { this.volume = Math.max(0, Math.min(1, v)); }
}

const soundManager = SoundManager.getInstance();

const colors = {
  brand: { 950: '#020617', 900: '#0A1628', 800: '#0F1E34', 700: '#162B44', 600: '#1E3A5F' },
  accent: { 500: '#3B82F6', 400: '#60A5FA' },
  success: { 500: '#10B981' },
  warning: { 500: '#F59E0B' },
  danger: { 500: '#EF4444' },
  purple: { 500: '#8B5CF6' },
  text: { primary: '#F8FAFC', secondary: '#94A3B8', muted: '#64748B' },
};

const sidebarItems = [
  { icon: '◫', label: 'Dashboard', href: '/dashboard', active: true },
  { icon: '✦', label: 'AI Insights', href: '/insights' },
  { icon: '◈', label: 'KPIs', href: '/kpis' },
  { icon: '◉', label: 'Alerts', href: '/alerts', badge: 3 },
  { icon: '⊕', label: 'Sources', href: '/sources' },
  { icon: '📊', label: 'Reports', href: '/reports' },
];

const kpiData = [
  { label: 'Health Score', value: 74, max: 100, color: '#10B981', icon: '💚' },
  { label: 'Revenue', value: 4.28, max: 5, unit: '$', suffix: 'M', color: '#3B82F6', icon: '📈' },
  { label: 'Gross Margin', value: 68.2, max: 100, unit: '%', color: '#10B981', icon: '💹' },
  { label: 'Churn Rate', value: 3.2, max: 100, unit: '%', color: '#F59E0B', icon: '📉', inverse: true },
  { label: 'CAC', value: 142, max: 200, unit: '$', color: '#10B981', icon: '💰' },
  { label: 'LTV', value: 3840, max: 5000, unit: '$', color: '#3B82F6', icon: '⭐' },
];

const pillarData = [
  { label: 'Progress', score: 82, color: '#3B82F6' },
  { label: 'Profitability', score: 68, color: '#10B981' },
  { label: 'Cost Efficiency', score: 71, color: '#F59E0B' },
  { label: 'Consolidation', score: 79, color: '#8B5CF6' },
];

const revenueData = [
  { month: 'Jul', revenue: 3.1, expenses: 2.4 },
  { month: 'Aug', revenue: 3.5, expenses: 2.8 },
  { month: 'Sep', revenue: 3.9, expenses: 2.9 },
  { month: 'Oct', revenue: 3.6, expenses: 2.7 },
  { month: 'Nov', revenue: 4.2, expenses: 3.1 },
  { month: 'Dec', revenue: 4.28, expenses: 3.2 },
];

function PieChart({ data, size = 120 }: { data: { value: number; color: string }[], size?: number }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  let cumulative = 0;
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={colors.brand[700]}
        strokeWidth={12}
      />
      {/* Data arcs */}
      {data.map((item, i) => {
        const offset = (cumulative / total) * circumference;
        const dashArray = (item.value / total) * circumference;
        cumulative += item.value;
        return (
          <motion.circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth={12}
            strokeDasharray={`${animated ? dashArray : 0} ${circumference}`}
            strokeDashoffset={-animated ? offset : 0}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 1s ease-out, stroke-dashoffset 1s ease-out',
            }}
          />
        );
      })}
    </svg>
  );
}

function BarChart({ data, height = 160 }: { data: { label: string; value: number; color: string }[], height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const barWidth = 32;
  const gap = 16;
  const totalWidth = data.length * barWidth + (data.length - 1) * gap;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: `${gap}px`, height }}>
      {data.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ height: 0 }}
          animate={{ height: animated ? `${(item.value / maxValue) * height}px` : 0 }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
          style={{
            width: barWidth,
            background: item.color,
            borderRadius: 6,
            position: 'relative',
          }}
        >
          <span style={{
            position: 'absolute',
            bottom: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 11,
            color: colors.text.muted,
            whiteSpace: 'nowrap',
          }}>{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function RadialProgress({ value, color, size = 100 }: { value: number; color: string; size?: number }) {
  const [animated, setAnimated] = useState(false);
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colors.brand[700]}
        strokeWidth={10}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: animated ? offset : circumference }}
        style={{
          transition: 'stroke-dashoffset 1.5s ease-out',
          filter: `drop-shadow(0 0 6px ${color}80)`,
        }}
      />
    </svg>
  );
}

export default function Dashboard() {
  const [scanning, setScanning] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: colors.brand[950],
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
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'fixed',
          bottom: '-20%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -80 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          width: 80,
          background: colors.brand[900],
          borderRight: `1px solid ${colors.brand[600]}30`,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
          position: 'relative',
          zIndex: 10,
        }}>
        <div style={{ padding: '0 20px', marginBottom: 32 }}>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              borderRadius: 12,
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 20, color: '#fff' }}>⬡</span>
          </motion.a>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px' }}>
          {sidebarItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => soundManager.playHover()}
              onFocus={() => soundManager.playClick()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '12px 8px',
                borderRadius: 12,
                background: item.active ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: item.active ? colors.accent[400] : colors.text.muted,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
              {item.badge && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 12,
                    width: 16,
                    height: 16,
                    background: colors.danger[500],
                    borderRadius: '50%',
                    fontSize: 9,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >{item.badge}</motion.span>
              )}
            </motion.a>
          ))}
        </nav>

        <motion.a
          href="/settings"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => soundManager.playHover()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '12px 8px',
            color: colors.text.muted,
            textDecoration: 'none',
            margin: '0 12px',
          }}
        >
          <span style={{ fontSize: 20 }}>⚙</span>
          <span style={{ fontSize: 10 }}>Settings</span>
        </motion.a>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 32, position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                fontSize: 28, 
                fontWeight: 700, 
                color: colors.text.primary,
                marginBottom: 4,
              }}
            >
              Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ color: colors.text.secondary, fontSize: 14 }}
            >
              Welcome back! Here's your business overview.
            </motion.p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { soundManager.playScan(); runScan(); }}
              disabled={scanning}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: scanning ? 'rgba(59, 130, 246, 0.2)' : colors.accent[500],
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: scanning ? 'default' : 'pointer',
                boxShadow: scanning ? 'none' : '0 0 20px rgba(59, 130, 246, 0.3)',
              }}
            >
              <motion.span
                animate={scanning ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, repeat: scanning ? Infinity : 0, ease: 'linear' }}
              >
                {scanning ? '⏳' : '🔍'}
              </motion.span>
              {scanning ? 'Scanning...' : 'Run Scan'}
            </motion.button>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: 40,
                height: 40,
                background: colors.brand[700],
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.text.secondary,
                fontSize: 14,
                fontWeight: 600,
              }}
            >JD</motion.div>
          </div>
        </motion.header>

        {/* KPI Cards with Pie Charts */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(6, 1fr)', 
          gap: 16, 
          marginBottom: 32,
        }}>
          {kpiData.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{
                background: colors.brand[800],
                border: `1px solid ${colors.brand[600]}30`,
                borderRadius: 16,
                padding: 20,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `${kpi.color}10`,
                }}
              />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PieChart
                  data={[
                    { value: kpi.value, color: kpi.color },
                    { value: kpi.max - kpi.value, color: colors.brand[700] },
                  ]}
                  size={70}
                />
                <span style={{ fontSize: 24, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: -8 }}>
                  {kpi.icon}
                </span>
              </div>
              <p style={{ 
                color: colors.text.muted, 
                fontSize: 10, 
                fontWeight: 600, 
                textTransform: 'uppercase',
                textAlign: 'center',
                marginTop: 12,
                marginBottom: 4,
              }}>{kpi.label}</p>
              <p style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: colors.text.primary,
                textAlign: 'center',
              }}>
                {kpi.unit}{kpi.value}{kpi.suffix || ''}
              </p>
              <p style={{ 
                color: (kpi.inverse ? kpi.color : colors.success[500]),
                fontSize: 11,
                fontWeight: 600,
                textAlign: 'center',
                marginTop: 4,
              }}>
                {kpi.label === 'Churn Rate' ? '+0.4%' : '+12.4%'} MoM
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pillars with Radial Progress */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 16, 
          marginBottom: 32,
        }}>
          {pillarData.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{
                background: colors.brand[800],
                border: `1px solid ${colors.brand[600]}30`,
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <RadialProgress value={pillar.score} color={pillar.color} size={100} />
              <p style={{ 
                color: colors.text.muted, 
                fontSize: 12, 
                fontWeight: 600,
                textTransform: 'uppercase',
                marginTop: 16,
              }}>{pillar.label}</p>
              <p style={{ 
                fontSize: 28, 
                fontWeight: 700, 
                color: pillar.color,
                marginTop: 4,
              }}>{pillar.score}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: colors.brand[800],
            border: `1px solid ${colors.brand[600]}30`,
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h3 style={{ 
            color: colors.text.primary, 
            fontSize: 16, 
            fontWeight: 600,
            marginBottom: 24,
          }}>Revenue vs Expenses (Q2-Q4)</h3>
          <BarChart
            data={[
              { label: 'Jul', value: 3.1, color: colors.accent[400] },
              { label: 'Aug', value: 3.5, color: colors.accent[400] },
              { label: 'Sep', value: 3.9, color: colors.accent[400] },
              { label: 'Oct', value: 3.6, color: colors.accent[400] },
              { label: 'Nov', value: 4.2, color: colors.accent[400] },
              { label: 'Dec', value: 4.28, color: colors.accent[400] },
            ]}
            height={140}
          />
        </motion.div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        `}</style>
      </main>
    </div>
  );
}