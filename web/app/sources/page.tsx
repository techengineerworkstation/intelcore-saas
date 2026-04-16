'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const colors = {
  brand: { 950: '#020617', 900: '#0A1628', 800: '#0F1E34', 700: '#162B44', 600: '#1E3A5F' },
  accent: { 500: '#3B82F6', 400: '#60A5FA' },
  success: { 500: '#10B981' },
  text: { primary: '#F8FAFC', secondary: '#94A3B8', muted: '#64748B' },
};

const sidebarItems = [
  { icon: '◫', label: 'Dashboard', href: '/dashboard', active: false },
  { icon: '✦', label: 'AI Insights', href: '/insights', active: false },
  { icon: '◈', label: 'KPIs', href: '/kpis', active: false },
  { icon: '◉', label: 'Alerts', href: '/alerts', badge: 3 },
  { icon: '⊕', label: 'Sources', href: '/sources', active: true },
  { icon: '📊', label: 'Reports', href: '/reports', active: false },
];

const dataSources = [
  { id: 1, name: 'HubSpot', icon: '🔶', category: 'CRM', connected: false, type: 'oauth' },
  { id: 2, name: 'Salesforce', icon: '☁️', category: 'CRM', connected: true, records: '8,412', type: 'oauth' },
  { id: 3, name: 'QuickBooks', icon: '💳', category: 'Finance', connected: true, records: '36 mo', type: 'oauth' },
  { id: 4, name: 'Jira', icon: '📋', category: 'Project', connected: false, type: 'oauth' },
  { id: 5, name: 'Zendesk', icon: '🎫', category: 'Support', connected: false, type: 'oauth' },
  { id: 6, name: 'PostgreSQL', icon: '🗄️', category: 'Database', connected: true, records: '2.4M', type: 'database' },
  { id: 7, name: 'Google Sheets', icon: '📗', category: 'Spreadsheet', connected: false, type: 'file' },
  { id: 8, name: 'Excel', icon: '📊', category: 'Spreadsheet', connected: false, type: 'file' },
  { id: 9, name: 'Slack', icon: '💬', category: 'Communication', connected: false, type: 'oauth' },
  { id: 10, name: 'Zoom', icon: '🎥', category: 'Communication', connected: false, type: 'oauth' },
];

const categories = [...new Set(dataSources.map(s => s.category))];

const CategoryIcon: Record<string, string> = {
  CRM: '🔶', Project: '📋', Finance: '💰', Support: '🎫', Database: '🗄️', Spreadsheet: '📊', Communication: '💬',
};

export default function SourcesPage() {
  const [sources, setSources] = useState(dataSources);
  const [scanning, setScanning] = useState(false);
  const [connecting, setConnecting] = useState<number | null>(null);

  const connected = sources.filter(s => s.connected);
  const disconnected = sources.filter(s => !s.connected);

  const toggleSource = (id: number) => {
    const src = sources.find(s => s.id === id);
    if (!src) return;
    
    if (src.type === 'file') {
      // File upload would trigger document picker
      return;
    }

    setConnecting(id);
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === id ? { ...s, connected: !s.connected, records: !s.connected ? 'Syncing...' : null, lastSync: !s.connected ? 'Just now' : undefined } : s));
      setConnecting(null);
    }, 2000);
  };

  const runScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

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
            <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text.primary, marginBottom: 4 }}>Data Sources</h1>
            <p style={{ color: colors.text.secondary, fontSize: 14 }}>Connect your tools for automated KPI extraction</p>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: colors.text.primary }}>{connected.length}</p>
              <p style={{ fontSize: 12, color: colors.text.muted }}>Connected</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: colors.text.secondary }}>{disconnected.length}</p>
              <p style={{ fontSize: 12, color: colors.text.muted }}>Available</p>
            </div>
          </div>
        </header>

        {/* Run Scan Button */}
        <motion.button onClick={runScan} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={scanning} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', background: scanning ? 'rgba(59, 130, 246, 0.2)' : colors.accent[500], border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: scanning ? 'default' : 'pointer', marginBottom: 32 }}>
          <motion.span animate={scanning ? { rotate: 360 } : {}} transition={scanning ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}>{scanning ? '⏳' : '🔍'}</motion.span>
          {scanning ? 'Scanning & Extracting KPIs...' : 'Run Full Data Scan'}
        </motion.button>

        {/* Categories */}
        {categories.map((category) => (
          <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
            <h3 style={{ color: colors.text.primary, fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{CategoryIcon[category]}</span>
              {category}
              <span style={{ color: colors.text.muted, fontWeight: 400, fontSize: 13 }}>({sources.filter(s => s.category === category && s.connected).length} connected)</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {sources.filter(s => s.category === category).map((src) => (
                <motion.div key={src.id} whileHover={{ y: -4 }} onClick={() => toggleSource(src.id)} style={{ background: colors.brand[800], border: `1px solid ${src.connected ? colors.success[500] + '40' : colors.brand[600]}30`, borderRadius: 16, padding: 20, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>{src.icon}</span>
                    <div style={{ flex: 1, width: 8, height: 8, borderRadius: '50%', background: src.connected ? colors.success[500] : colors.text.muted }} />
                  </div>
                  <p style={{ color: colors.text.primary, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{src.name}</p>
                  <p style={{ color: src.connected ? colors.success[500] : colors.text.muted, fontSize: 12 }}>{src.connected ? (connecting === src.id ? 'Connecting...' : src.records) : 'Not connected'}</p>
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