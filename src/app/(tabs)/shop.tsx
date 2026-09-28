import { useLocalSearchParams } from 'expo-router';
import { ArrowUpDown, Check, SearchX } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/ProductCard';
import { useFeedback } from '@/components/ui/Feedback';
import { Chip, EmptyState, SearchBar } from '@/components/ui/primitives';
import { colors } from '@/components/ui/theme';
import { CATEGORY_FILTERS, SORT_OPTIONS, SortKey, sortProducts } from '@/lib/catalog';
import { useCMS } from '@/lib/store';
import { CategoryFilter } from '@/lib/types';
import { matchesSearch } from '@/lib/utils';

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const { products } = useCMS();
  const { showActions } = useFeedback();
  const params = useLocalSearchParams<{ category?: CategoryFilter; focus?: string }>();

  const [category, setCategory] = useState<CategoryFilter>(params.category ?? 'all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');

  // Home screen shortcuts ("Shop by category") update this tab while it is already mounted.
  const [lastParam, setLastParam] = useState(params.category);
  if (params.category !== lastParam) {
    setLastParam(params.category);
    if (params.category) setCategory(params.category);
  }

  const live = products.filter((p) => p.is_published);
  const searched = live.filter((p) => matchesSearch(p, query));
  const results = sortProducts(
    searched.filter((p) => category === 'all' || p.category === category),
    sort,
  );
  const countFor = (value: CategoryFilter) =>
    value === 'all' ? searched.length : searched.filter((p) => p.category === value).length;

  const openSort = () =>
    showActions({
      title: 'Sort by',
      options: SORT_OPTIONS.map((o) => ({
        label: o.label,
        icon: o.value === sort ? Check : undefined,
        onPress: () => setSort(o.value),
      })),
    });

  return (
    <View className="flex-1 bg-white">
      {/* Sticky header */}
      <View className="border-b border-separator bg-white" style={{ paddingTop: insets.top + 8 }}>
        <Text className="px-5 font-serif text-display font-bold text-ink">Shop</Text>
        <View className="px-5 pb-3 pt-3">
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="iPhone 15 Pro, AirPods, 256GB…"
            autoFocus={params.focus === '1'}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12, gap: 8 }}
        >
          {CATEGORY_FILTERS.map((c) => (
            <Chip
              key={c.value}
              label={c.label}
              count={countFor(c.value)}
              selected={category === c.value}
              onPress={() => setCategory(c.value)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32, gap: 20 }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between">
            <Text className="text-subhead text-secondary">
              {results.length} {results.length === 1 ? 'item' : 'items'}
            </Text>
            <Pressable onPress={openSort} hitSlop={8} className="flex-row items-center gap-1.5">
              <ArrowUpDown size={15} color={colors.ink} />
              <Text className="text-subhead font-semibold text-ink">
                {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item, index }) => (
          // Keep a lone last card at half width.
          <View
            style={{
              flex: 1,
              maxWidth: results.length % 2 === 1 && index === results.length - 1 ? '48.5%' : undefined,
            }}
          >
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={SearchX}
            title="No matches"
            message={query ? `Nothing found for “${query}”.` : 'Nothing in this category right now.'}
            actionLabel="Clear filters"
            onAction={() => {
              setQuery('');
              setCategory('all');
            }}
          />
        }
      />
    </View>
  );
}
