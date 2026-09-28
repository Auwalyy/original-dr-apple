import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FeedbackProvider } from '@/components/ui/Feedback';
import { colors } from '@/components/ui/theme';
import { CMSProvider, useCMS } from '@/lib/store';

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { ready } = useCMS();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.white } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="product/[id]" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CMSProvider>
          <FeedbackProvider>
            <StatusBar style="dark" />
            <RootStack />
          </FeedbackProvider>
        </CMSProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
