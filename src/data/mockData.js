export const kpiData = {
  healthScore: 74,
  healthTrend: +6,
  revenue: { value: 4280000, trend: +12.4, label: 'Total Revenue' },
  grossMargin: { value: 68.2, trend: +2.1, label: 'Gross Margin' },
  netProfit: { value: 22.7, trend: -1.8, label: 'Net Profit Margin' },
  cac: { value: 142, trend: -8.3, label: 'Cust. Acq. Cost' },
  ltv: { value: 3840, trend: +5.6, label: 'Lifetime Value' },
  churn: { value: 3.2, trend: +0.4, label: 'Churn Rate' },
  operatingCost: { value: 1920000, trend: +4.1, label: 'Operating Costs' },
  revenuePerEmp: { value: 186000, trend: +9.2, label: 'Rev / Employee' },
  cashInflow: { value: 5100000, trend: +18.2, label: 'Cash Inflow' },
  cashOutflow: { value: 3820000, trend: +6.8, label: 'Cash Outflow' },
  retentionRate: { value: 96.8, trend: -0.4, label: 'Retention Rate' },
};

export const revenueChartData = {
  labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      data: [310, 345, 390, 360, 420, 428],
      color: (opacity = 1) => `rgba(59,130,246,${opacity})`,
      strokeWidth: 2,
    },
  ],
};

export const cashFlowData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    { data: [980, 1120, 1340, 1510], color: (o = 1) => `rgba(16,185,129,${o})` },
    { data: [820, 910, 980, 1090], color: (o = 1) => `rgba(239,68,68,${o})` },
  ],
};

export const pillarsData = [
  { label: 'Progress', score: 82, color: '#3B82F6', icon: '📈' },
  { label: 'Profitability', score: 68, color: '#10B981', icon: '💰' },
  { label: 'Cost Efficiency', score: 71, color: '#F59E0B', icon: '⚙️' },
  { label: 'Consolidation', score: 79, color: '#8B5CF6', icon: '🔒' },
];

export const alertsData = [
  {
    id: 1, type: 'warning', title: 'Churn Rate Rising',
    body: 'Churn increased 0.4% MoM. Engage at-risk customers in the SME segment.',
    time: '2h ago', pillar: 'Consolidation',
  },
  {
    id: 2, type: 'danger', title: 'Net Margin Declining',
    body: 'Net profit margin dropped 1.8%. Operating costs growing faster than revenue.',
    time: '5h ago', pillar: 'Profitability',
  },
  {
    id: 3, type: 'success', title: 'Revenue Milestone Hit',
    body: 'Monthly revenue exceeded $4.2M target by 1.9%. Growth trajectory on track.',
    time: '1d ago', pillar: 'Progress',
  },
  {
    id: 4, type: 'info', title: 'LTV/CAC Ratio Strong',
    body: 'LTV:CAC ratio at 27x, well above the 3x benchmark. Customer acquisition efficient.',
    time: '2d ago', pillar: 'Progress',
  },
  {
    id: 5, type: 'warning', title: 'Ops Cost Overrun Risk',
    body: 'Operating expense ratio trending toward 46%. Recommended ceiling: 45%.',
    time: '3d ago', pillar: 'Cost Efficiency',
  },
];

export const dataSources = [
  { id: 1, name: 'Google Drive', icon: '📁', connected: true, records: '1,240 files', lastSync: '10 min ago' },
  { id: 2, name: 'Salesforce CRM', icon: '☁️', connected: true, records: '8,412 contacts', lastSync: '1 hr ago' },
  { id: 3, name: 'QuickBooks', icon: '💳', connected: true, records: '36 months', lastSync: '30 min ago' },
  { id: 4, name: 'Zoom Meetings', icon: '🎥', connected: false, records: null, lastSync: null },
  { id: 5, name: 'Dropbox', icon: '📦', connected: false, records: null, lastSync: null },
  { id: 6, name: 'HubSpot', icon: '🔶', connected: false, records: null, lastSync: null },
  { id: 7, name: 'MS Teams', icon: '💬', connected: false, records: null, lastSync: null },
  { id: 8, name: 'PostgreSQL', icon: '🗄️', connected: true, records: '2.4M rows', lastSync: '5 min ago' },
];

export const insightQuestions = [
  'What is our profit margin trend this quarter?',
  'Which department has the highest cost inefficiency?',
  'How does our CAC compare to industry benchmark?',
  'What is driving the revenue growth this month?',
  'Are we at risk of cash flow issues in Q1?',
  'Which customer segment has the highest churn?',
];

export const departments = [
  { name: 'Sales', efficiency: 88, headcount: 24, revPerHead: 312000 },
  { name: 'Engineering', efficiency: 76, headcount: 38, revPerHead: 198000 },
  { name: 'Marketing', efficiency: 64, headcount: 12, revPerHead: 124000 },
  { name: 'Operations', efficiency: 71, headcount: 18, revPerHead: 166000 },
  { name: 'Finance', efficiency: 92, headcount: 8, revPerHead: 410000 },
  { name: 'Support', efficiency: 79, headcount: 16, revPerHead: 142000 },
];
