import { Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Eyebrow } from '@/components/ui/primitives';
import { CategoryFilter, Product } from '@/lib/types';

import { ProductCard } from './ProductCard';

const CARD_WIDTH = 260;
const GAP = 16;

const CATEGORIES: { label: string; value: CategoryFilter }[] = [
  { label: 'All Collection', value: 'all' },
  { label: 'Brand New', value: 'brand-new' },
  { label: 'UK Used / Swap', value: 'uk-used' },
  { label: 'Defect Deals', value: 'defect-deals' },
  { label: 'Accessories', value: 'accessories' },
];

interface HorizontalProductScrollProps {
  products: Product[];
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  onQuickView: (product: Product) => void;
  title?: string;
  subtitle?: string;
}

export function HorizontalProductScroll({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  title = 'Featured Apple Inventory',
  subtitle = 'Discover certified Apple smartphones & accessories available in Kano, Nigeria.',
}: HorizontalProductScrollProps) {
  // Drives the thin black scrollbar thumb from `.horizontal-scroll-container`.
  const [scrollMetrics, setScrollMetrics] = useState({ x: 0, content: 1, visible: 1 });
  const thumbRatio = Math.min(1, scrollMetrics.visible / scrollMetrics.content);
  const maxX = Math.max(1, scrollMetrics.content - scrollMetrics.visible);
  const thumbOffset = (scrollMetrics.x / maxX) * (1 - thumbRatio);

  return (
    <View className="bg-white py-16">
      <Animated.View entering={FadeInDown.duration(800)} className="mb-8 gap-6 px-4">
        <View>
          <View className="mb-2">
            <Eyebrow icon={<Sparkles size={14} color="#000" />}>Solène Fragrance Curated Catalogue</Eyebrow>
          </View>
          <Text className="font-serif text-2xl font-bold tracking-tight text-black">{title}</Text>
          <Text className="mt-2 max-w-xl text-xs font-light text-neutral-600">{subtitle}</Text>
        </View>

        {/* Category filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="grow-0 rounded-xl border border-neutral-300 bg-neutral-100"
          contentContainerStyle={{ padding: 4, gap: 6 }}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.value;
            return (
              <Pressable
                key={cat.value}
                onPress={() => onSelectCategory(cat.value)}
                className={`rounded-lg px-3 py-1.5 ${active ? 'bg-black shadow-md' : ''}`}
              >
                <Text className={`text-xs ${active ? 'font-bold text-white' : 'font-medium text-neutral-600'}`}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {products.length === 0 ? (
        <View className="mx-4 items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-12">
          <Text className="text-center text-sm text-neutral-600">No products found under this category.</Text>
          <Pressable onPress={() => onSelectCategory('all')} className="mt-4">
            <Text className="text-xs font-medium text-black underline">Reset Filter</Text>
          </Pressable>
        </View>
      ) : (
        <Animated.View entering={FadeInDown.duration(800).delay(200)}>
          <FlatList
            horizontal
            data={products}
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + GAP}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: GAP }}
            onScroll={(e) => {
              const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
              setScrollMetrics({ x: contentOffset.x, content: contentSize.width, visible: layoutMeasurement.width });
            }}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={{ width: CARD_WIDTH }}>
                <ProductCard product={item} onQuickView={onQuickView} />
              </View>
            )}
          />

          {/* Custom 3px scrollbar */}
          <View className="mx-4 mt-4 h-[3px] overflow-hidden rounded-full bg-black/5">
            <View
              className="h-full rounded-full bg-black"
              style={{ width: `${thumbRatio * 100}%`, marginLeft: `${thumbOffset * 100}%` }}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}
