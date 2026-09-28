import { router, Stack } from 'expo-router';
import { PackageSearch, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { AdminScreen } from '@/components/admin/AdminScreen';
import { useFeedback } from '@/components/ui/Feedback';
import { Chip, EmptyState, IconButton, Img, SearchBar } from '@/components/ui/primitives';
import { colors, shadows } from '@/components/ui/theme';
import { CATEGORY_FILTERS, categoryLabel } from '@/lib/catalog';
import { haptics } from '@/lib/haptics';
import { useCMS } from '@/lib/store';
import { CategoryFilter } from '@/lib/types';
import { formatNaira } from '@/lib/utils';

export default function AdminProductsScreen() {
  const { products, updateProduct } = useCMS();
  const { toast } = useFeedback();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const q = search.trim().toLowerCase();
  const filtered = products.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (q === '' || p.name.toLowerCase().includes(q) || (p.storage?.toLowerCase().includes(q) ?? false)),
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <IconButton
              icon={Plus}
              accessibilityLabel="Add product"
              size={34}
              onPress={() => router.push({ pathname: '/admin/product/[id]', params: { id: 'new' } })}
            />
          ),
        }}
      />
      <AdminScreen contentContainerStyle={{ gap: 16 }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search products" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORY_FILTERS.map((c) => (
            <Chip key={c.value} label={c.label} selected={category === c.value} onPress={() => setCategory(c.value)} />
          ))}
        </ScrollView>

        {filtered.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products found"
            message="Try another search or add a new product."
            actionLabel="Add product"
            onAction={() => router.push({ pathname: '/admin/product/[id]', params: { id: 'new' } })}
          />
        ) : (
          <View className="overflow-hidden rounded-2xl bg-white" style={shadows.card}>
            {filtered.map((product, i) => (
              <Pressable
                key={product.id}
                onPress={() => {
                  haptics.selection();
                  router.push({ pathname: '/admin/product/[id]', params: { id: product.id } });
                }}
                className={`flex-row items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-separator' : ''}`}
                style={({ pressed }) => ({ backgroundColor: pressed ? colors.fill : colors.white })}
              >
                <Img source={{ uri: product.image_url }} className="h-14 w-14 rounded-xl bg-fill" contentFit="cover" />
                <View className="flex-1">
                  <Text className="text-body font-semibold text-ink" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text className="mt-0.5 text-subhead text-secondary" numberOfLines={1}>
                    {formatNaira(product.price)} · {categoryLabel(product.category)} · {product.stock} in stock
                  </Text>
                  <Text
                    className={`mt-0.5 text-caption font-medium ${product.is_published ? 'text-success' : 'text-tertiary'}`}
                  >
                    {product.is_published ? 'Live' : 'Hidden'}
                  </Text>
                </View>
                <Switch
                  value={product.is_published}
                  onValueChange={(v) => {
                    updateProduct(product.id, { is_published: v });
                    toast(v ? 'Published to storefront' : 'Hidden from storefront');
                  }}
                  trackColor={{ true: colors.ink, false: colors.separator }}
                  thumbColor={colors.white}
                  accessibilityLabel={`Show ${product.name} in store`}
                />
              </Pressable>
            ))}
          </View>
        )}
      </AdminScreen>
    </>
  );
}
