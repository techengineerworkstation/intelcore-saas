import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  StatusBar, RefreshControl, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { Colors, Spacing, Radius } from '../theme';
import { KpiCard, SectionHeader, PillarBar, HealthScoreRing, AlertCard } from '../components';
import { kpiData, revenueChartData, pillarsData, alertsData } from '../data/mockData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - Spacing.lg * 2;

export default function DashboardScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <LinearGradient colors={[Colors.bg2, Colors.bg]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning, Chidi 👋</Text>
            <Text style={styles.orgName}>Ibe's Tech Hub</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Alerts')}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Health Score + Quick Stats */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <HealthScoreRing score={kpiData.healthScore} />
            <View style={styles.heroTrend}>
              <Text style={styles.heroTrendText}>▲ +{kpiData.healthTrend}pts this month</Text>
            </View>
          </View>
          <View style={styles.heroRight}>
            <Text style={styles.heroLabel}>Business Health Score</Text>
            <Text style={styles.heroSub}>Across 4 performance pillars</Text>
            <View style={{ marginTop: 14, gap: 6 }}>
              {pillarsData.slice(0, 2).map(p => (
                <View key={p.label} style={styles.miniPillar}>
                  <Text style={styles.miniPillarLabel}>{p.label}</Text>
                  <View style={styles.miniPillarTrack}>
                    <View style={[styles.miniPillarFill, { width: `${p.score}%`, backgroundColor: p.color }]} />
                  </View>
                  <Text style={[styles.miniPillarScore, { color: p.color }]}>{p.score}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent2} />}
      >
        {/* Revenue & Growth */}
        <SectionHeader title="Revenue & Growth" subtitle="Last 6 months" action="Details →" onAction={() => navigation.navigate('KPIs')} />
        <View style={styles.kpiRow}>
          <KpiCard label="Total Revenue" value={kpiData.revenue.value} trend={kpiData.revenue.trend} format="currency" color={Colors.accent} />
          <View style={{ width: Spacing.sm }} />
          <KpiCard label="Gross Margin" value={kpiData.grossMargin.value} trend={kpiData.grossMargin.trend} format="percent" color={Colors.green} />
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Monthly Revenue</Text>
            <Text style={styles.chartValue}>$428K</Text>
          </View>
          <LineChart
            data={revenueChartData}
            width={CHART_WIDTH - Spacing.lg * 2}
            height={160}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: Colors.surface,
              backgroundGradientTo: Colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(96,165,250,${opacity})`,
              labelColor: () => Colors.text3,
              propsForDots: { r: '4', strokeWidth: '2', stroke: Colors.accent },
              propsForBackgroundLines: { strokeDasharray: '', stroke: Colors.border, strokeWidth: 1 },
            }}
            bezier
            style={{ borderRadius: Radius.md, marginTop: 8 }}
            withShadow={false}
            yAxisSuffix="K"
          />
        </View>

        {/* Profitability Row */}
        <SectionHeader title="Profitability" subtitle="Net & operating metrics" />
        <View style={styles.kpiRow}>
          <KpiCard label="Net Profit" value={kpiData.netProfit.value} trend={kpiData.netProfit.trend} format="percent" color={Colors.gold} />
          <View style={{ width: Spacing.sm }} />
          <KpiCard label="Op. Costs" value={kpiData.operatingCost.value} trend={kpiData.operatingCost.trend} format="currency" color={Colors.red} />
        </View>

        {/* Customer Metrics */}
        <SectionHeader title="Customer Metrics" />
        <View style={styles.kpiRow3}>
          <KpiCard label="CAC" value={kpiData.cac.value} trend={kpiData.cac.trend} format="currency" size="sm" color={Colors.teal} />
          <View style={{ width: Spacing.sm }} />
          <KpiCard label="LTV" value={kpiData.ltv.value} trend={kpiData.ltv.trend} format="currencyK" size="sm" color={Colors.purple} />
          <View style={{ width: Spacing.sm }} />
          <KpiCard label="Churn" value={kpiData.churn.value} trend={kpiData.churn.trend} format="percent" size="sm" color={Colors.red} />
        </View>

        {/* 4 Pillars */}
        <SectionHeader title="KPI Pillars" subtitle="Performance framework" action="See All →" onAction={() => navigation.navigate('KPIs')} />
        <View style={styles.pillarsCard}>
          {pillarsData.map(p => (
            <PillarBar key={p.label} label={p.label} score={p.score} color={p.color} icon={p.icon} />
          ))}
        </View>

        {/* Recent Alerts */}
        <SectionHeader title="Recent Alerts" action={`${alertsData.length} total →`} onAction={() => navigation.navigate('Alerts')} />
        {alertsData.slice(0, 2).map(alert => (
          <AlertCard key={alert.id} alert={alert} onPress={() => navigation.navigate('Alerts')} />
        ))}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  greeting: { fontSize: 14, color: Colors.text2 },
  orgName: { fontSize: 20, fontWeight: '800', color: Colors.text, letterSpacing: -0.4 },
  notifBtn: { width: 42, height: 42, backgroundColor: Colors.surface, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: Colors.red, borderRadius: 4, borderWidth: 1.5, borderColor: Colors.bg2 },
  heroCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.md, flexDirection: 'row', borderWidth: 1, borderColor: Colors.border2, gap: 16 },
  heroLeft: { alignItems: 'center', justifyContent: 'center' },
  heroTrend: { marginTop: 8 },
  heroTrendText: { fontSize: 11, color: Colors.green2, fontWeight: '600' },
  heroRight: { flex: 1 },
  heroLabel: { fontSize: 15, fontWeight: '700', color: Colors.text },
  heroSub: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  miniPillar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniPillarLabel: { fontSize: 11, color: Colors.text3, width: 70 },
  miniPillarTrack: { flex: 1, height: 4, backgroundColor: Colors.bg4, borderRadius: 99 },
  miniPillarFill: { height: 4, borderRadius: 99 },
  miniPillarScore: { fontSize: 11, fontWeight: '700', width: 24, textAlign: 'right' },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  kpiRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  kpiRow3: { flexDirection: 'row', marginBottom: Spacing.sm },
  chartCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle: { fontSize: 13, color: Colors.text2, fontWeight: '500' },
  chartValue: { fontSize: 18, fontWeight: '700', color: Colors.text },
  pillarsCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
});
