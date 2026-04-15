import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, Radius } from '../../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) { setError('Please enter your email.'); return; }
    setError(''); setLoading(true);
    const { error: err } = await resetPassword(email);
    if (err) setError(err.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, Colors.bg2]} style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>{sent ? '📬' : '🔑'}</Text>
        <Text style={styles.title}>{sent ? 'Check your email' : 'Reset Password'}</Text>
        <Text style={styles.sub}>
          {sent
            ? `We sent a password reset link to\n${email}`
            : 'Enter your email and we\'ll send you a reset link.'
          }
        </Text>

        {!sent && (
          <View style={styles.card}>
            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠  {error}</Text>
              </View>
            )}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@company.com"
                placeholderTextColor={Colors.text3}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[styles.btn, (!email || loading) && styles.btnDisabled]}
              onPress={handleReset}
              disabled={!email || loading}
            >
              {loading ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.btnText}>Send Reset Link</Text>}
            </TouchableOpacity>
          </View>
        )}

        {sent && (
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>Back to Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, padding: Spacing.lg, paddingTop: 60 },
  back: { marginBottom: 32 },
  backText: { color: Colors.accent2, fontSize: 14, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 14, color: Colors.text2, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border2 },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: Radius.sm, padding: 10, marginBottom: 14, borderWidth: 1, borderColor: Colors.red + '40' },
  errorText: { color: Colors.red2, fontSize: 13 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 11, fontWeight: '600', color: Colors.text2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.bg3, borderRadius: Radius.md, padding: 13, color: Colors.text, fontSize: 14, borderWidth: 1, borderColor: Colors.border },
  btn: { backgroundColor: Colors.accent, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
