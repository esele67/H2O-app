import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as api from '../services/api';
import { storage } from '../services/storage';
import { router } from 'expo-router';

type User = { _id: string; name: string; email?: string; phone?: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email?: string; phone?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const tk = await storage.getItem('token');
        const u = await storage.getItem('user');
        if (tk) setToken(tk);
        if (u) setUser(u ? JSON.parse(u) : null);
      } catch (e) {
        console.warn('Auth restore failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ identifier, password }: { identifier: string; password: string }) => {
    try {
      const res = await api.login({ identifier, password });
      await storage.setItem('token', res.token);
      await storage.setItem('user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login failed', e.response.data.message || 'Unknown error');
      throw e;
    } 
  };

  const register = async (payload: { name: string; email?: string; phone?: string; password: string }) => {
    try {
      const res = await api.register(payload);
      console.log({ res });
      router.replace('/login');
    } catch (e: any) {
      Alert.alert('Register failed', e.response.data.message || 'Unknown error');
      throw e;
    }
  };

  const logout = async () => {
  await storage.removeItem('token');
  await storage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
