import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Colors, Spacing, Radius } from '../theme';
import { AlertCard, Badge } from '../components';
import { alertsData } from '../data/mockData';

const FILTERS = ['All', 'Danger', 'Warning', 'Success', 'Info'];

export default function AlertsScreen() {
  const [filter, setFilter] = useState('All');

  const filterColors = {
    All: Colors.accent2, Danger: Colors.red2, Warning: Colors.gold2,
    Success: Colors.green2, Info: Colors.accent3,
  };

  const filtered = filter === 'All' ? alertsData : alertsData.filter(a =>
    a.type === filter.toLowerCase()
  );

  const counts = {
    danger: alertsData.filter(a => a.type === 'danger').length,
    warning: alertsData.filter(a => a.type === 'warning').length,
    success: alertsData.filter(a => a.type === 'success').length,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts & Signals</Text>
        <Text style={styles.headerSub}>AI-generated business risk & opportunity flags</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statChip, { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: Colors.red + '40' }]}>
            <Text style={{ color: Colors.red2, fontSize: 13, fontWeight: '700' }}>{counts.danger} Critical</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: 'rgba(245,158,11,0.15)', borderColor: Colors.gold + '40' }]}>
            <Text style={{ color: Colors.gold2, fontSize: 13, fontWeight: '700' }}>{counts.warning} Warnings</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: Colors.green + '40' }]}>
            <Text style={{ color: Colors.green2, fontSize: 13, fontWeight: '700' }}>{counts.success} Positive</Text>
          </View>
        </View>
      </View>

      {/* Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterPill, filter === f && { backgroundColor: filterColors[f] + '25', borderColor: filterColors[f] + '60' }]}
          >
            <Text style={[styles.filterText, filter === f && { color: filterColors[f], fontWeight: '600' }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>✅</Text>
            <Text style={styles.emptyText}>No alerts in this category</Text>
          </View>
        )}
        {filtered.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}

        {/* Recommendations Section */}
        <View style={styles.recSection}>
          <Text style={styles.recTitle}>AI Recommendations</Text>
          {[
            { icon: '💡', title: 'Reduce SME Churn', action: 'Launch loyalty program for accounts >18 months with usage drop' },
            { icon: '⚙️', title: 'Cut Op. Costs', action: 'Automate 3 manual reporting workflows — est. $120K/yr savings' },
            { icon: '📈', title: 'Expand LTV', action: 'Upsell retainer clients to premium tier — 43 eligible accounts identified' },
          ].map((rec, i) => (
            <View key={i} style={styles.recCard}>
              <Text style={{ fontSize: 22 }}>{rec.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.recCardTitle}>{rec.title}</Text>
                <Text style={styles.recCardBody}>{rec.action}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: Colors.text3, marginTop: 2, marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1 },
  filterScroll: { backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterRow: { paddingHorizontal: Spacing.lg, paddingVertical: 10, gap: 8 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border },
  filterText: { fontSize: 13, fontWeight: '400', color: Colors.text2 },
  scroll: { padding: Spacing.lg },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyText: { fontSize: 15, color: Colors.text3 },
  recSection: { marginTop: Spacing.lg },
  recTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  recCard: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, flexDirection: 'row', gap: 14, marginBottom: 10, alignItems: 'flex-start' },
  recCardTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  recCardBody: { fontSize: 13, color: Colors.text2, lineHeight: 19 },
});
