import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { Colors, Radius } from '../theme';

import { useAuth } from '../context/AuthContext';

// App screens
import DashboardScreen from '../screens/DashboardScreen';
import InsightsScreen from '../screens/InsightsScreen';
import KPIsScreen from '../screens/KPIsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import DataSourcesScreen from '../screens/DataSourcesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS = {
  Dashboard: '⊞',
  Insights:  '✦',
  KPIs:      '◈',
  Alerts:    '◉',
  Sources:   '⊕',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg2,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
        tabBarActiveTintColor: Colors.accent2,
        tabBarInactiveTintColor: Colors.text3,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 18, color: focused ? Colors.accent2 : Colors.text3 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="Insights"  component={InsightsScreen}  options={{ tabBarLabel: 'AI Insights' }} />
      <Tab.Screen name="KPIs"      component={KPIsScreen}      options={{ tabBarLabel: 'KPIs' }} />
      <Tab.Screen name="Alerts"    component={AlertsScreen}    options={{ tabBarLabel: 'Alerts' }} />
      <Tab.Screen name="Sources"   component={DataSourcesScreen} options={{ tabBarLabel: 'Sources' }} />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main"     component={MainTabs} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Alerts"   component={AlertsScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"          component={LoginScreen} />
      <Stack.Screen name="SignUp"         component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 32, marginBottom: 16 }}>⬡</Text>
        <ActivityIndicator color={Colors.accent2} />
        <Text style={{ color: Colors.text3, marginTop: 12, fontSize: 13 }}>IntelCore SaaS</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
