import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Colors, Spacing, Radius } from '../theme';
import { DataSourceRow, Badge } from '../components';
import { dataSources as initialSources } from '../data/mockData';

export default function DataSourcesScreen() {
  const [sources, setSources] = useState(initialSources);
  const [scanning, setScanning] = useState(false);

  const connected = sources.filter(s => s.connected);
  const disconnected = sources.filter(s => !s.connected);

  const toggleSource = (id) => {
    const src = sources.find(s => s.id === id);
    if (!src.connected) {
      Alert.alert(
        `Connect ${src.name}`,
        `This will link your ${src.name} account to IntelCore SaaS for automated KPI extraction.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Connect', onPress: () => {
              setSources(prev => prev.map(s => s.id === id
                ? { ...s, connected: true, records: 'Syncing...', lastSync: 'Just now' }
                : s
              ));
            }
          }
        ]
      );
    } else {
      Alert.alert(`Disconnect ${src.name}?`, 'KPIs from this source will stop updating.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: () => setSources(prev => prev.map(s => s.id === id ? { ...s, connected: false, records: null, lastSync: null } : s)) },
      ]);
    }
  };

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      Alert.alert('Scan Complete', `${connected.length} sources scanned. KPIs updated successfully.`);
    }, 2500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Sources</Text>
        <Text style={styles.headerSub}>Connect your tools for automated KPI extraction</Text>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{connected.length}</Text>
            <Text style={styles.statLabel}>Connected</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{disconnected.length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.green2 }]}>Live</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Scan Button */}
        <TouchableOpacity
          onPress={runScan}
          style={[styles.scanBtn, scanning && styles.scanBtnActive]}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18 }}>{scanning ? '⏳' : '🔍'}</Text>
          <View>
            <Text style={styles.scanBtnTitle}>{scanning ? 'Scanning & Extracting KPIs...' : 'Run Full Data Scan'}</Text>
            <Text style={styles.scanBtnSub}>{scanning ? 'Processing all connected sources' : `Scan ${connected.length} connected sources now`}</Text>
          </View>
        </TouchableOpacity>

        {/* Connected */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Connected Sources</Text>
            <Badge label={`${connected.length} active`} color={Colors.green2} />
          </View>
          <View style={styles.sourceList}>
            {connected.map(src => (
              <DataSourceRow key={src.id} source={src} onToggle={() => toggleSource(src.id)} />
            ))}
          </View>
        </View>

        {/* Available */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Available to Connect</Text>
            <Badge label={`${disconnected.length} pending`} color={Colors.text3} />
          </View>
          <View style={styles.sourceList}>
            {disconnected.map(src => (
              <DataSourceRow key={src.id} source={src} onToggle={() => toggleSource(src.id)} />
            ))}
          </View>
        </View>

        {/* Classification Engine */}
        <View style={styles.classCard}>
          <Text style={styles.classTitle}>🧠  Intelligent Classification</Text>
          <Text style={styles.classSub}>Your connected data is automatically categorized into:</Text>
          <View style={styles.classGrid}>
            {['Financials', 'Operations', 'Customers', 'HR & Workforce', 'Products', 'Reports'].map(cat => (
              <View key={cat} style={styles.classChip}>
                <Text style={styles.classChipText}>{cat}</Text>
              </View>
            ))}
          </View>
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
  headerSub: { fontSize: 13, color: Colors.text3, marginTop: 2, marginBottom: 14 },
  headerStats: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 12, borderWidth: 1, borderColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.text3, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  scroll: { padding: Spacing.lg },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border2, marginBottom: Spacing.lg },
  scanBtnActive: { borderColor: Colors.accent + '60', backgroundColor: Colors.accent + '15' },
  scanBtnTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  scanBtnSub: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  section: { marginBottom: Spacing.lg },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  sourceList: { backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  classCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  classTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  classSub: { fontSize: 13, color: Colors.text3, marginBottom: 12, lineHeight: 18 },
  classGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  classChip: { backgroundColor: Colors.bg4, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  classChipText: { fontSize: 12, color: Colors.text2, fontWeight: '500' },
});
