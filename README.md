# IntelCore SaaS v2.0 — Auth + Database

React Native (Expo) app for iOS & Android with full auth and persistent database.

## What's New in v2.0
- Google, Apple & Email authentication (Supabase Auth)
- PostgreSQL database with Row-Level Security
- AI query history saved per user
- User profiles, KPI snapshots, alerts persisted to DB
- Secure token storage (expo-secure-store)
- Auth-gated navigation (unauthenticated users see Login first)

## Quick Start

### 1. Create Supabase Project
Go to https://supabase.com → New Project

### 2. Run Database Schema
Supabase Dashboard → SQL Editor → paste contents of supabase/schema.sql → Run

### 3. Get API Keys
Supabase Dashboard → Project Settings → API
Copy: Project URL + anon/public key

### 4. Update app.json
```json
"extra": {
  "supabaseUrl": "https://YOUR_PROJECT.supabase.co",
  "supabaseAnonKey": "YOUR_ANON_KEY"
}
```

### 5. Enable OAuth Providers in Supabase

**Google:**
- Supabase → Authentication → Providers → Google → Enable
- Google Cloud Console → OAuth 2.0 Credentials
- Redirect URI: https://YOUR_PROJECT.supabase.co/auth/v1/callback
- Paste Client ID + Secret into Supabase

**Apple:**
- Supabase → Authentication → Providers → Apple → Enable
- Requires Apple Developer Account ($99/yr)
- Bundle ID: com.ibestechub.insightcoreai
- Redirect URI: https://YOUR_PROJECT.supabase.co/auth/v1/callback

### 6. Run Locally
```bash
npm install
npx expo start
```

## Build & Publish
```bash
npm install -g eas-cli
eas login
eas build --platform all --profile production
eas submit --platform ios      # Apple Developer Account needed
eas submit --platform android  # Google Play Console needed
```

## Database Tables
| Table         | Purpose                                    |
|---------------|--------------------------------------------|
| profiles      | User name, company, role, plan             |
| ai_queries    | AI Insight Q&A history per user            |
| kpi_snapshots | Time-series KPI data per user              |
| data_sources  | Connected integrations per user            |
| alerts        | AI-generated risk/opportunity flags        |

All tables use Row-Level Security — users only see their own data.

## Project Structure
```
src/
  services/supabase.js       Supabase client + all DB/auth services
  context/AuthContext.js     Global auth state (user, profile, session)
  screens/auth/
    LoginScreen.js           Email + Google + Apple
    SignUpScreen.js          2-step registration with role picker
    ForgotPasswordScreen.js  Password reset via email
  screens/
    DashboardScreen.js
    InsightsScreen.js        AI chat — queries saved to DB
    KPIsScreen.js
    AlertsScreen.js
    DataSourcesScreen.js
    SettingsScreen.js        Live profile editing + real sign out
  navigation/index.js        Auth-gated routing
supabase/schema.sql          Full DB schema — run this first
```

## Contact
Ibe's Tech Hub — Lagos, Nigeria
ibestechub@gmail.com | +2347010744142
