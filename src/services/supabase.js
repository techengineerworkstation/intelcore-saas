import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Replace these with your actual Supabase project values from:
// https://supabase.com/dashboard → Project Settings → API
export const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || 'https://YOUR_PROJECT.supabase.co';
export const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || 'YOUR_ANON_KEY';

// ─── SECURE STORAGE ADAPTER (required for React Native) ──────────────────────
const ExpoSecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ─── AUTH SERVICES ────────────────────────────────────────────────────────────

export const authService = {
  // Email/Password Sign Up
  signUpWithEmail: async (email, password, fullName, companyName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, company_name: companyName },
      },
    });
    return { data, error };
  },

  // Email/Password Sign In
  signInWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  // Google OAuth (via Expo AuthSession)
  signInWithGoogle: async (redirectUrl) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
    });
    return { data, error };
  },

  // Apple OAuth (via Expo AuthSession)
  signInWithApple: async (redirectUrl) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
    });
    return { data, error };
  },

  // Password Reset
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  // Sign Out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
};

// ─── USER PROFILE SERVICE ─────────────────────────────────────────────────────

export const profileService = {
  // Upsert profile after login
  upsertProfile: async (user, extra = {}) => {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || extra.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || null,
      company_name: user.user_metadata?.company_name || extra.company_name || '',
      role: extra.role || 'CEO',
      updated_at: new Date().toISOString(),
    });
    return { error };
  },

  // Fetch profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },
};

// ─── AI QUERY SERVICE ─────────────────────────────────────────────────────────

