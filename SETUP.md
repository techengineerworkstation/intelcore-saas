# IntelCore SaaS - Setup & Deployment Guide

## Overview
IntelCore SaaS is an enterprise business intelligence mobile/web app with:
- **Authentication**: Email, Google, Apple (via Supabase + Firebase)
- **AI Features**: OpenCode AI for insights, profitability analysis, productivity metrics
- **Database**: Supabase (PostgreSQL with RLS)
- **Payments**: PayPal & Paystack subscriptions
- **Admin**: Full admin access for techengineerworkstation@gmail.com

---

## STEP 1: Create External Services

### 1.1 Supabase (Database & Auth)
1. Go to https://supabase.com → Create new project "IntelCore-SaaS"
2. Note your `Project URL` and `anon` key from Settings → API
3. Run `supabase/schema.sql` in Supabase SQL Editor
4. **Set admin**: In profiles table, set `is_admin = true` for techengineerworkstation@gmail.com

### 1.2 Firebase (Google & Apple OAuth)
1. Go to https://console.firebase.google.com → Create project "intelcore-saas"
2. Enable Authentication → Google & Apple providers
3. Get OAuth credentials and add to Supabase Authentication → Providers

### 1.3 Vercel (Web Hosting)
1. Go to https://vercel.com → Import this repo
2. Add environment variables (see `.env.example`)

---

## STEP 2: Environment Variables

Create `.env` file in project root:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# OpenCode AI
NEXT_PUBLIC_OPENCODE_API_KEY=your-opencode-key

# PayPal (get from https://developer.paypal.com)
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-secret

# Paystack (get from https://paystack.com)
PAYSTACK_PUBLIC_KEY=your-public-key
PAYSTACK_SECRET_KEY=your-secret-key

# App
NEXT_PUBLIC_APP_URL=https://intelcorehub.sbs
NEXT_PUBLIC_ADMIN_EMAIL=techengineerworkstation@gmail.com
```

---

## STEP 3: Update app.json

Update `app.json` with your actual API keys:
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project.supabase.co",
      "supabaseAnonKey": "your-anon-key",
      "opencodeApiKey": "your-opencode-key"
    }
  }
}
```

---

## STEP 4: Run Locally

```bash
npm install
npx expo start
```

- Press `w` for web
- Press `a` for Android
- Press `i` for iOS

---

## STEP 5: GitHub & Deployment

### 5.1 GitHub
```bash
git init
git add .
git commit -m "IntelCore SaaS v2.0 - Initial commit"
gh repo create intelcore-saas --public
git push -u origin main
```

### 5.2 Vercel (Web)
1. Import repo on Vercel
2. Set environment variables
3. Deploy

### 5.3 Expo EAS (Mobile)
```bash
npm install -g eas-cli
eas login
eas build --platform all --profile production
```

---

## STEP 6: App/Play Store

### Apple App Store
1. Create Apple Developer account
2. Configure bundle ID in app.json
3. Run: `eas submit --platform ios`

### Google Play Store
1. Create Google Play Console account
2. Configure package name in app.json
3. Run: `eas submit --platform android`

---

## Admin Features

The admin (techengineerworkstation@gmail.com) has:
- View all users
- Update user subscription plans
- View analytics dashboard
- Access all features without payment

Regular users must subscribe via PayPal/Paystack to access full features.