import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Img } from '@/components/ui/primitives';
import { discountPercent, productMeta } from '@/lib/catalog';
import { haptics } from '@/lib/haptics';
import { Product } from '@/lib/types';
import { formatNaira } from '@/lib/utils';

import { ConditionTag } from './ProductBadge';

interface ProductCardProps {
  product: Product;
  /** Fixed width for horizontal carousels; omit to fill the grid cell. */
  width?: number;
}

export function ProductCard({ product, width }: ProductCardProps) {
  const discount = discountPercent(product);
  const soldOut = product.stock <= 0;

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        router.push({ pathname: '/product/[id]', params: { id: product.id } });
      }}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatNaira(product.price)}`}
      style={({ pressed }) => [{ width, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
      className={width ? '' : 'flex-1'}
    >
      <View className="aspect-square overflow-hidden rounded-2xl bg-fill">
        <Img source={{ uri: product.image_url }} className="h-full w-full" contentFit="cover" transition={200} />

        <View className="absolute left-2.5 top-2.5">
          <ConditionTag type={product.badge_type} label={product.badge_label} />
        </View>

        {discount >= 5 && !soldOut && (
          <View className="absolute right-2.5 top-2.5 rounded-md bg-white px-1.5 py-1">
            <Text className="text-[11px] font-bold text-ink">-{discount}%</Text>
          </View>
        )}

        {soldOut && (
          <View className="absolute inset-0 items-center justify-center bg-white/60">
            <View className="rounded-full bg-ink px-3 py-1.5">
              <Text className="text-caption font-semibold text-white">Sold out</Text>
            </View>
          </View>
        )}
      </View>

      <View className="px-0.5 pt-2.5">
        <Text className="min-h-[40px] text-body font-semibold text-ink" numberOfLines={2}>
          {product.name}
        </Text>
        <Text className="mt-0.5 text-subhead text-secondary" numberOfLines={1}>
          {productMeta(product) || ' '}
        </Text>
        <View className="mt-1.5 flex-row flex-wrap items-baseline gap-x-1.5">
          <Text className="text-headline font-bold text-ink">{formatNaira(product.price)}</Text>
          {!!product.original_price && product.original_price > product.price && (
            <Text className="text-caption text-tertiary line-through">{formatNaira(product.original_price)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