export const queryService = {
  // Save an AI insight query + response
  saveQuery: async (userId, question, answer) => {
    const { data, error } = await supabase.from('ai_queries').insert({
      user_id: userId,
      question,
      answer,
      created_at: new Date().toISOString(),
    }).select().single();
    return { data, error };
  },

  // Fetch user's query history
  getQueryHistory: async (userId, limit = 50) => {
    const { data, error } = await supabase
      .from('ai_queries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Delete a query
  deleteQuery: async (queryId) => {
    const { error } = await supabase.from('ai_queries').delete().eq('id', queryId);
    return { error };
  },
};

// ─── KPI SNAPSHOT SERVICE ─────────────────────────────────────────────────────

export const kpiService = {
  // Save a KPI snapshot
  saveSnapshot: async (userId, kpiData) => {
    const { data, error } = await supabase.from('kpi_snapshots').insert({
      user_id: userId,
      health_score: kpiData.healthScore,
      revenue: kpiData.revenue?.value,
      gross_margin: kpiData.grossMargin?.value,
      net_profit: kpiData.netProfit?.value,
      churn_rate: kpiData.churn?.value,
      cac: kpiData.cac?.value,
      ltv: kpiData.ltv?.value,
      snapshot_date: new Date().toISOString(),
    }).select().single();
    return { data, error };
  },

  // Fetch KPI history for trend charts
  getKpiHistory: async (userId, days = 90) => {
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const { data, error } = await supabase
      .from('kpi_snapshots')
      .select('*')
      .eq('user_id', userId)
      .gte('snapshot_date', since)
      .order('snapshot_date', { ascending: true });
    return { data, error };
  },

  // Get latest snapshot
  getLatestSnapshot: async (userId) => {
    const { data, error } = await supabase
      .from('kpi_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },
};

// ─── DATA SOURCES SERVICE ─────────────────────────────────────────────────────

export const dataSourceService = {
  // Get user's connected sources
  getUserSources: async (userId) => {
    const { data, error } = await supabase
      .from('data_sources')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    return { data, error };
  },

  // Toggle/upsert a source connection
  upsertSource: async (userId, source) => {
    const { data, error } = await supabase.from('data_sources').upsert({
      user_id: userId,
      name: source.name,
      icon: source.icon,
      connected: source.connected,
      records: source.records || null,
      last_sync: source.connected ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id, name' }).select().single();
    return { data, error };
  },
};

// ─── ALERTS SERVICE ───────────────────────────────────────────────────────────

export const alertService = {
  // Save an AI-generated alert
  saveAlert: async (userId, alert) => {
    const { data, error } = await supabase.from('alerts').insert({
      user_id: userId,
      type: alert.type,
      title: alert.title,
      body: alert.body,
      pillar: alert.pillar,
      is_read: false,
      created_at: new Date().toISOString(),
    }).select().single();
    return { data, error };
  },

  // Fetch user alerts
  getAlerts: async (userId, limit = 30) => {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Mark alert as read
  markRead: async (alertId) => {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alertId);
    return { error };
  },

  // Get unread count
  getUnreadCount: async (userId) => {
    const { count, error } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    return { count, error };
  },
};

// ─── ADMIN SERVICE ──────────────────────────────────────────────────────────────

export const adminService = {
  // Check if user is admin
  isAdmin: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    return { isAdmin: data?.is_admin || false, error };
  },

  // Get all users (admin only)
  getAllUsers: async (adminId) => {
    const { data, error } = await supabase.rpc('admin_get_all_users', { p_admin_id: adminId });
    return { data, error };
  },

  // Update user plan
  updateUserPlan: async (adminId, userId, plan) => {
    const { data, error } = await supabase.rpc('admin_update_user_plan', {
      p_admin_id: adminId,
      p_user_id: userId,
      p_plan: plan,
    });
    return { data, error };
  },

  // Get all analytics (admin only)
  getAllAnalytics: async (adminId) => {
    const { data, error } = await supabase.rpc('admin_get_analytics', { p_admin_id: adminId });
    return { data, error };
  },
};

// ─── PAYMENT SERVICE ───────────────────────────────────────────────────────────

export const paymentService = {
  // Get subscription plans
  getPlans: () => [
    { id: 'starter', name: 'Starter', price: 29, interval: 'month', features: ['AI Insights', '5 Data Sources', 'Basic KPIs', 'Email Support'] },
    { id: 'pro', name: 'Pro', price: 79, interval: 'month', features: ['Everything in Starter', 'Unlimited Data Sources', 'Advanced Analytics', 'Priority Support', 'Export Features'] },
    { id: 'enterprise', name: 'Enterprise', price: 199, interval: 'month', features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Account Manager', 'SLA', 'Custom Reports'] },
  ],

  // Initiate PayPal subscription
  createPayPalSubscription: async (userId, planId, paypalAccessToken) => {
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paypalAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: `PLAN-${planId.toUpperCase()}`,
        subscriber: { email_address: userId },
        application_context: { brand_name: 'IntelCore SaaS', landing_page: 'NO_PREFERENCE' },
      }),
    });
    return response.json();
  },

  // Verify Paystack payment
  verifyPaystackPayment: async (reference, secretKey) => {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    return response.json();
  },
};

// ─── OPENCODE AI SERVICE ───────────────────────────────────────────────────────

const OPENCODE_API_URL = 'https://opencode.ai/api';

export const opencodeAIService = {
  // Send a chat message to OpenCode AI
  chat: async (message, systemPrompt, apiKey) => {
    try {
      const response = await fetch(`${OPENCODE_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'opencode',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: 1000,
        }),
      });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Generate company profitability insights
  generateProfitabilityInsights: async (kpiData, profile, apiKey) => {
    const systemPrompt = `You are IntelCore SaaS, an elite business intelligence analyst specializing in company profitability analysis. 
Analyze the provided KPI data and provide actionable insights about:
- Revenue trends and growth patterns
- Profit margins and efficiency
- Cost structure analysis
- Recommendations for improvement

Provide insights in a concise, executive-friendly format with bullet points.`;

    const message = `Company: ${profile?.company_name || 'N/A'}
Role: ${profile?.role || 'Executive'}
Current KPIs: ${JSON.stringify(kpiData)}

Provide detailed profitability insights and recommendations.`;

    return opencodeAIService.chat(message, systemPrompt, apiKey);
  },

  // Generate work productivity insights
  generateProductivityInsights: async (kpiData, profile, apiKey) => {
    const systemPrompt = `You are IntelCore SaaS, an elite business intelligence analyst specializing in workforce productivity analysis.
Analyze the provided KPI data and provide insights about:
- Employee performance metrics
- Revenue per employee
- Workload distribution
- Efficiency improvements

Provide actionable recommendations in bullet point format.`;

    const message = `Company: ${profile?.company_name || 'N/A'}
Role: ${profile?.role || 'Executive'}
Productivity KPIs: ${JSON.stringify(kpiData)}

Provide productivity insights and recommendations.`;

    return opencodeAIService.chat(message, systemPrompt, apiKey);
  },

  // Generate summary of all KPIs
  generateKPISummary: async (kpiData, profile, apiKey) => {
    const systemPrompt = `You are IntelCore SaaS, an elite business intelligence analyst.
Create a comprehensive executive summary of all provided KPIs covering:
- Overall business health score
- Key metrics overview
- Trends and changes
- Top 3 action items

Keep it concise (max 200 words) with clear sections.`;

    const message = `Company: ${profile?.company_name || 'N/A'}
All KPIs: ${JSON.stringify(kpiData)}

Generate a comprehensive summary.`;

    return opencodeAIService.chat(message, systemPrompt, apiKey);
  },

  // Generate risk and opportunity alerts
  generateAlerts: async (kpiData, profile, apiKey) => {
    const systemPrompt = `You are IntelCore SaaS, an AI that generates business alerts.
Analyze KPI data and identify:
- Risks (declining metrics, concerning trends)
- Opportunities (growth areas, improvements)
- Warnings (approaching thresholds)

Return alerts in JSON format: [{"type": "warning|danger|success", "title": "...", "body": "...", "pillar": "..."}]`;

    const message = `Company: ${profile?.company_name || 'N/A'}
KPIs: ${JSON.stringify(kpiData)}

Generate relevant alerts.`;

    return opencodeAIService.chat(message, systemPrompt, apiKey);
  },

  // Answer any business question
  askQuestion: async (question, context, profile, apiKey) => {
    const systemPrompt = `You are IntelCore SaaS, an elite enterprise business intelligence analyst.
Answer questions about business performance, KPIs, financials, and strategy.
Be concise (max 180 words), use bullet points for recommendations, and start with a one-line verdict.`;

    const message = `Context: ${JSON.stringify(context)}
Question: ${question}

Provide a clear, data-driven answer.`;

    return opencodeAIService.chat(message, systemPrompt, apiKey);
  },
};
