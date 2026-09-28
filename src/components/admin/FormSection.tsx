import React from 'react';
import { Switch, Text, View } from 'react-native';

import { colors, shadows } from '@/components/ui/theme';

export function BrandSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ true: colors.ink, false: colors.separator }}
      thumbColor={colors.white}
    />
  );
}

/** White grouped card with a small caption title, used by every admin form. */
export function FormSection({
  title,
  footer,
  children,
}: {
  title?: string;
  footer?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2">
      {!!title && <Text className="px-4 text-subhead font-medium uppercase tracking-wide text-secondary">{title}</Text>}
      <View className="gap-4 rounded-2xl bg-white p-4" style={shadows.card}>
        {children}
      </View>
      {!!footer && <Text className="px-4 text-caption text-secondary">{footer}</Text>}
    </View>
  );
}

/** Label + description on the left, a control (Switch) on the right. */
export function ToggleRow({
  title,
  description,
  control,
}: {
  title: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1">
        <Text className="text-body font-medium text-ink">{title}</Text>
        {!!description && <Text className="mt-0.5 text-subhead text-secondary">{description}</Text>}
      </View>
      {control}
    </View>
  );
}
