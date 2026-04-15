import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Spacing } from '../theme';

// ── KPI Card ─────────────────────────────────────────────
export function KpiCard({ label, value, trend, format = 'number', size = 'md', color, onPress }) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;
  const trendColor = isNeutral ? Colors.text3 : isPositive ? Colors.green2 : Colors.red2;

  const formatValue = (v) => {
    if (format === 'currency') {
      if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
      if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
      return `$${v}`;
    }
    if (format === 'percent') return `${v}%`;
    if (format === 'currencyK') return `$${(v / 1000).toFixed(1)}K`;
    return v.toLocaleString();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.card, size === 'sm' && styles.cardSm]}
    >
      {color && <View style={[styles.cardAccent, { backgroundColor: color }]} />}
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardValue, size === 'sm' && styles.cardValueSm]}>
        {formatValue(value)}
      </Text>
      {trend !== undefined && (
        <View style={styles.trendRow}>
          <Text style={[styles.trendText, { color: trendColor }]}>
            {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
          </Text>
          <Text style={styles.trendPeriod}>  vs last mo</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Section Header ─────────────────────────────────────────
export function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Alert Card ─────────────────────────────────────────────
export function AlertCard({ alert, onPress }) {
  const typeConfig = {
    warning: { color: Colors.gold, bg: 'rgba(245,158,11,0.12)', icon: '⚠️' },
    danger: { color: Colors.red, bg: 'rgba(239,68,68,0.12)', icon: '🔴' },
    success: { color: Colors.green, bg: 'rgba(16,185,129,0.12)', icon: '✅' },
    info: { color: Colors.accent2, bg: 'rgba(96,165,250,0.12)', icon: 'ℹ️' },
  };
  const cfg = typeConfig[alert.type] || typeConfig.info;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={[styles.alertCard, { borderLeftColor: cfg.color }]}>
      <View style={styles.alertTop}>
        <View style={[styles.alertIconBg, { backgroundColor: cfg.bg }]}>
          <Text style={{ fontSize: 14 }}>{cfg.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertPillar}>{alert.pillar}</Text>
        </View>
        <Text style={styles.alertTime}>{alert.time}</Text>
      </View>
      <Text style={styles.alertBody}>{alert.body}</Text>
    </TouchableOpacity>
  );
}

// ── Pillar Bar ─────────────────────────────────────────────
export function PillarBar({ label, score, color, icon }) {
  return (
    <View style={styles.pillarRow}>
      <Text style={styles.pillarIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <View style={styles.pillarLabelRow}>
          <Text style={styles.pillarLabel}>{label}</Text>
          <Text style={[styles.pillarScore, { color }]}>{score}</Text>
        </View>
        <View style={styles.pillarTrack}>
          <View style={[styles.pillarFill, { width: `${score}%`, backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

// ── Health Score Ring ──────────────────────────────────────
export function HealthScoreRing({ score }) {
  const color = score >= 75 ? Colors.green : score >= 55 ? Colors.gold : Colors.red;
  return (
    <View style={styles.healthRing}>
      <View style={[styles.healthOuter, { borderColor: color + '40' }]}>
        <View style={[styles.healthInner, { borderColor: color }]}>
          <Text style={[styles.healthScore, { color }]}>{score}</Text>
          <Text style={styles.healthLabel}>Health</Text>
        </View>
      </View>
    </View>
  );
}

// ── Tag / Badge ────────────────────────────────────────────
export function Badge({ label, color = Colors.accent, bg }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg || color + '22', borderColor: color + '44' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ── Data Source Row ────────────────────────────────────────
export function DataSourceRow({ source, onToggle }) {
  return (
    <View style={styles.dsRow}>
      <View style={styles.dsIcon}>
        <Text style={{ fontSize: 20 }}>{source.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.dsName}>{source.name}</Text>
        {source.connected
          ? <Text style={styles.dsMeta}>{source.records} · {source.lastSync}</Text>
          : <Text style={[styles.dsMeta, { color: Colors.text3 }]}>Not connected</Text>
        }
      </View>
      <TouchableOpacity
        onPress={onToggle}
        style={[styles.dsToggle, { backgroundColor: source.connected ? Colors.green + '20' : Colors.bg4, borderColor: source.connected ? Colors.green + '50' : Colors.border }]}
      >
        <Text style={[styles.dsToggleText, { color: source.connected ? Colors.green2 : Colors.text2 }]}>
          {source.connected ? 'Connected' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // KPI Card
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, flex: 1, minWidth: 140, overflow: 'hidden',
  },
  cardSm: { padding: Spacing.sm + 4, minWidth: 100 },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg },
  cardLabel: { fontSize: 11, color: Colors.text3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  cardValue: { fontSize: 22, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  cardValueSm: { fontSize: 18 },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  trendText: { fontSize: 11.5, fontWeight: '600' },
  trendPeriod: { fontSize: 11, color: Colors.text3 },

  // Section Header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, marginTop: Spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, letterSpacing: -0.2 },
  sectionSubtitle: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  sectionAction: { fontSize: 13, color: Colors.accent2, fontWeight: '500' },

  // Alert Card
  alertCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 3, marginBottom: Spacing.sm,
  },
  alertTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  alertIconBg: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  alertTitle: { fontSize: 13.5, fontWeight: '600', color: Colors.text },
  alertPillar: { fontSize: 11, color: Colors.text3, marginTop: 1 },
  alertTime: { fontSize: 11, color: Colors.text3 },
  alertBody: { fontSize: 13, color: Colors.text2, lineHeight: 19 },

  // Pillar Bar
  pillarRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  pillarIcon: { fontSize: 16, width: 24, textAlign: 'center' },
  pillarLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  pillarLabel: { fontSize: 13, color: Colors.text2, fontWeight: '500' },
  pillarScore: { fontSize: 13, fontWeight: '700' },
  pillarTrack: { height: 5, backgroundColor: Colors.bg4, borderRadius: 99 },
  pillarFill: { height: 5, borderRadius: 99 },

  // Health Ring
  healthRing: { alignItems: 'center', justifyContent: 'center' },
  healthOuter: { width: 110, height: 110, borderRadius: 55, borderWidth: 8, alignItems: 'center', justifyContent: 'center' },
  healthInner: { width: 82, height: 82, borderRadius: 41, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  healthScore: { fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  healthLabel: { fontSize: 10, color: Colors.text3, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Badge
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '600' },

  // Data Source Row
  dsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  dsIcon: { width: 42, height: 42, backgroundColor: Colors.bg4, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  dsName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  dsMeta: { fontSize: 11.5, color: Colors.text2, marginTop: 2 },
  dsToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1 },
  dsToggleText: { fontSize: 12, fontWeight: '600' },
});
