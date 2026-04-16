export { supabaseConfig, opencodeConfig, paypalConfig, paystackConfig, adminEmail, appUrl } from './config';

export const kpiData = {
  healthScore: 74,
  healthTrend: +6,
  revenue: { value: 4280000, trend: +12.4, label: 'Total Revenue' },
  grossMargin: { value: 68.2, trend: +2.1, label: 'Gross Margin' },
  netProfit: { value: 22.7, trend: -1.8, label: 'Net Profit Margin' },
  cac: { value: 142, trend: -8.3, label: 'Cust. Acq. Cost' },
  ltv: { value: 3840, trend: +5.6, label: 'Lifetime Value' },
  churn: { value: 3.2, trend: +0.4, label: 'Churn Rate' },
};

export const pillarsData = [
  { label: 'Progress', score: 82, color: '#3B82F6' },
  { label: 'Profitability', score: 68, color: '#10B981' },
  { label: 'Cost Efficiency', score: 71, color: '#F59E0B' },
  { label: 'Consolidation', score: 79, color: '#8B5CF6' },
];

export const dataSources = [
  { id: 1, name: 'HubSpot', icon: '🔶', category: 'CRM', connected: false },
  { id: 2, name: 'Salesforce', icon: '☁️', category: 'CRM', connected: true, records: '8,412' },
  { id: 3, name: 'QuickBooks', icon: '💳', category: 'Finance', connected: true, records: '36 mo' },
  { id: 4, name: 'Jira', icon: '📋', category: 'Project', connected: false },
  { id: 5, name: 'Zendesk', icon: '🎫', category: 'Support', connected: false },
  { id: 6, name: 'PostgreSQL', icon: '🗄️', category: 'Database', connected: true, records: '2.4M' },
];