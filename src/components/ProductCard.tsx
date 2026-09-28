import { ArrowUpRight, Zap } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Gradient, Img, PressableScale } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { Product } from '@/lib/types';
import { formatNaira, triggerDirectWhatsAppBuy } from '@/lib/utils';

import { ProductBadge } from './ProductBadge';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { settings } = useCMS();
  const isOutOfStock = product.stock <= 0;

  return (
    <PressableScale
      onPress={() => onQuickView(product)}
      className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-md"
    >
      {/* Image */}
      <View className="aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Img source={{ uri: product.image_url }} className="h-full w-full" contentFit="cover" transition={250} />
        <Gradient
          colors={['transparent', 'transparent', 'rgba(0,0,0,0.4)']}
          className="absolute inset-0 opacity-40"
          pointerEvents="none"
        />
      </View>

      {/* Condition badge */}
      <ProductBadge type={product.badge_type} label={product.badge_label} />

      {/* Battery health badge */}
      {!!product.battery_health && (
        <View className="absolute right-4 top-4 z-10 flex-row items-center gap-1 rounded-md border border-black bg-black px-2.5 py-1 shadow-md">
          <Zap size={12} color="#fff" fill="#fff" />
          <Text className="font-mono text-[10px] text-white">{product.battery_health}% BH</Text>
        </View>
      )}

      {/* Content */}
      <View className="bg-white p-4">
        <View className="mb-2 flex-row items-center gap-2">
          {!!product.storage && (
            <View className="rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5">
              <Text className="font-mono text-[11px] font-semibold text-black">{product.storage}</Text>
            </View>
          )}
          {!!product.color && <Text className="font-mono text-[11px] text-neutral-600">• {product.color}</Text>}
        </View>

        <Text className="font-serif text-base font-bold text-black" numberOfLines={1}>
          {product.name}
        </Text>

        <Text className="mt-1 min-h-[32px] text-xs font-light text-neutral-600" numberOfLines={2}>
          {product.condition_description || product.description}
        </Text>

        <View className="mt-4 flex-row items-end justify-between border-t border-neutral-200 pt-3">
          <View className="flex-1 pr-2">
            <View className="flex-row flex-wrap items-baseline gap-x-2">
              <Text className="font-mono text-base font-bold tracking-tight text-black">
                {formatNaira(product.price)}
              </Text>
              {!!product.original_price && (
                <Text className="font-mono text-xs text-neutral-400 line-through">
                  {formatNaira(product.original_price)}
                </Text>
              )}
            </View>
            <Text className="mt-0.5 text-[10px] text-neutral-500">Farm Centre Kano Direct Dispatch</Text>
          </View>

          <Pressable
            disabled={isOutOfStock}
            onPress={() => triggerDirectWhatsAppBuy(product, settings.contact_whatsapp)}
            className={`flex-row items-center gap-1 rounded-lg border border-black bg-black px-3 py-1.5 shadow-sm ${
              isOutOfStock ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-[11px] font-semibold text-white">{isOutOfStock ? 'Sold Out' : 'Buy Now'}</Text>
            <ArrowUpRight size={12} color="#fff" />
          </Pressable>
        </View>
      </View>
    </PressableScale>
  );
}
