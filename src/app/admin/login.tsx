import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Key, Mail, Shield, UserCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { BrandMark } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { AdminSession, Role } from '@/lib/types';

// Demo authentication, identical to the website: the email decides the role.
function sessionForEmail(email: string): AdminSession {
  if (email.includes('super') || email.includes('admin@drapple')) {
    return { email, role: 'Super Admin', name: 'Dr. Apple CEO' };
  }
  if (email.includes('store') || email.includes('content')) {
    return { email, role: 'Content Admin', name: 'Kano Store Manager' };
  }
  return { email: email || 'admin@drapple.ng', role: 'Super Admin', name: 'Super Admin' };
}

export default function AdminLoginScreen() {
  const { session, login } = useCMS();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) return <Redirect href="/admin" />;

  const enter = (next: AdminSession) => {
    login(next);
    router.replace('/admin');
  };

  const handleLogin = () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      enter(sessionForEmail(email.trim().toLowerCase()));
    }, 400);
  };

  const handleQuickDemo = (role: Role) =>
    enter({
      email: role === 'Super Admin' ? 'admin@drapple.ng' : 'store@drapple.ng',
      role,
      name: role === 'Super Admin' ? 'Dr. Apple CEO' : 'Kano Content Admin',
    });

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}
      >
        {/* Soft background accent */}
        <View
          className="absolute h-[420px] w-[420px] rounded-full bg-neutral-100 opacity-70"
          style={{ left: '50%', top: '33%', marginLeft: -210 }}
        />

        <View className="w-full max-w-md self-center rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
          <View className="mb-8 items-center">
            <View className="mb-4">
              <BrandMark size={56} radius={16} />
            </View>
            <Text className="font-serif text-2xl font-bold uppercase tracking-[2.4px] text-black">DR APPLE CMS</Text>
            <Text className="mt-1 text-center text-xs text-neutral-500">Kano Store Admin & Dynamic CMS Management</Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="mb-1 text-xs font-semibold text-neutral-800">Admin Email Address</Text>
              <View className="justify-center">
                <View className="absolute left-3 z-10">
                  <Mail size={16} color="#a3a3a3" />
                </View>
                <TextInput
                  placeholder="admin@drapple.ng"
                  placeholderTextColor="#a3a3a3"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  className="rounded-xl border border-neutral-300 bg-neutral-50 py-2.5 pl-9 pr-3 text-xs text-black"
                />
              </View>
            </View>

            <View>
              <Text className="mb-1 text-xs font-semibold text-neutral-800">Password</Text>
              <View className="justify-center">
                <View className="absolute left-3 z-10">
                  <Key size={16} color="#a3a3a3" />
                </View>
                <TextInput
                  placeholder="••••••••••••"
                  placeholderTextColor="#a3a3a3"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={handleLogin}
                  className="rounded-xl border border-neutral-300 bg-neutral-50 py-2.5 pl-9 pr-3 text-xs text-black"
                />
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className="mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-black py-3.5 shadow-lg active:bg-neutral-800"
            >
              <Text className="text-xs font-bold text-white">
                {loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
              </Text>
              <ArrowRight size={16} color="#fff" />
            </Pressable>
          </View>

          {/* Quick demo access */}
          <View className="mt-8 gap-3 border-t border-neutral-200 pt-6">
            <Text className="text-center font-mono text-[11px] uppercase tracking-[1.1px] text-neutral-500">
              ⚡ Quick Demo Admin Access (RBAC)
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handleQuickDemo('Super Admin')}
                className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-black bg-black py-2.5"
              >
                <Shield size={14} color="#fff" />
                <Text className="text-xs font-semibold text-white">Super Admin</Text>
              </Pressable>
              <Pressable
                onPress={() => handleQuickDemo('Content Admin')}
                className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-neutral-100 py-2.5"
              >
                <UserCheck size={14} color="#000" />
                <Text className="text-xs font-semibold text-black">Content Admin</Text>
              </Pressable>
            </View>
          </View>

          <Pressable onPress={() => router.navigate('/')} className="mt-6 items-center">
            <Text className="text-xs text-neutral-500">← Back to Storefront</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
