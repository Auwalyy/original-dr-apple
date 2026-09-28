import { Redirect } from 'expo-router';
import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCMS } from '@/lib/store';

/** Grouped-background scroll view for admin screens; sends signed-out users to the login screen. */
export function AdminScreen({ children, contentContainerStyle, ...props }: ScrollViewProps) {
  const { session } = useCMS();
  const insets = useSafeAreaInsets();

  if (!session) return <Redirect href="/admin/login" />;

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={[{ padding: 16, paddingBottom: 40 + insets.bottom, gap: 28 }, contentContainerStyle]}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
