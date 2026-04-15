import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, authService, profileService } from '../services/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load profile for a user
  const loadProfile = useCallback(async (usr) => {
    if (!usr) return;
    const { data } = await profileService.getProfile(usr.id);
    if (data) setProfile(data);
  }, []);

  // Bootstrap: check existing session on app start
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { session: s } = await authService.getSession();
      if (mounted) {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) await loadProfile(s.user);
        setLoading(false);
      }
    })();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        setSession(s);
        setUser(s?.user ?? null);
        setAuthError(null);

        if (event === 'SIGNED_IN' && s?.user) {
          await profileService.upsertProfile(s.user);
          await loadProfile(s.user);
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // ── AUTH ACTIONS ────────────────────────────────────────────

  const signUpWithEmail = async (email, password, fullName, companyName) => {
    setAuthError(null);
    const { error } = await authService.signUpWithEmail(email, password, fullName, companyName);
    if (error) setAuthError(error.message);
    return { error };
  };

  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    const { error } = await authService.signInWithEmail(email, password);
    if (error) setAuthError(error.message);
    return { error };
  };

  const signInWithGoogle = async (redirectUrl) => {
    setAuthError(null);
    const { data, error } = await authService.signInWithGoogle(redirectUrl);
    if (error) setAuthError(error.message);
    return { data, error };
  };

  const signInWithApple = async (redirectUrl) => {
    setAuthError(null);
    const { data, error } = await authService.signInWithApple(redirectUrl);
    if (error) setAuthError(error.message);
    return { data, error };
  };

  const resetPassword = async (email) => {
    setAuthError(null);
    const { error } = await authService.resetPassword(email);
    if (error) setAuthError(error.message);
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await profileService.updateProfile(user.id, updates);
    if (data) setProfile(data);
    return { data, error };
  };

  const refreshProfile = () => loadProfile(user);

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading, authError,
      signUpWithEmail, signInWithEmail, signInWithGoogle, signInWithApple,
      resetPassword, signOut, updateProfile, refreshProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
