import { MessageSquare, RefreshCw, ShieldCheck, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Sheet } from '@/components/ui/Sheet';
import { Img } from '@/components/ui/primitives';
import { Product } from '@/lib/types';
import { formatNaira, triggerDirectWhatsAppBuy } from '@/lib/utils';

import { ProductBadge } from './ProductBadge';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSwap?: (product: Product) => void;
  whatsappPhone: string;
}

export function QuickViewModal({ product, onClose, onOpenSwap, whatsappPhone }: QuickViewModalProps) {
  return (
    <Sheet visible={!!product} onClose={onClose}>
      {/* Keyed so the gallery resets when a different product opens */}
      {product && (
        <QuickViewBody
          key={product.id}
          product={product}
          onClose={onClose}
          onOpenSwap={onOpenSwap}
          whatsappPhone={whatsappPhone}
        />
      )}
    </Sheet>
  );
}

function QuickViewBody({
  product,
  onClose,
  onOpenSwap,
  whatsappPhone,
}: Omit<QuickViewModalProps, 'product'> & { product: Product }) {
  const [activeImg, setActiveImg] = useState(product.image_url);
  const gallery = [product.image_url, ...(product.gallery || [])].filter((url, i, self) => self.indexOf(url) === i);

  return (
    <View>
      <Pressable onPress={onClose} className="absolute -right-2 -top-2 z-20 rounded-full p-2" accessibilityLabel="Close">
        <X size={20} color="#737373" />
      </Pressable>

      {/* Gallery */}
      <View className="mt-6 gap-3">
        <View className="aspect-[4/5] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
          <Img source={{ uri: activeImg }} className="h-full w-full" contentFit="cover" transition={200} />
          <ProductBadge type={product.badge_type} label={product.badge_label} />
          {!!product.battery_health && (
            <View className="absolute right-4 top-4 z-10 flex-row items-center gap-1 rounded-md border border-black bg-black px-2.5 py-1 shadow-md">
              <Zap size={14} color="#fff" fill="#fff" />
              <Text className="font-mono text-xs text-white">{product.battery_health}% BH</Text>
            </View>
          )}
        </View>

        {gallery.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {gallery.map((url) => (
              <Pressable
                key={url}
                onPress={() => setActiveImg(url)}
                className={`h-14 w-14 overflow-hidden rounded-lg border-2 ${
                  activeImg === url ? 'border-black' : 'border-neutral-300 opacity-60'
                }`}
              >
                <Img source={{ uri: url }} className="h-full w-full" contentFit="cover" />
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Details */}
      <View className="mt-6">
        <View className="mb-1 flex-row items-center gap-2">
          {!!product.storage && (
            <View className="rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5">
              <Text className="font-mono text-xs font-semibold text-black">{product.storage}</Text>
            </View>
          )}
          {!!product.color && <Text className="font-mono text-xs text-neutral-600">• {product.color}</Text>}
        </View>

        <Text className="font-serif text-xl font-bold text-black">{product.name}</Text>

        <View className="mt-3 flex-row items-baseline gap-3">
          <Text className="font-mono text-2xl font-bold text-black">{formatNaira(product.price)}</Text>
          {!!product.original_price && (
            <Text className="font-mono text-xs text-neutral-400 line-through">
              {formatNaira(product.original_price)}
            </Text>
          )}
        </View>

        {!!product.condition_description && (
          <View className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <Text className="mb-0.5 font-mono text-xs font-semibold text-black">Condition Report:</Text>
            <Text className="font-mono text-xs text-neutral-800">{product.condition_description}</Text>
          </View>
        )}

        <Text className="mt-3 text-xs font-light leading-relaxed text-neutral-600">{product.description}</Text>

        <View className="mt-3 flex-row items-center gap-2">
          <ShieldCheck size={16} color="#000" />
          <Text className="text-[11px] text-neutral-700">Dr Apple Kano 50-Point Technical Guarantee</Text>
        </View>

        {/* Actions */}
        <View className="mt-4 gap-2.5 border-t border-neutral-200 pt-4">
          <Pressable
            onPress={() => triggerDirectWhatsAppBuy(product, whatsappPhone)}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-black py-3.5 shadow-xl active:bg-neutral-800"
          >
            <MessageSquare size={16} color="#fff" fill="#fff" />
            <Text className="text-xs font-bold text-white">Order Now on WhatsApp</Text>
          </Pressable>

          {onOpenSwap && (
            <Pressable
              onPress={() => {
                onClose();
                onOpenSwap(product);
              }}
              className="flex-row items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-neutral-100 py-2.5 active:bg-neutral-200"
            >
              <RefreshCw size={14} color="#000" />
              <Text className="text-xs font-semibold text-black">Swap Your Old Phone</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
