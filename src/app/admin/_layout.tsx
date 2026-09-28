import { Stack } from 'expo-router';
import React from 'react';

import { colors } from '@/components/ui/theme';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.ink,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.canvas },
        headerTitleStyle: { fontWeight: '600' },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false, contentStyle: { backgroundColor: colors.white } }} />
      <Stack.Screen
        name="index"
        options={{ title: 'Dashboard', headerLargeTitle: true, headerLargeTitleShadowVisible: false }}
      />
      <Stack.Screen name="products" options={{ title: 'Products' }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
      <Stack.Screen name="settings" options={{ title: 'Storefront' }} />
      <Stack.Screen name="swap-program" options={{ title: 'Swap content' }} />
      <Stack.Screen name="media" options={{ title: 'Media library' }} />
      <Stack.Screen name="users" options={{ title: 'Team & roles' }} />
    </Stack>
  );
}
