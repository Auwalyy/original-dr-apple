import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { ProductBadgeType } from '@/lib/types';
import { formatBadgeLabel } from '@/lib/utils';

// Monochrome badge spec from globals.css (.badge-new / .badge-used / .badge-defect / .badge-accessory).
const BADGE_STYLES: Record<ProductBadgeType, { box: string; text: string }> = {
  'badge-new': { box: 'bg-black border-black', text: 'text-white' },
  'badge-used': { box: 'bg-white border-black', text: 'text-black' },
  'badge-defect': { box: 'bg-black border-black', text: 'text-white' },
  'badge-accessory': { box: 'bg-zinc-100 border-zinc-200', text: 'text-black' },
};

interface ProductBadgeProps {
  type: ProductBadgeType;
  label?: string;
  /** Absolutely positions the badge at top-4 left-4 like `.product-badge`. */
  floating?: boolean;
}

/** `.badge-defect` pulse-border animation: an expanding ring that fades out every 2s. */
function PulseRing() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 2000 }), -1);
  }, [t]);
  const style = useAnimatedStyle(() => {
    const p = Math.min(t.value / 0.7, 1);
    return {
      opacity: 0.4 * (1 - p),
      transform: [{ scaleX: 1 + p * 0.12 }, { scaleY: 1 + p * 0.45 }],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 4, backgroundColor: '#000' },
        style,
      ]}
    />
  );
}

export function ProductBadge({ type, label, floating = true }: ProductBadgeProps) {
  const s = BADGE_STYLES[type] ?? BADGE_STYLES['badge-new'];
  return (
    <View className={floating ? 'absolute left-4 top-4 z-10' : ''}>
      {type === 'badge-defect' && <PulseRing />}
      <View className={`rounded border px-3 py-1.5 shadow-sm ${s.box}`}>
        <Text className={`text-[11px] font-semibold uppercase tracking-[0.55px] ${s.text}`}>
          {formatBadgeLabel(type, label)}
        </Text>
      </View>
    </View>
  );
}
