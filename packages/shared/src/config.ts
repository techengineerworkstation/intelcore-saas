export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
};

export const opencodeConfig = {
  apiKey: process.env.NEXT_PUBLIC_OPENCODE_API_KEY || process.env.OPENCODE_API_KEY || '',
};

export const paypalConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID || '',
};

export const paystackConfig = {
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
};

export const adminEmail = 'techengineerworkstation@gmail.com';
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://intelcorehub.sbs';