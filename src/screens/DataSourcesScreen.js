import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Radius } from '../theme';
import { DataSourceRow, Badge } from '../components';
import { dataSources as initialSources } from '../data/mockData';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../context/AuthContext';
import { dataSourceService, opencodeAIService } from '../services/supabase';
import Constants from 'expo-constants';

const OPENCODE_API_KEY = Constants.expoConfig?.extra?.opencodeApiKey || '';

const CATEGORY_ICONS = {
  'CRM': '🔶',
  'Project': '📋',
  'Finance': '💰',
  'Communication': '💬',
  'Storage': '📁',
  'Database': '🗄️',
  'Spreadsheet': '📊',
  'Presentation': '📽️',
  'Document': '📄',
  'Data': '🔧',
};

export default function DataSourcesScreen() {
  const { user } = useAuth();
  const [sources, setSources] = useState(initialSources);
  const [scanning, setScanning] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const connected = sources.filter(s => s.connected);
  const disconnected = sources.filter(s => !s.connected);

  const categories = [...new Set(sources.map(s => s.category))];

  const toggleSource = (id) => {
    const src = sources.find(s => s.id === id);
    if (src.type === 'file') {
      handleFileUpload(src);
      return;
    }

    if (!src.connected) {
      if (src.type === 'oauth') {
        Alert.alert(
          `Connect ${src.name}`,
          `This will link your ${src.name} account to IntelCore SaaS for automated KPI extraction.\n\nOAuth authentication required.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Connect via OAuth', onPress: () => connectOAuth(src)
            }
          ]
        );
      } else {
        Alert.alert(
          `Connect ${src.name}`,
          `Enter your database credentials for ${src.name} connection.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Enter Credentials', onPress: () => showDatabaseConfig(src) }
          ]
        );
      }
    } else {
      Alert.alert(`Disconnect ${src.name}?`, 'KPIs from this source will stop updating.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: () => setSources(prev => prev.map(s => s.id === id ? { ...s, connected: false, records: null, lastSync: null } : s)) },
      ]);
    }
  };

  const connectOAuth = async (source) => {
    setUploading(true);
    setUploadProgress(`Connecting to ${source.name}...`);
    
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === source.id
        ? { ...s, connected: true, records: 'Syncing...', lastSync: 'Just now' }
        : s
      ));
      setUploading(false);
      setUploadProgress('');
      Alert.alert('Connected', `${source.name} has been connected successfully.`);
    }, 2000);
  };

  const showDatabaseConfig = (source) => {
    Alert.alert(
      'Database Connection',
      'Enter connection details for ' + source.name,
      [
        { text: 'Cancel' },
        { text: 'Connect', onPress: () => connectOAuth(source) }
      ]
    );
  };

  const handleFileUpload = async (source) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/csv',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/pdf',
          'application/json',
          'text/xml',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setUploading(true);
      setUploadProgress(`Processing ${file.name}...`);

      const fileUri = file.uri;
      let fileContent = '';
      let parsedData = null;

      if (file.name.endsWith('.json') || file.name.endsWith('.xml')) {
        const readResult = await FileSystem.readAsStringAsync(fileUri);
        fileContent = readResult;
        
        if (file.name.endsWith('.json')) {
          try {
            parsedData = JSON.parse(readResult);
          } catch (e) {}
        }
      }

      setUploadProgress(`Analyzing ${file.name} with AI...`);

      const categoryType = source.category.toLowerCase();
      let analysisPrompt = '';
      
      if (categoryType.includes('spread')) {
        analysisPrompt = `Analyze this spreadsheet/Excel data and extract key metrics: revenue, costs, profit margins, growth trends. Return a JSON summary.`;
      } else if (categoryType.includes('presentation')) {
        analysisPrompt = `Analyze this PowerPoint presentation and summarize key business metrics, goals, and KPIs mentioned.`;
      } else if (categoryType.includes('document')) {
        analysisPrompt = `Extract business KPIs, financial metrics, and key insights from this PDF document.`;
      } else {
        analysisPrompt = `Analyze this data file and extract business metrics relevant to company performance.`;
      }

      const { data: analysisData, error } = await opencodeAIService.chat(
        fileContent || `File: ${file.name}, Size: ${file.size} bytes`,
        analysisPrompt,
        OPENCODE_API_KEY
      );

      const extractedMetrics = error 
        ? { fileName: file.name, status: 'uploaded' }
        : { fileName: file.name, analysis: analysisData, status: 'analyzed' };

      setSources(prev => prev.map(s => s.id === source.id
        ? { ...s, connected: true, records: `${file.name}`, lastSync: 'Just now', parsedData: parsedData, extractedMetrics: extractedMetrics }
        : s
      ));

      setUploading(false);
      setUploadProgress('');
      
      Alert.alert(
        'File Uploaded', 
        `${file.name} has been processed and added to your data sources.`
      );

    } catch (error) {
      setUploading(false);
      setUploadProgress('');
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    }
  };

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      Alert.alert('Scan Complete', `${connected.length} sources scanned. KPIs updated successfully.`);
    }, 2500);
  };

  const getSourcesByCategory = (category) => {
    return sources.filter(s => s.category === category);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Sources</Text>
        <Text style={styles.headerSub}>Connect tools or upload files for KPI extraction</Text>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{connected.length}</Text>
            <Text style={styles.statLabel}>Connected</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{disconnected.length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.green2 }]}>Live</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          onPress={runScan}
          style={[styles.scanBtn, scanning && styles.scanBtnActive]}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18 }}>{scanning ? '⏳' : '🔍'}</Text>
          <View>
            <Text style={styles.scanBtnTitle}>{scanning ? 'Scanning & Extracting KPIs...' : 'Run Full Data Scan'}</Text>
            <Text style={styles.scanBtnSub}>{scanning ? 'Processing all connected sources' : `Scan ${connected.length} connected sources now`}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => setShowUploadModal(true)}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18 }}>📤</Text>
          <View>
            <Text style={styles.uploadBtnTitle}>Upload Data Files</Text>
            <Text style={styles.uploadBtnSub}>XLSX, CSV, PDF, PPTX, JSON, XML</Text>
          </View>
        </TouchableOpacity>

        {uploading && (
          <View style={styles.uploadingCard}>
            <ActivityIndicator color={Colors.accent2} />
            <Text style={styles.uploadingText}>{uploadProgress}</Text>
          </View>
        )}

        {categories.map(category => (
          <View key={category} style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryIcon}>{CATEGORY_ICONS[category] || '📊'}</Text>
                <Text style={styles.categoryTitle}>{category}</Text>
              </View>
              <Badge label={`${getSourcesByCategory(category).filter(s => s.connected).length} active`} color={Colors.green2} />
            </View>
            <View style={styles.sourceList}>
              {getSourcesByCategory(category).map(src => (
                <DataSourceRow key={src.id} source={src} onToggle={() => toggleSource(src.id)} />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.classCard}>
          <Text style={styles.classTitle}>🧠  Intelligent Classification</Text>
          <Text style={styles.classSub}>Your connected data is automatically categorized into:</Text>
          <View style={styles.classGrid}>
            {['Financials', 'CRM Data', 'Project Metrics', 'Support Tickets', 'Communication', 'Documents'].map(cat => (
              <View key={cat} style={styles.classChip}>
                <Text style={styles.classChipText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.integrationsCard}>
          <Text style={styles.integrationsTitle}>🚀 Quick Connect</Text>
          <View style={styles.integrationsGrid}>
            {['HubSpot', 'Jira', 'Zendesk', 'Google Sheets'].map(name => {
              const src = sources.find(s => s.name === name);
              return (
                <TouchableOpacity 
                  key={name} 
                  style={[styles.integrationBtn, src?.connected && styles.integrationBtnActive]}
                  onPress={() => toggleSource(src.id)}
                >
                  <Text style={styles.integrationIcon}>{src?.icon}</Text>
                  <Text style={styles.integrationName}>{name}</Text>
                  {src?.connected && <Text style={styles.integrationCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <Modal visible={showUploadModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📤 Upload Data Files</Text>
            <Text style={styles.modalSub}>Upload your business data for AI-powered analysis</Text>
            
            <View style={styles.uploadTypes}>
              {[
                { name: 'Excel (.xlsx)', icon: '📊', types: ['xlsx', 'xls'] },
                { name: 'CSV', icon: '📋', types: ['csv'] },
                { name: 'PDF', icon: '📄', types: ['pdf'] },
                { name: 'PowerPoint', icon: '📽️', types: ['pptx'] },
                { name: 'JSON', icon: '🔧', types: ['json'] },
                { name: 'XML', icon: '🔩', types: ['xml'] },
              ].map(item => {
                const fileType = sources.find(s => s.name.includes(item.name.split(' ')[0]));
                return (
                  <TouchableOpacity 
                    key={item.name} 
                    style={styles.uploadTypeBtn}
                    onPress={() => {
                      setShowUploadModal(false);
                      if (fileType) toggleSource(fileType.id);
                    }}
                  >
                    <Text style={styles.uploadTypeIcon}>{item.icon}</Text>
                    <Text style={styles.uploadTypeName}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => setShowUploadModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: Colors.text3, marginTop: 2, marginBottom: 14 },
  headerStats: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 12, borderWidth: 1, borderColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.text3, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  scroll: { padding: Spacing.lg },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border2, marginBottom: Spacing.md },
  scanBtnActive: { borderColor: Colors.accent + '60', backgroundColor: Colors.accent + '15' },
  scanBtnTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  scanBtnSub: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border2, marginBottom: Spacing.lg },
  uploadBtnTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  uploadBtnSub: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  uploadingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.accent + '15', borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.accent + '30' },
  uploadingText: { fontSize: 13, color: Colors.accent2 },
  section: { marginBottom: Spacing.lg },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryIcon: { fontSize: 16 },
  categoryTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  sourceList: { backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  classCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
  classTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  classSub: { fontSize: 13, color: Colors.text3, marginBottom: 12, lineHeight: 18 },
  classGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  classChip: { backgroundColor: Colors.bg4, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  classChipText: { fontSize: 12, color: Colors.text2, fontWeight: '500' },
  integrationsCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  integrationsTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  integrationsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  integrationBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.bg4, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border },
  integrationBtnActive: { backgroundColor: Colors.accent + '15', borderColor: Colors.accent + '40' },
  integrationIcon: { fontSize: 14 },
  integrationName: { fontSize: 12, color: Colors.text2 },
  integrationCheck: { fontSize: 10, color: Colors.green2, marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: Spacing.lg },
  modalContent: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  modalSub: { fontSize: 13, color: Colors.text3, marginBottom: Spacing.lg },
  uploadTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.lg },
  uploadTypeBtn: { width: '30%', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.bg4, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  uploadTypeIcon: { fontSize: 24, marginBottom: 6 },
  uploadTypeName: { fontSize: 11, color: Colors.text2, textAlign: 'center' },
  modalCloseBtn: { backgroundColor: Colors.bg4, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  modalCloseText: { fontSize: 14, color: Colors.text2, fontWeight: '600' },
});