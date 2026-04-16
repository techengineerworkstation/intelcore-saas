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
  { icon: '◉', label: 'Alerts', href: '/alerts', badge: 3 },
  { icon: '⊕', label: 'Sources', href: '/sources', active: false },
  { icon: '📊', label: 'Reports', href: '/reports', active: true },
];

interface Report {
  id: number;
  name: string;
  type: string;
  created: string;
  status: string;
}

const reportsData: Report[] = [
  { id: 1, name: 'Q4 2024 Financial Summary', type: 'Financial', created: '2024-12-15', status: 'Ready' },
  { id: 2, name: 'Customer Churn Analysis', type: 'Retention', created: '2024-12-12', status: 'Ready' },
  { id: 3, name: 'Revenue Forecasting FY2025', type: 'Financial', created: '2024-12-10', status: 'Ready' },
  { id: 4, name: 'Marketing Campaign ROI', type: 'Marketing', created: '2024-12-08', status: 'Ready' },
  { id: 5, name: 'Customer Segmentation', type: 'CRM', created: '2024-12-05', status: 'Ready' },
  { id: 6, name: 'Operational Efficiency', type: 'Operations', created: '2024-12-01', status: 'Ready' },
];

const reportIcons: Record<string, string> = {
  Financial: '💰', Retention: '🔄', Marketing: '📈', CRM: '👥', Operations: '⚙️',
};

export default function ReportsPage() {
  const [reports, setReports] = useState(reportsData);
  const [filter, setFilter] = useState('all');

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.type === filter);
  const uniqueTypes = [...new Set(reports.map(r => r.type))];

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
            <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>Reports</h1>
            <p style={{ color: colors.text.secondary, fontSize: 14 }}>Generate and export business intelligence reports</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} style={{ padding: '12px 24px', background: colors.accent[500], border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Generate Report
          </motion.button>
        </header>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button onClick={() => setFilter('all')} style={{ padding: '8px 16px', background: filter === 'all' ? colors.accent[500] : colors.brand[700], border: 'none', borderRadius: 8, color: filter === 'all' ? '#fff' : colors.text.secondary, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>All Reports</button>
          {uniqueTypes.map((type) => (
            <button key={type} onClick={() => setFilter(type)} style={{ padding: '8px 16px', background: filter === type ? colors.accent[500] : colors.brand[700], border: 'none', borderRadius: 8, color: filter === type ? '#fff' : colors.text.secondary, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{type}</button>
          ))}
        </div>

        {/* Reports List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredReports.map((report, i) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.01 }} style={{ background: colors.brand[800], border: `1px solid ${colors.brand[600]}30`, borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 28 }}>{reportIcons[report.type]}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: colors.text.primary, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{report.name}</p>
                <p style={{ color: colors.text.muted, fontSize: 12 }}>{report.type} • {report.created}</p>
              </div>
              <span style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 8, color: '#10B981', fontSize: 12, fontWeight: 600 }}>{report.status}</span>
              <motion.button whileHover={{ scale: 1.05 }} style={{ padding: '10px 16px', background: colors.brand[700], border: 'none', borderRadius: 8, color: colors.text.secondary, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Download</motion.button>
            </motion.div>
          ))}
        </div>

        <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>
      </main>
    </div>
  );
}