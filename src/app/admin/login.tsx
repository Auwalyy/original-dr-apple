import { Redirect, router } from 'expo-router';
import { Lock, Mail, Shield, UserCheck, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark, Button, IconButton, TextField } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { AdminSession, Role } from '@/lib/types';

// Demo authentication, as on the website: the email decides the role.
function sessionForEmail(email: string): AdminSession {
  if (email.includes('super') || email.includes('admin@drapple')) {
    return { email, role: 'Super Admin', name: 'Dr. Apple CEO' };
  }
  if (email.includes('store') || email.includes('content')) {
    return { email, role: 'Content Admin', name: 'Kano Store Manager' };
  }
  return { email, role: 'Super Admin', name: 'Super Admin' };
}

export default function AdminLoginScreen() {
  const { session, login } = useCMS();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  if (session) return <Redirect href="/admin" />;

  const enter = (next: AdminSession) => {
    login(next);
    router.replace('/admin');
  };

  const handleLogin = () => {
    const trimmed = email.trim().toLowerCase();
    const nextErrors = {
      email: !/^\S+@\S+\.\S+$/.test(trimmed) ? 'Enter a valid email address' : undefined,
      password: password.length === 0 ? 'Enter your password' : undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      enter(sessionForEmail(trimmed));
    }, 500);
  };

  const demo = (role: Role) =>
    enter({
      email: role === 'Super Admin' ? 'admin@drapple.ng' : 'store@drapple.ng',
      role,
      name: role === 'Super Admin' ? 'Dr. Apple CEO' : 'Kano Store Manager',
    });

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}
      >
        <View className="px-4">
          <IconButton
            icon={X}
            accessibilityLabel="Close"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/store'))}
          />
        </View>

        <View className="flex-1 justify-center px-6">
          <BrandMark size={56} />
          <Text className="mt-6 font-serif text-display font-bold text-ink">Staff sign in</Text>
          <Text className="mt-1 text-body text-secondary">
            Manage products, banners and swap content for the Kano store.
          </Text>

          <View className="mt-8 gap-4">
            <TextField
              label="Email"
              icon={Mail}
              placeholder="you@drapple.ng"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="username"
              returnKeyType="next"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              error={errors.email}
            />
            <TextField
              label="Password"
              icon={Lock}
              placeholder="Password"
              secureTextEntry
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
            />
            <Button title="Sign in" size="lg" loading={loading} onPress={handleLogin} className="mt-2" />
          </View>

          <View className="my-8 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-separator" />
            <Text className="text-subhead text-secondary">or try a demo account</Text>
            <View className="h-px flex-1 bg-separator" />
          </View>

          <View className="flex-row gap-3">
            <Button
              title="Super Admin"
              variant="secondary"
              icon={Shield}
              className="flex-1"
              onPress={() => demo('Super Admin')}
            />
            <Button
              title="Content Admin"
              variant="secondary"
              icon={UserCheck}
              className="flex-1"
              onPress={() => demo('Content Admin')}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
