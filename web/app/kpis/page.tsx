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
  { icon: '✦', label: 'AI Insights', href: '/insights', active: false },
  { icon: '◈', label: 'KPIs', href: '/kpis', active: true },
  { icon: '◉', label: 'Alerts', href: '/alerts', badge: 3 },
  { icon: '⊕', label: 'Sources', href: '/sources', active: false },
  { icon: '📊', label: 'Reports', href: '/reports', active: false },
];

const kpiCategories = [
  { name: 'Financial', kpis: [
    { label: 'Revenue', value: '$4.28M', trend: '+12.4%', positive: true },
    { label: 'Gross Margin', value: '68.2%', trend: '+2.1%', positive: true },
    { label: 'Net Profit', value: '22.7%', trend: '-1.8%', positive: false },
    { label: 'Operating Costs', value: '$1.92M', trend: '+4.1%', positive: false },
  ]},
  { name: 'Customer', kpis: [
    { label: 'CAC', value: '$142', trend: '-8.3%', positive: true },
    { label: 'LTV', value: '$3,840', trend: '+5.6%', positive: true },
    { label: 'Churn Rate', value: '3.2%', trend: '+0.4%', positive: false },
    { label: 'Retention', value: '96.8%', trend: '-0.4%', positive: false },
  ]},
  { name: 'Growth', kpis: [
    { label: 'Revenue Growth', value: '+12.4%', trend: '+2.1%', positive: true },
    { label: 'Customer Growth', value: '+8.7%', trend: '+1.2%', positive: true },
    { label: 'ARPU', value: '$847', trend: '+3.4%', positive: true },
    { label: 'NPS', value: '72', trend: '+5', positive: true },
  ]},
  { name: 'Operational', kpis: [
    { label: 'Rev/Employee', value: '$186K', trend: '+9.2%', positive: true },
    { label: 'Burn Rate', value: '$320K/mo', trend: '-2.1%', positive: true },
    { label: 'Runway', value: '18 months', trend: '+2', positive: true },
    { label: 'Efficiency', value: '84%', trend: '+3%', positive: true },
  ]},
];

function RadialChart({ value, color, size = 100, label }: { value: number; color: string; size?: number; label?: string }) {
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
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={colors.brand[700]} strokeWidth={10} />
      <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: animated ? offset : circumference }} transition={{ duration: 1.5, ease: 'easeOut' }} style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
    </svg>
  );
}

export default function KPIsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Q4 2024');
  const periods = ['Q4 2024', 'Q3 2024', 'Q2 2024', 'Q1 2024', 'FY 2024'];

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
            <motion.a key={item.label} href={item.href} whileHover={{ scale: 1.05 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 8px', borderRadius: 12, background: item.active ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: item.active ? colors.accent[400] : colors.text.muted, textDecoration: 'none', position: 'relative' }}>
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
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>KPIs</h1>
            <p style={{ color: colors.text.secondary, fontSize: 14 }}>Track and analyze your key performance indicators</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {periods.map((period) => (
              <button key={period} onClick={() => setSelectedPeriod(period)} style={{ padding: '8px 16px', background: selectedPeriod === period ? colors.accent[500] : colors.brand[700], border: 'none', borderRadius: 8, color: selectedPeriod === period ? '#fff' : colors.text.secondary, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                {period}
              </button>
            ))}
          </div>
        </header>

        {/* KPI Categories */}
        {kpiCategories.map((category, catIndex) => (
          <motion.div key={category.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: catIndex * 0.1 }} style={{ marginBottom: 32 }}>
            <h3 style={{ color: colors.text.primary, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{category.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {category.kpis.map((kpi, i) => (
                <motion.div key={kpi.label} whileHover={{ y: -4 }} style={{ background: colors.brand[800], border: `1px solid ${colors.brand[600]}30`, borderRadius: 16, padding: 20 }}>
                  <p style={{ color: colors.text.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>{kpi.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>{kpi.value}</p>
                  <p style={{ color: kpi.positive ? '#10B981' : '#EF4444', fontSize: 12, fontWeight: 600 }}>{kpi.trend}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>
      </main>
    </div>
  );
}