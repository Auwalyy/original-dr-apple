import React from 'react';
import { Platform, ScrollView, ScrollViewProps, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusBarBackdrop } from './primitives';

/**
 * Scroll container for tab screens. iOS insets content for the status bar and tab bar natively
 * (`contentInsetAdjustmentBehavior`); Android and web get explicit safe-area padding.
 */
export function TabScrollView({ children, contentContainerStyle, ...props }: ScrollViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingTop: Platform.OS === 'ios' ? 8 : insets.top + 8, paddingBottom: 32 },
          contentContainerStyle,
        ]}
        {...props}
      >
        {children}
      </ScrollView>
      <StatusBarBackdrop height={insets.top} />
    </View>
  );
}

/** Large page title used at the top of each tab. */
export function LargeTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View className="flex-row items-end justify-between gap-4 px-5 pb-2">
      <View className="flex-1">
        <Text className="font-serif text-display font-bold text-ink">{title}</Text>
        {!!subtitle && <Text className="mt-1 text-body text-secondary">{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}
