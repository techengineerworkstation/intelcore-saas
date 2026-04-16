-- ============================================================
-- IntelCore SaaS — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- TABLE: profiles
-- Stores user profile info (extended from auth.users)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          TEXT NOT NULL,
  full_name      TEXT,
  avatar_url     TEXT,
  company_name   TEXT,
  role           TEXT DEFAULT 'CEO',
  plan           TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
  is_admin       BOOLEAN DEFAULT FALSE,
  onboarded      BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: users can only see/edit their own profile (admins can see all)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));


-- ─────────────────────────────────────────────────────────────
-- TABLE: ai_queries
-- Stores every AI Insight question + answer per user
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_queries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own queries"
  ON public.ai_queries FOR ALL USING (auth.uid() = user_id);

-- Index for fast user query lookups
CREATE INDEX IF NOT EXISTS idx_ai_queries_user_id ON public.ai_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_queries_created ON public.ai_queries(created_at DESC);


-- ─────────────────────────────────────────────────────────────
-- TABLE: kpi_snapshots
-- Time-series KPI data per user (saved periodically)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.kpi_snapshots (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  health_score   INTEGER,
  revenue        NUMERIC(15, 2),
  gross_margin   NUMERIC(6, 2),
  net_profit     NUMERIC(6, 2),
  churn_rate     NUMERIC(6, 3),
  cac            NUMERIC(10, 2),
  ltv            NUMERIC(10, 2),
  snapshot_date  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kpi_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own KPI snapshots"
  ON public.kpi_snapshots FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_user_date
  ON public.kpi_snapshots(user_id, snapshot_date DESC);


-- ─────────────────────────────────────────────────────────────
-- TABLE: data_sources
-- Tracks which integrations a user has connected
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.data_sources (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  icon        TEXT,
  category    TEXT,
  source_type TEXT CHECK (source_type IN ('oauth', 'file', 'database', 'api')),
  connected   BOOLEAN DEFAULT FALSE,
  records     TEXT,
  parsed_data JSONB,
  extracted_metrics JSONB,
  last_sync   TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, name)
);

ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own data sources"
  ON public.data_sources FOR ALL USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────
-- TABLE: uploaded_files
-- Stores uploaded file data (Excel, CSV, PDF, PPTX, etc.)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name        TEXT NOT NULL,
  file_type        TEXT,
  file_size        BIGINT,
  category         TEXT,
  parsed_data      JSONB,
  extracted_metrics JSONB,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'error')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own uploaded files"
  ON public.uploaded_files FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_uploaded_files_user_id ON public.uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_status ON public.uploaded_files(status);


-- ─────────────────────────────────────────────────────────────
-- TABLE: alerts
-- AI-generated risk/opportunity alerts per user
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.alerts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('warning', 'danger', 'success', 'info')),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  pillar      TEXT,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own alerts"
  ON public.alerts FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_alerts_user_unread
  ON public.alerts(user_id, is_read);


