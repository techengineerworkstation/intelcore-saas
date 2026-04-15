import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, StatusBar, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Radius } from '../theme';
import { Badge } from '../components';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [alerts, setAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [nameValue, setNameValue] = useState(profile?.full_name || '');
  const [companyValue, setCompanyValue] = useState(profile?.company_name || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({ full_name: nameValue, company_name: companyValue });
    setSaving(false);
    setEditingName(false);
    setEditingCompany(false);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  const Row = ({ label, sub, right, onPress, danger }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} style={styles.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, danger && { color: Colors.red2 }]}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      {right}
    </TouchableOpacity>
  );

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>{user?.email}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            {editingName ? (
              <TextInput style={styles.editInput} value={nameValue} onChangeText={setNameValue} autoFocus />
            ) : (
              <TouchableOpacity onPress={() => setEditingName(true)}>
                <Text style={styles.profileName}>{profile?.full_name || 'Set your name'} ✎</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.profileRole}>{profile?.role || 'CEO'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <Badge label={profile?.plan === 'enterprise' ? 'Enterprise' : profile?.plan === 'pro' ? 'Pro' : 'Starter'} color={Colors.gold2} />
        </View>

        {editingName || editingCompany ? (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={saving}>
            {saving ? <ActivityIndicator color={Colors.white} size="small" />
              : <Text style={styles.saveBtnText}>Save Profile Changes</Text>}
          </TouchableOpacity>
        ) : null}

        <Section title="ORGANIZATION">
          <Row label="Company Name"
            sub={editingCompany ? undefined : (profile?.company_name || 'Not set')}
            right={editingCompany
              ? <TextInput style={[styles.editInput, { width: 140 }]} value={companyValue} onChangeText={setCompanyValue} />
              : <TouchableOpacity onPress={() => setEditingCompany(true)}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
            }
          />
          <Row label="Role" sub={profile?.role || 'CEO'} right={<Text style={styles.chevron}>›</Text>} onPress={() => {}} />
          <Row label="Fiscal Year" sub="January – December" right={<Text style={styles.chevron}>›</Text>} onPress={() => {}} />
        </Section>

        <Section title="KPI CONFIGURATION">
          <Row label="Custom KPI Builder" sub="Define your own metrics" right={<Text style={styles.chevron}>›</Text>} onPress={() => Alert.alert('Custom KPI Builder', 'Coming in v2.0')} />
          <Row label="Benchmark Industry" sub="Digital Agency" right={<Text style={styles.chevron}>›</Text>} onPress={() => {}} />
          <Row label="Export to Excel" sub="Download KPI report"
            right={<Text style={{ color: Colors.accent2, fontSize: 13, fontWeight: '600' }}>Export</Text>}
            onPress={() => Alert.alert('Export', 'Generating Excel dashboard...')} />
        </Section>

        <Section title="NOTIFICATIONS">
          <Row label="Alert Notifications" sub="Risk signals & AI flags"
            right={<Switch value={alerts} onValueChange={setAlerts} trackColor={{ true: Colors.accent }} thumbColor="#fff" />} />
          <Row label="Weekly Performance Report" sub="Every Monday, 8:00 AM"
            right={<Switch value={weeklyReport} onValueChange={setWeeklyReport} trackColor={{ true: Colors.accent }} thumbColor="#fff" />} />
        </Section>

        <Section title="SECURITY">
          <Row label="Biometric Login" sub="Face ID / Fingerprint"
            right={<Switch value={biometrics} onValueChange={setBiometrics} trackColor={{ true: Colors.accent }} thumbColor="#fff" />} />
          <Row label="2-Factor Authentication" sub="Enabled via email" right={<Badge label="ON" color={Colors.green2} />} />
          <Row label="Data Encryption" sub="AES-256 end-to-end" right={<Badge label="Active" color={Colors.green2} />} />
          <Row label="GDPR Compliance" sub="Data processing agreement" right={<Text style={styles.chevron}>›</Text>} onPress={() => {}} />
          <Row label="Change Password" right={<Text style={styles.chevron}>›</Text>}
            onPress={() => Alert.alert('Change Password', 'A password reset link will be sent to your email.', [
              { text: 'Cancel' }, { text: 'Send Link', onPress: () => {} },
            ])} />
        </Section>

        <Section title="SUBSCRIPTION">
          <View style={styles.planCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={styles.planName}>{profile?.plan === 'enterprise' ? 'Enterprise' : profile?.plan === 'pro' ? 'Pro Plan' : 'Starter Plan'}</Text>
              <Text style={styles.planPrice}>{profile?.plan === 'pro' ? '$79/mo' : profile?.plan === 'enterprise' ? 'Custom' : '$29/mo'}</Text>
            </View>
            <Text style={styles.planFeatures}>✓  AI insights engine{'\n'}✓  Data source connectors{'\n'}✓  KPI dashboard & alerts{'\n'}✓  Excel/Sheets export</Text>
            <TouchableOpacity style={styles.upgradeBtn} onPress={() => Alert.alert('Upgrade', 'Contact sales@intelcore.saas for Enterprise plan')}>
              <Text style={styles.upgradeBtnText}>Upgrade Plan →</Text>
            </TouchableOpacity>
          </View>
        </Section>

        <Section title="ACCOUNT">
          <Row label="Privacy Policy" right={<Text style={styles.chevron}>›</Text>} onPress={() => {}} />
          <Row label="Terms of Service" right={<Text style={styles.chevron}>›</Text>} onPress={() => {}} />
          <Row label="Help & Support" right={<Text style={styles.chevron}>›</Text>} onPress={() => {}} />
          <Row label="Delete Account" danger right={null}
            onPress={() => Alert.alert('Delete Account', 'This will permanently delete your account and all data. This cannot be undone.', [
              { text: 'Cancel' }, { text: 'Delete', style: 'destructive' },
            ])} />
          <Row label="Sign Out" danger onPress={handleSignOut} right={null} />
        </Section>

        <Text style={styles.version}>IntelCore SaaS v1.0.0 · Powered by Supabase + Claude</Text>
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  scroll: { padding: Spacing.lg },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border2, marginBottom: Spacing.sm },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.accent + '25', borderWidth: 2, borderColor: Colors.accent + '50', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: Colors.accent2 },
  profileName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  profileRole: { fontSize: 12, color: Colors.text3, marginTop: 1 },
  profileEmail: { fontSize: 11, color: Colors.text3, marginTop: 1 },
  editInput: { backgroundColor: Colors.bg4, borderRadius: Radius.sm, padding: 7, color: Colors.text, fontSize: 13, borderWidth: 1, borderColor: Colors.border2 },
  editLink: { fontSize: 12, color: Colors.accent2, fontWeight: '600' },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.md, padding: 12, alignItems: 'center', marginBottom: Spacing.md },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  section: { marginBottom: Spacing.lg },
  sectionLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.text3, fontWeight: '600', marginBottom: 8 },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel: { fontSize: 14, fontWeight: '500', color: Colors.text },
  rowSub: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  chevron: { fontSize: 20, color: Colors.text3 },
  planCard: { padding: Spacing.md },
  planName: { fontSize: 16, fontWeight: '700', color: Colors.gold2 },
  planPrice: { fontSize: 18, fontWeight: '800', color: Colors.text },
  planFeatures: { fontSize: 13, color: Colors.text2, lineHeight: 22, marginBottom: 14 },
  upgradeBtn: { backgroundColor: Colors.accent + '20', borderRadius: Radius.md, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.accent + '40' },
  upgradeBtnText: { fontSize: 13, fontWeight: '700', color: Colors.accent2 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.text3 },
});
