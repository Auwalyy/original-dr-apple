import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

import { colors } from '@/components/ui/theme';

/** Platform-native tab bar: UITabBar on iOS, Material 3 navigation bar on Android. */
export default function TabsLayout() {
  return (
    <NativeTabs
      tintColor={colors.ink}
      iconColor={{ default: colors.tertiary, selected: colors.ink }}
      indicatorColor={colors.fill}
      backgroundColor={colors.white}
      labelStyle={{ default: { color: colors.secondary }, selected: { color: colors.ink } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="shop">
        <NativeTabs.Trigger.Label>Shop</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="iphone" md="smartphone" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="swap">
        <NativeTabs.Trigger.Label>Swap</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="arrow.triangle.2.circlepath" md="swap_horiz" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="store">
        <NativeTabs.Trigger.Label>Store</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'storefront', selected: 'storefront.fill' }} md="storefront" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
