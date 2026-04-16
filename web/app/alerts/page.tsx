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
  { icon: '◈', label: 'KPIs', href: '/kpis', active: false },
  { icon: '◉', label: 'Alerts', href: '/alerts', active: true },
  { icon: '⊕', label: 'Sources', href: '/sources', active: false },
  { icon: '📊', label: 'Reports', href: '/reports', active: false },
];

const alertsData = [
  { id: 1, type: 'warning', title: 'Churn Rate Rising', body: 'Churn increased 0.4% MoM. Engage at-risk customers in the SME segment.', pillar: 'Consolidation', time: '2h ago' },
  { id: 2, type: 'danger', title: 'Net Margin Declining', body: 'Net profit margin dropped 1.8%. Operating costs growing faster than revenue.', pillar: 'Profitability', time: '5h ago' },
  { id: 3, type: 'success', title: 'Revenue Milestone Hit', body: 'Monthly revenue exceeded $4.2M target by 1.9%. Growth trajectory on track.', pillar: 'Progress', time: '1d ago' },
  { id: 4, type: 'info', title: 'LTV/CAC Ratio Strong', body: 'LTV:CAC ratio at 27x, well above the 3x benchmark. Customer acquisition efficient.', pillar: 'Progress', time: '2d ago' },
  { id: 5, type: 'warning', title: 'Ops Cost Overrun Risk', body: 'Operating expense ratio trending toward 46%. Recommended ceiling: 45%.', pillar: 'Cost Efficiency', time: '3d ago' },
  { id: 6, type: 'success', title: 'Customer Growth', body: 'New customer acquisition up 12% this month. Enterprise segment leading.', pillar: 'Progress', time: '4d ago' },
];

const alertColors: Record<string, string> = {
  warning: '#F59E0B',
  danger: '#EF4444',
  success: '#10B981',
  info: '#3B82F6',
};

const alertIcons: Record<string, string> = {
  warning: '⚠️',
  danger: '🔴',
  success: '✅',
  info: 'ℹ️',
};

export default function AlertsPage() {
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState(alertsData);

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);

  const unreadCount = alerts.filter(a => a.type === 'danger' || a.type === 'warning').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.brand[950], fontFamily: "'Outfit', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity }} style={{ position: 'fixed', top: '-30%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

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

      <main style={{ flex: 1, padding: 32, position: 'relative', zIndex: 10, overflow: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>Alerts</h1>
            <p style={{ color: colors.text.secondary, fontSize: 14 }}>AI-generated risk and opportunity alerts</p>
          </div>
        </header>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['all', 'danger', 'warning', 'success', 'info'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', background: filter === f ? colors.accent[500] : colors.brand[700], border: 'none', borderRadius: 8, color: filter === f ? '#fff' : colors.text.secondary, fontSize: 13, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredAlerts.map((alert, i) => (
            <motion.div key={alert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.01 }} style={{ background: colors.brand[800], border: `1px solid ${colors.brand[600]}30`, borderRadius: 16, padding: 20, borderLeft: `4px solid ${alertColors[alert.type]}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{alertIcons[alert.type]}</span>
                <h3 style={{ flex: 1, color: colors.text.primary, fontSize: 15, fontWeight: 600 }}>{alert.title}</h3>
                <span style={{ color: colors.text.muted, fontSize: 12 }}>{alert.time}</span>
              </div>
              <p style={{ color: colors.text.secondary, fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>{alert.body}</p>
              <span style={{ display: 'inline-block', padding: '4px 10px', background: `${alertColors[alert.type]}20`, borderRadius: 12, color: alertColors[alert.type], fontSize: 11, fontWeight: 600 }}>{alert.pillar}</span>
            </motion.div>
          ))}
        </div>

        <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>
      </main>
    </div>
  );
}