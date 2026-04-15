import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors, Spacing, Radius } from '../theme';
import { SectionHeader, KpiCard, Badge } from '../components';
import { kpiData, departments } from '../data/mockData';

const { width } = Dimensions.get('window');

const TABS = ['Overview', 'Customers', 'Workforce', 'Cash Flow'];

export default function KPIsScreen() {
  const [activeTab, setActiveTab] = useState(0);

  const deptData = {
    labels: departments.map(d => d.name.substring(0, 3)),
    datasets: [{ data: departments.map(d => d.efficiency) }],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59,130,246,${opacity})`,
    labelColor: () => Colors.text3,
    propsForBackgroundLines: { stroke: Colors.border, strokeWidth: 1 },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KPI Framework</Text>
        <Text style={styles.headerSub}>4-pillar business performance evaluation</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabs}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(i)}
            style={[styles.tab, activeTab === i && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Overview Tab */}
        {activeTab === 0 && <>
          <SectionHeader title="Revenue & Growth" subtitle="Progress Pillar · Score: 82" />
          <View style={styles.row}>
            <KpiCard label="Total Revenue" value={kpiData.revenue.value} trend={kpiData.revenue.trend} format="currency" color={Colors.accent} />
            <View style={{ width: 10 }} />
            <KpiCard label="Growth Rate" value={kpiData.revenue.trend} trend={0} format="percent" color={Colors.green} />
          </View>

          <SectionHeader title="Profitability" subtitle="Profitability Pillar · Score: 68" />
          <View style={styles.row}>
            <KpiCard label="Gross Margin" value={kpiData.grossMargin.value} trend={kpiData.grossMargin.trend} format="percent" color={Colors.gold} />
            <View style={{ width: 10 }} />
            <KpiCard label="Net Margin" value={kpiData.netProfit.value} trend={kpiData.netProfit.trend} format="percent" color={Colors.purple} />
          </View>

          <SectionHeader title="Cost Efficiency" subtitle="Cost Pillar · Score: 71" />
          <View style={styles.row}>
            <KpiCard label="Op. Costs" value={kpiData.operatingCost.value} trend={kpiData.operatingCost.trend} format="currency" color={Colors.red} />
            <View style={{ width: 10 }} />
            <KpiCard label="Cost Ratio" value={44.9} trend={-1.2} format="percent" color={Colors.teal} />
          </View>

          <SectionHeader title="Consolidation" subtitle="Retention Pillar · Score: 79" />
          <View style={styles.row}>
            <KpiCard label="Retention" value={kpiData.retentionRate.value} trend={kpiData.retentionRate.trend} format="percent" color={Colors.green} />
            <View style={{ width: 10 }} />
            <KpiCard label="Churn" value={kpiData.churn.value} trend={kpiData.churn.trend} format="percent" color={Colors.red} />
          </View>
        </>}

        {/* Customers Tab */}
        {activeTab === 1 && <>
          <SectionHeader title="Customer Economics" />
          <View style={styles.row}>
            <KpiCard label="CAC" value={kpiData.cac.value} trend={kpiData.cac.trend} format="currency" color={Colors.teal} />
            <View style={{ width: 10 }} />
            <KpiCard label="LTV" value={kpiData.ltv.value} trend={kpiData.ltv.trend} format="currencyK" color={Colors.purple} />
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricCardTitle}>LTV : CAC Ratio</Text>
            <View style={styles.ratioRow}>
              <Text style={styles.ratioValue}>27x</Text>
              <Badge label="Excellent — Benchmark: 3x" color={Colors.green2} />
            </View>
            <Text style={styles.metricCardSub}>Every $1 spent on acquisition returns $27 in lifetime value.</Text>
          </View>

          <SectionHeader title="Churn & Retention" />
          <View style={styles.row}>
            <KpiCard label="Churn Rate" value={kpiData.churn.value} trend={kpiData.churn.trend} format="percent" color={Colors.red} />
            <View style={{ width: 10 }} />
            <KpiCard label="Retention" value={kpiData.retentionRate.value} trend={kpiData.retentionRate.trend} format="percent" color={Colors.green} />
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricCardTitle}>Churn Risk Signal</Text>
            <View style={[styles.riskBadge, { backgroundColor: 'rgba(245,158,11,0.15)', borderColor: Colors.gold + '50' }]}>
              <Text style={{ color: Colors.gold2, fontSize: 13 }}>⚠️  Churn up 0.4% this month — SME segment flagged</Text>
            </View>
            <Text style={styles.metricCardSub}>Recommend targeted re-engagement campaign for SME clients with 3–6 month inactivity.</Text>
          </View>
        </>}

        {/* Workforce Tab */}
        {activeTab === 2 && <>
          <SectionHeader title="Workforce Productivity" />
          <View style={styles.row}>
            <KpiCard label="Rev / Employee" value={kpiData.revenuePerEmp.value} trend={kpiData.revenuePerEmp.trend} format="currency" color={Colors.accent} />
            <View style={{ width: 10 }} />
            <KpiCard label="Total Headcount" value={116} trend={8.4} format="number" color={Colors.purple} />
          </View>

          <SectionHeader title="Department Efficiency" subtitle="Score out of 100" />
          <View style={styles.chartCard}>
            <BarChart
              data={deptData}
              width={width - Spacing.lg * 2 - 32}
              height={180}
              chartConfig={{ ...chartConfig, color: (op = 1) => `rgba(139,92,246,${op})` }}
              style={{ borderRadius: Radius.md }}
              showValuesOnTopOfBars
              fromZero
              yAxisSuffix=""
              withInnerLines={false}
            />
          </View>

          {departments.map(dept => (
            <View key={dept.name} style={styles.deptRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptMeta}>{dept.headcount} people · ${(dept.revPerHead / 1000).toFixed(0)}K/head</Text>
              </View>
              <View style={styles.deptEfficiency}>
                <Text style={[styles.deptScore, { color: dept.efficiency >= 80 ? Colors.green2 : dept.efficiency >= 70 ? Colors.gold2 : Colors.red2 }]}>
                  {dept.efficiency}
                </Text>
              </View>
            </View>
          ))}
        </>}

        {/* Cash Flow Tab */}
        {activeTab === 3 && <>
          <SectionHeader title="Cash Flow Summary" />
          <View style={styles.row}>
            <KpiCard label="Inflow" value={kpiData.cashInflow.value} trend={kpiData.cashInflow.trend} format="currency" color={Colors.green} />
            <View style={{ width: 10 }} />
            <KpiCard label="Outflow" value={kpiData.cashOutflow.value} trend={kpiData.cashOutflow.trend} format="currency" color={Colors.red} />
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricCardTitle}>Net Cash Position</Text>
            <Text style={[styles.ratioValue, { color: Colors.green2 }]}>+$1.28M</Text>
            <Text style={styles.metricCardSub}>Positive net cash flow. Operating runway: 14+ months at current burn rate.</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={styles.metricCardTitle}>Inflow vs Outflow</Text>
              <Badge label="Healthy" color={Colors.green2} />
            </View>
            {[
              { label: 'Revenue from Services', amount: 3820000, pct: 75, color: Colors.accent },
              { label: 'Recurring Subscriptions', amount: 860000, pct: 17, color: Colors.purple },
              { label: 'Consulting', amount: 420000, pct: 8, color: Colors.teal },
            ].map(item => (
              <View key={item.label} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, color: Colors.text2 }}>{item.label}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text }}>${(item.amount / 1000).toFixed(0)}K</Text>
                </View>
                <View style={{ height: 4, backgroundColor: Colors.bg4, borderRadius: 99 }}>
                  <View style={{ height: 4, width: `${item.pct}%`, backgroundColor: item.color, borderRadius: 99 }} />
                </View>
              </View>
            ))}
          </View>
        </>}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: Colors.text3, marginTop: 2 },
  tabsScroll: { backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabs: { paddingHorizontal: Spacing.lg, paddingVertical: 10, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border },
  tabActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabText: { fontSize: 13, fontWeight: '500', color: Colors.text2 },
  tabTextActive: { color: Colors.white, fontWeight: '600' },
  scroll: { padding: Spacing.lg },
  row: { flexDirection: 'row', marginBottom: Spacing.sm },
  metricCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  metricCardTitle: { fontSize: 13, fontWeight: '600', color: Colors.text2, marginBottom: 8 },
  metricCardSub: { fontSize: 13, color: Colors.text3, lineHeight: 19, marginTop: 8 },
  ratioRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ratioValue: { fontSize: 32, fontWeight: '800', color: Colors.green2, letterSpacing: -1 },
  riskBadge: { borderRadius: Radius.sm, padding: 10, borderWidth: 1 },
  chartCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  deptRow: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  deptName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  deptMeta: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  deptEfficiency: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bg4, alignItems: 'center', justifyContent: 'center' },
  deptScore: { fontSize: 14, fontWeight: '800' },
});
