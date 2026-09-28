import React from 'react';
import { Text, View } from 'react-native';

import { StockTone, stockStatus } from '@/lib/catalog';
import { Product, ProductBadgeType } from '@/lib/types';
import { formatBadgeLabel } from '@/lib/utils';

// Monochrome condition tags, following the website's badge spec (new = black, used = outlined white).
const TAG_STYLES: Record<ProductBadgeType, { box: string; text: string }> = {
  'badge-new': { box: 'bg-ink', text: 'text-white' },
  'badge-used': { box: 'border border-ink bg-white', text: 'text-ink' },
  'badge-defect': { box: 'bg-ink', text: 'text-white' },
  'badge-accessory': { box: 'bg-white', text: 'text-ink' },
};

export function ConditionTag({ type, label }: { type: ProductBadgeType; label?: string }) {
  const s = TAG_STYLES[type] ?? TAG_STYLES['badge-new'];
  return (
    <View className={`self-start rounded-md px-2 py-1 ${s.box}`}>
      <Text className={`text-[11px] font-semibold tracking-wide ${s.text}`}>{formatBadgeLabel(type, label)}</Text>
    </View>
  );
}

const TONE: Record<StockTone, { dot: string; text: string }> = {
  success: { dot: 'bg-success', text: 'text-success' },
  warning: { dot: 'bg-warning', text: 'text-warning' },
  danger: { dot: 'bg-danger', text: 'text-danger' },
};

export function StockIndicator({ product }: { product: Product }) {
  const { label, tone } = stockStatus(product);
  return (
    <View className="flex-row items-center gap-1.5">
      <View className={`h-2 w-2 rounded-full ${TONE[tone].dot}`} />
      <Text className={`text-subhead font-medium ${TONE[tone].text}`}>{label}</Text>
    </View>
  );
}