-- ─────────────────────────────────────────────────────────────
-- TRIGGER: auto-create profile on new user signup
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'company_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────────────────────
-- FUNCTION: get_user_dashboard_summary
-- Returns a summary object for a user's latest state
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_user_dashboard_summary(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_profile     RECORD;
  v_latest_kpi  RECORD;
  v_query_count BIGINT;
  v_alert_count BIGINT;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;
  SELECT * INTO v_latest_kpi
    FROM public.kpi_snapshots
    WHERE user_id = p_user_id
    ORDER BY snapshot_date DESC LIMIT 1;
  SELECT COUNT(*) INTO v_query_count FROM public.ai_queries WHERE user_id = p_user_id;
  SELECT COUNT(*) INTO v_alert_count FROM public.alerts WHERE user_id = p_user_id AND is_read = FALSE;

  RETURN JSON_BUILD_OBJECT(
    'profile', ROW_TO_JSON(v_profile),
    'latest_kpi', ROW_TO_JSON(v_latest_kpi),
    'total_queries', v_query_count,
    'unread_alerts', v_alert_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Admin function: update user plan (only admins can use)
CREATE OR REPLACE FUNCTION public.admin_update_user_plan(p_admin_id UUID, p_user_id UUID, p_plan TEXT)
RETURNS VOID AS $$
BEGIN
  -- Check if admin has admin privileges
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can update user plans';
  END IF;
  
  UPDATE public.profiles 
  SET plan = p_plan, updated_at = NOW() 
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin function: grant admin privileges
CREATE OR REPLACE FUNCTION public.admin_grant_admin(p_admin_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can grant admin privileges';
  END IF;
  
  UPDATE public.profiles 
  SET is_admin = true, updated_at = NOW() 
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─────────────────────────────────────────────────────────────
-- STORAGE BUCKET: avatars (for profile pictures)
-- ─────────────────────────────────────────────────────────────
-- Run in Supabase Storage section, OR via SQL:
INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatars are publicly viewable"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);


-- ─────────────────────────────────────────────────────────────
-- TABLE: subscriptions
-- Stores subscription/payment info per user
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan            TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'paused', 'cancelled', 'past_due')),
  provider        TEXT CHECK (provider IN ('paypal', 'paystack', 'apple', 'google')),
  subscription_id TEXT,
  customer_id     TEXT,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end   TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own subscription"
  ON public.subscriptions FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT idx_subscriptions_status ON public.subscriptions(status);


-- ─────────────────────────────────────────────────────────────
-- Admin RPC functions
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_get_all_users(p_admin_id UUID)
RETURNS TABLE(
  id UUID,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  plan TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  RETURN QUERY SELECT 
    pr.id, pr.email, pr.full_name, pr.company_name, pr.plan, pr.is_admin, pr.created_at
  FROM public.profiles pr;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_get_analytics(p_admin_id UUID)
RETURNS JSON AS $$
DECLARE
  v_total_users BIGINT;
  v_active_subs BIGINT;
  v_total_revenue NUMERIC;
  v_plan_breakdown JSON;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  SELECT COUNT(*) INTO v_total_users FROM public.profiles;
  SELECT COUNT(*) INTO v_active_subs FROM public.subscriptions WHERE status = 'active';
  
  SELECT JSON_AGG(JSON_BUILD_OBJECT('plan', plan, 'count', cnt))
  INTO v_plan_breakdown
  FROM (SELECT plan, COUNT(*) as cnt FROM public.profiles GROUP BY plan) sub;
  
  RETURN JSON_BUILD_OBJECT(
    'total_users', v_total_users,
    'active_subscriptions', v_active_subs,
    'plan_breakdown', v_plan_breakdown
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─────────────────────────────────────────────────────────────
-- TABLE: reports
-- Stores generated reports
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL,
  format      TEXT DEFAULT 'pdf',
  status      TEXT DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'error')),
  file_url    TEXT,
  data        JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reports"
  ON public.reports FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);


-- ─────────────────────────────────────────────────────────────
-- TABLE: notifications
-- Stores user notifications
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT,
  type        TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read     BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications"
  ON public.notifications FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications(user_id, is_read) WHERE is_read = FALSE;


-- ─────────────────────────────────────────────────────────────
-- TABLE: user_settings
-- Stores user preferences and settings
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  sound_enabled      BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  theme       TEXT DEFAULT 'dark',
  currency    TEXT DEFAULT 'USD',
  timezone    TEXT DEFAULT 'UTC',
  language   TEXT DEFAULT 'en',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
  ON public.user_settings FOR ALL USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────
-- TABLE: integrations
-- Stores OAuth integration tokens and status
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.integrations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider      TEXT NOT NULL CHECK (provider IN ('google', 'apple', 'hubspot', 'salesforce', 'quickbooks', 'jira', 'zendesk', 'slack')),
  access_token  TEXT,
  refresh_token TEXT,
  expires_at   TIMESTAMPTZ,
  connected    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, provider)
);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own integrations"
  ON public.integrations FOR ALL USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────
-- TABLE: audit_logs
-- Tracks user actions for security/compliance
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  details     JSONB,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);


-- ─────────────────────────────────────────────────────────────
-- Admin function: Set user as admin (run this after schema)
-- ─────────────────────────────────────────────────────────────
-- UPDATE public.profiles SET is_admin = TRUE WHERE email = 'techengineerworkstation@gmail.com';
