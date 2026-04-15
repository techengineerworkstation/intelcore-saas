import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  StatusBar, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, Radius } from '../../theme';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { signInWithEmail, signInWithGoogle, signInWithApple, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleEmailLogin = async () => {
    if (!email || !password) { setLocalError('Please enter email and password.'); return; }
    setLocalError(''); setLoading(true);
    const { error } = await signInWithEmail(email, password);
    if (error) setLocalError(error.message);
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
          const { url } = result;
          const params = new URL(url);
          const accessToken = params.searchParams.get('access_token');
          const refreshToken = params.searchParams.get('refresh_token');
          if (accessToken) {
            await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          }
        }
      }
    } catch (e) {
      setLocalError('Authentication failed. Please try again.');
    }
    setOauthLoading('');
  };

  const error = localError || authError;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, Colors.bg2, Colors.bg3]} style={StyleSheet.absoluteFill} />

      {/* Background decorative circles */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoSymbol}>⬡</Text>
          </View>
          <Text style={styles.logoText}>IntelCore SaaS</Text>
          <Text style={styles.logoTagline}>Enterprise Performance Intelligence</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSub}>Sign in to your dashboard</Text>

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠  {error}</Text>
            </View>
          )}

          {/* Google */}
          <TouchableOpacity
            style={styles.oauthBtn}
            onPress={() => handleOAuth('google')}
            activeOpacity={0.8}
            disabled={!!oauthLoading || loading}
          >
            {oauthLoading === 'google'
              ? <ActivityIndicator size="small" color={Colors.text} />
              : <Text style={styles.oauthIcon}>G</Text>
            }
            <Text style={styles.oauthText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity
            style={[styles.oauthBtn, styles.appleBtn]}
            onPress={() => handleOAuth('apple')}
            activeOpacity={0.8}
            disabled={!!oauthLoading || loading}
          >
            {oauthLoading === 'apple'
              ? <ActivityIndicator size="small" color={Colors.white} />
              : <Text style={[styles.oauthIcon, { color: Colors.white }]}>&#xf179;</Text>
            }
            <Text style={[styles.oauthText, { color: Colors.white }]}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or use email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@company.com"
              placeholderTextColor={Colors.text3}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="••••••••"
                placeholderTextColor={Colors.text3}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.signInBtn, (!email || !password || loading) && styles.signInBtnDisabled]}
            onPress={handleEmailLogin}
            activeOpacity={0.85}
            disabled={!email || !password || loading}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.signInText}>Sign In →</Text>
            }
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpPrompt}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.legal}>By signing in, you agree to our Terms of Service{'\n'}and Privacy Policy. GDPR compliant.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: 40 },
  decorCircle1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: Colors.accent + '08', top: -80, right: -80 },
  decorCircle2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.purple + '08', bottom: 100, left: -60 },

  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoIcon: { width: 64, height: 64, borderRadius: 18, backgroundColor: Colors.accent + '20', borderWidth: 1.5, borderColor: Colors.accent + '50', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoSymbol: { fontSize: 28, color: Colors.accent2 },
  logoText: { fontSize: 24, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  logoTagline: { fontSize: 13, color: Colors.text3, marginTop: 4 },

  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border2 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, letterSpacing: -0.3 },
  cardSub: { fontSize: 13, color: Colors.text3, marginTop: 3, marginBottom: 20 },

  errorBox: { backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: Radius.sm, padding: 10, marginBottom: 14, borderWidth: 1, borderColor: Colors.red + '40' },
  errorText: { color: Colors.red2, fontSize: 13 },

  oauthBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.bg3, borderRadius: Radius.md, paddingVertical: 13,
    borderWidth: 1, borderColor: Colors.border2, marginBottom: 10,
  },
  appleBtn: { backgroundColor: '#1C1C1E', borderColor: '#3A3A3C' },
  oauthIcon: { fontSize: 17, fontWeight: '700', color: Colors.text2, width: 24, textAlign: 'center' },
  oauthText: { fontSize: 14, fontWeight: '600', color: Colors.text },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, color: Colors.text3 },

  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: Colors.text2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.bg3, borderRadius: Radius.md, padding: 13, color: Colors.text, fontSize: 14, borderWidth: 1, borderColor: Colors.border },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 10 },
  eyeText: { fontSize: 16 },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 16, marginTop: -4 },
  forgotText: { fontSize: 13, color: Colors.accent2, fontWeight: '500' },

  signInBtn: { backgroundColor: Colors.accent, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  signInBtnDisabled: { opacity: 0.5 },
  signInText: { fontSize: 15, fontWeight: '700', color: Colors.white, letterSpacing: 0.2 },

  signUpRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signUpPrompt: { fontSize: 14, color: Colors.text3 },
  signUpLink: { fontSize: 14, color: Colors.accent2, fontWeight: '600' },

  legal: { fontSize: 11, color: Colors.text3, textAlign: 'center', marginTop: 20, lineHeight: 17 },
});
