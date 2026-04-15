import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme';
import { insightQuestions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { queryService, opencodeAIService } from '../services/supabase';
import Constants from 'expo-constants';

const OPENCODE_API_KEY = Constants.expoConfig?.extra?.opencodeApiKey || '';

const buildSystemPrompt = (profile) => `You are IntelCore SaaS, an elite enterprise business intelligence analyst.
You are speaking with ${profile?.full_name || 'the CEO'} of ${profile?.company_name || 'the company'} (Role: ${profile?.role || 'Executive'}).

COMPANY KPI SNAPSHOT (Q4 2024):
- Health Score: 74/100 (+6 pts MoM)
- Total Revenue: $4.28M (+12.4% MoM)
- Gross Margin: 68.2% (+2.1%)
- Net Profit Margin: 22.7% (-1.8%)
- Operating Costs: $1.92M (+4.1%)
- CAC: $142 (-8.3%) | LTV: $3,840 (+5.6%)
- Churn Rate: 3.2% (+0.4%) | Retention: 96.8%
- Revenue per Employee: $186K (+9.2%)
- Cash Inflow: $5.1M | Outflow: $3.82M

4 KPI PILLARS: Progress 82 | Profitability 68 | Cost Efficiency 71 | Consolidation 79

Answer executive questions with data-driven precision. Be concise (max 180 words). Use bullet points for recommendations. Start with a one-line verdict.`;

export default function InsightsScreen() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Welcome back! I have full visibility into your company KPIs, financials, and performance metrics.\n\nAsk me anything about your business, or tap a suggested question below.`,
      isWelcome: true,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const scrollRef = useRef();

  // Load query history from Supabase
  const loadHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    const { data } = await queryService.getQueryHistory(user.id, 20);
    if (data) setHistory(data);
    setHistoryLoading(false);
  };

  useEffect(() => { loadHistory(); }, [user]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: userText };
    const newMessages = [...messages.filter(m => !m.isWelcome), userMsg];
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const kpiContext = {
        healthScore: 74,
        revenue: 4280000,
        grossMargin: 68.2,
        netProfitMargin: 22.7,
        operatingCosts: 1920000,
        cac: 142,
        ltv: 3840,
        churnRate: 3.2,
        retention: 96.8,
        revenuePerEmployee: 186000,
      };
      const { data, error } = await opencodeAIService.askQuestion(
        userText,
        { kpis: kpiContext, profile: profile },
        profile,
        OPENCODE_API_KEY
      );

      const reply = error 
        ? '⚠️ AI service unavailable. Please try again later.' 
        : data?.choices?.[0]?.message?.content || data?.content || 'Unable to retrieve insights. Please try again.';

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      if (user && !error) {
        await queryService.saveQuery(user.id, userText, reply);
        await loadHistory();
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Connection error. Check your network and try again.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const loadFromHistory = (item) => {
    setShowHistory(false);
    setMessages([
      { role: 'user', content: item.question },
      { role: 'assistant', content: item.answer },
    ]);
  };

  const renderContent = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1
        ? <Text key={i} style={{ fontWeight: '700', color: Colors.accent3 }}>{part}</Text>
        : <Text key={i}>{part}</Text>
    );
  };

  if (showHistory) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowHistory(false)}>
            <Text style={{ color: Colors.accent2, fontSize: 14, fontWeight: '600' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Query History</Text>
          <Text style={styles.headerSub}>{history.length} saved queries</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
          {historyLoading && <ActivityIndicator color={Colors.accent2} style={{ marginTop: 40 }} />}
          {!historyLoading && history.length === 0 && (
            <Text style={{ color: Colors.text3, textAlign: 'center', marginTop: 40 }}>No query history yet.</Text>
          )}
          {history.map((item) => (
            <TouchableOpacity key={item.id} style={styles.historyCard} onPress={() => loadFromHistory(item)}>
              <Text style={styles.historyQ} numberOfLines={2}>{item.question}</Text>
              <Text style={styles.historyA} numberOfLines={2}>{item.answer}</Text>
              <Text style={styles.historyDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.aiIndicator}>
          <View style={styles.aiDot} />
          <Text style={styles.aiLabel}>AI Engine Active</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={styles.headerTitle}>AI Insights</Text>
            <Text style={styles.headerSub}>Ask anything about your business performance</Text>
          </View>
          <TouchableOpacity onPress={() => setShowHistory(true)} style={styles.historyBtn}>
            <Text style={styles.historyBtnText}>🕐 History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((msg, i) => (
          <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            {msg.role === 'assistant' && (
              <View style={styles.aiAvatar}><Text style={{ fontSize: 12, color: Colors.accent2 }}>⬡</Text></View>
            )}
            <View style={[styles.bubbleInner, msg.role === 'user' ? styles.userInner : styles.aiInner]}>
              <Text style={[styles.bubbleText, msg.role === 'user' && styles.userText]}>
                {renderContent(msg.content)}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.loadingBubble}>
            <View style={styles.aiAvatar}><Text style={{ fontSize: 12, color: Colors.accent2 }}>⬡</Text></View>
            <View style={styles.aiInner}>
              <ActivityIndicator size="small" color={Colors.accent2} />
              <Text style={styles.analyzingText}>Analyzing your data...</Text>
            </View>
          </View>
        )}

        {messages.length <= 1 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestLabel}>Suggested Questions</Text>
            {insightQuestions.map((q, i) => (
              <TouchableOpacity key={i} style={styles.suggestBtn} onPress={() => sendMessage(q)}>
                <Text style={styles.suggestText}>{q}</Text>
                <Text style={styles.suggestArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about revenue, costs, growth..."
          placeholderTextColor={Colors.text3}
          multiline
          returnKeyType="send"
          onSubmitEditing={() => sendMessage()}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  aiIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  aiDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.green2 },
  aiLabel: { fontSize: 11, color: Colors.green2, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: Colors.text3, marginTop: 2 },
  historyBtn: { backgroundColor: Colors.bg4, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  historyBtnText: { fontSize: 12, color: Colors.text2, fontWeight: '500' },
  messages: { flex: 1 },
  messagesContent: { padding: Spacing.md, gap: 12 },
  bubble: { flexDirection: 'row', gap: 10 },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.accent + '20', borderWidth: 1, borderColor: Colors.accent + '50', alignItems: 'center', justifyContent: 'center', marginTop: 4, flexShrink: 0 },
  bubbleInner: { maxWidth: '80%', borderRadius: Radius.lg, padding: Spacing.md },
  userInner: { backgroundColor: Colors.accent, borderBottomRightRadius: 4 },
  aiInner: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 8 },
  bubbleText: { fontSize: 14, color: Colors.text, lineHeight: 21 },
  userText: { color: '#fff' },
  loadingBubble: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  analyzingText: { fontSize: 13, color: Colors.text3 },
  suggestions: { marginTop: Spacing.md },
  suggestLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.text3, fontWeight: '600', marginBottom: 10 },
  suggestBtn: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  suggestText: { fontSize: 13, color: Colors.text2, flex: 1, lineHeight: 18 },
  suggestArrow: { fontSize: 16, color: Colors.accent2, marginLeft: 8 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: Spacing.md, backgroundColor: Colors.bg2, borderTopWidth: 1, borderTopColor: Colors.border, gap: 10 },
  input: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 12, color: Colors.text, fontSize: 14, maxHeight: 100, borderWidth: 1, borderColor: Colors.border2, lineHeight: 20 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: Colors.bg4 },
  sendIcon: { fontSize: 18, color: '#fff', fontWeight: '700' },
  historyCard: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  historyQ: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  historyA: { fontSize: 12, color: Colors.text3, lineHeight: 18 },
  historyDate: { fontSize: 11, color: Colors.text3, marginTop: 6 },
});
