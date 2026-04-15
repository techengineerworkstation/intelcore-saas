import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, Radius } from '../../theme';

WebBrowser.maybeCompleteAuthSession();

const ROLES = ['CEO / Founder', 'CFO / Finance', 'COO / Operations', 'Business Analyst', 'Strategy Consultant'];

export default function SignUpScreen({ navigation }) {
  const { signUpWithEmail, signInWithGoogle, signInWithApple, authError } = useAuth();
  const [step, setStep] = useState(1); // 2-step form
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('CEO / Founder');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleNext = () => {
    if (!fullName || !companyName) { setLocalError('Please fill in all fields.'); return; }
    setLocalError(''); setStep(2);
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) { setLocalError('Please fill in all fields.'); return; }
    if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return; }
    if (password.length < 8) { setLocalError('Password must be at least 8 characters.'); return; }
    setLocalError(''); setLoading(true);
    const { error } = await signUpWithEmail(email, password, fullName, companyName);
    if (error) { setLocalError(error.message); }
    else { setSuccess(true); }
    setLoading(false);
  };

  const handleOAuth = async (provider) => {
    setLocalError(''); setOauthLoading(provider);
    try {
      const redirectUrl = makeRedirectUri({ scheme: 'intelcore-saas', path: 'auth/callback' });
      const { data, error } = provider === 'google'
        ? await signInWithGoogle(redirectUrl)
        : await signInWithApple(redirectUrl);
      if (error) { setLocalError(error.message); setOauthLoading(''); return; }
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success') {
          const params = new URL(result.url);
          const accessToken = params.searchParams.get('access_token');
          const refreshToken = params.searchParams.get('refresh_token');
          if (accessToken) await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        }
      }
    } catch { setLocalError('Authentication failed.'); }
    setOauthLoading('');
  };

  const error = localError || authError;

  if (success) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.bg, Colors.bg2]} style={StyleSheet.absoluteFill} />
        <View style={styles.successContainer}>
          <Text style={{ fontSize: 56 }}>✅</Text>
          <Text style={styles.successTitle}>Account created!</Text>
          <Text style={styles.successSub}>Check your email ({email}) for a confirmation link, then sign in.</Text>
          <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInText}>Go to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, Colors.bg2, Colors.bg3]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          {step === 2 && (
            <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}
          <View style={styles.logoIcon}>
            <Text style={styles.logoSymbol}>⬡</Text>
          </View>
          <Text style={styles.title}>{step === 1 ? 'Create Account' : 'Set Up Login'}</Text>
          <Text style={styles.sub}>{step === 1 ? 'Tell us about yourself' : 'Choose how you sign in'}</Text>

          {/* Step indicator */}
          <View style={styles.stepRow}>
            <View style={[styles.stepDot, { backgroundColor: Colors.accent }]} />
            <View style={[styles.stepLine, step === 2 && { backgroundColor: Colors.accent }]} />
            <View style={[styles.stepDot, step === 2 && { backgroundColor: Colors.accent }]} />
          </View>
        </View>

        <View style={styles.card}>
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠  {error}</Text>
            </View>
          )}

          {step === 1 ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput style={styles.input} placeholder="Chidi Ibe" placeholderTextColor={Colors.text3}
                  value={fullName} onChangeText={setFullName} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Company Name</Text>
                <TextInput style={styles.input} placeholder="Ibe's Tech Hub" placeholderTextColor={Colors.text3}
                  value={companyName} onChangeText={setCompanyName} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Your Role</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {ROLES.map(r => (
                      <TouchableOpacity
                        key={r} onPress={() => setRole(r)}
                        style={[styles.rolePill, role === r && styles.rolePillActive]}
                      >
                        <Text style={[styles.rolePillText, role === r && { color: Colors.accent2 }]}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              <TouchableOpacity style={styles.signInBtn} onPress={handleNext} activeOpacity={0.85}>
                <Text style={styles.signInText}>Continue →</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* OAuth Options */}
              <TouchableOpacity style={styles.oauthBtn} onPress={() => handleOAuth('google')} disabled={!!oauthLoading || loading}>
                {oauthLoading === 'google' ? <ActivityIndicator size="small" color={Colors.text} />
                  : <Text style={styles.oauthIcon}>G</Text>}
                <Text style={styles.oauthText}>Sign up with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.oauthBtn, styles.appleBtn]} onPress={() => handleOAuth('apple')} disabled={!!oauthLoading || loading}>
                {oauthLoading === 'apple' ? <ActivityIndicator size="small" color={Colors.white} />
                  : <Text style={[styles.oauthIcon, { color: Colors.white }]}>&#xf179;</Text>}
                <Text style={[styles.oauthText, { color: Colors.white }]}>Sign up with Apple</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or with email</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput style={styles.input} placeholder="you@company.com" placeholderTextColor={Colors.text3}
                  value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput style={styles.input} placeholder="Min 8 characters" placeholderTextColor={Colors.text3}
                  value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput style={styles.input} placeholder="Repeat password" placeholderTextColor={Colors.text3}
                  value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" />
              </View>

              <TouchableOpacity
                style={[styles.signInBtn, (!email || !password || !confirmPassword || loading) && styles.signInBtnDisabled]}
                onPress={handleSignUp} activeOpacity={0.85}
                disabled={!email || !password || !confirmPassword || loading}
              >
                {loading ? <ActivityIndicator color={Colors.white} />
                  : <Text style={styles.signInText}>Create Account</Text>}
              </TouchableOpacity>
            </>
          )}

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.legal}>By creating an account, you agree to our Terms{'\n'}of Service and Privacy Policy. GDPR compliant.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 28 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 12 },
  backText: { color: Colors.accent2, fontSize: 14, fontWeight: '600' },
  logoIcon: { width: 56, height: 56, borderRadius: 15, backgroundColor: Colors.accent + '20', borderWidth: 1.5, borderColor: Colors.accent + '50', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoSymbol: { fontSize: 24, color: Colors.accent2 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.4 },
  sub: { fontSize: 13, color: Colors.text3, marginTop: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 0 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.bg4 },
  stepLine: { width: 40, height: 2, backgroundColor: Colors.bg4, marginHorizontal: 6 },

  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border2 },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: Radius.sm, padding: 10, marginBottom: 14, borderWidth: 1, borderColor: Colors.red + '40' },
  errorText: { color: Colors.red2, fontSize: 13 },

  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 11, fontWeight: '600', color: Colors.text2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.bg3, borderRadius: Radius.md, padding: 13, color: Colors.text, fontSize: 14, borderWidth: 1, borderColor: Colors.border },

  rolePill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.bg4, borderWidth: 1, borderColor: Colors.border },
  rolePillActive: { borderColor: Colors.accent + '60', backgroundColor: Colors.accent + '18' },
  rolePillText: { fontSize: 12, color: Colors.text3, fontWeight: '500' },

  oauthBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.bg3, borderRadius: Radius.md, paddingVertical: 13, borderWidth: 1, borderColor: Colors.border2, marginBottom: 10 },
  appleBtn: { backgroundColor: '#1C1C1E', borderColor: '#3A3A3C' },
  oauthIcon: { fontSize: 17, fontWeight: '700', color: Colors.text2, width: 24, textAlign: 'center' },
  oauthText: { fontSize: 14, fontWeight: '600', color: Colors.text },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, color: Colors.text3 },

  signInBtn: { backgroundColor: Colors.accent, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', marginBottom: 14, marginTop: 4 },
  signInBtnDisabled: { opacity: 0.5 },
  signInText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginPrompt: { fontSize: 14, color: Colors.text3 },
  loginLink: { fontSize: 14, color: Colors.accent2, fontWeight: '600' },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  successTitle: { fontSize: 26, fontWeight: '800', color: Colors.text, marginTop: 16, marginBottom: 10 },
  successSub: { fontSize: 14, color: Colors.text2, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  legal: { fontSize: 11, color: Colors.text3, textAlign: 'center', marginTop: 20, lineHeight: 17 },
});
