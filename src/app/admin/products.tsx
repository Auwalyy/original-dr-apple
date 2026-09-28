import { useLocalSearchParams } from 'expo-router';
import { Edit2, Eye, EyeOff, Plus, Search, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { AdminShell } from '@/components/admin/AdminShell';
import { ProductForm } from '@/components/admin/ProductForm';
import { Select } from '@/components/ui/Select';
import { Img } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { CategoryFilter } from '@/lib/types';
import { formatNaira } from '@/lib/utils';

export default function AdminProductsScreen() {
  const { products, addProduct, updateProduct, deleteProduct } = useCMS();
  const { edit } = useLocalSearchParams<{ edit?: string }>();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [isCreating, setIsCreating] = useState(false);
  // Opened straight into the editor when arriving from the dashboard's "Edit →" link.
  const [editingId, setEditingId] = useState<string | null>(edit ?? null);
  const editingProduct = products.find((p) => p.id === editingId) ?? null;

  const handleDelete = (id: string) =>
    Alert.alert('Delete product', 'Are you sure you want to delete this product from the catalogue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(id) },
    ]);

  const q = search.trim().toLowerCase();
  const filtered = products.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.storage?.toLowerCase().includes(q) ?? false))
  );

  if (isCreating) {
    return (
      <AdminShell title="Products Catalogue Management">
        <ProductForm
          title="Create New Phone Product"
          onSubmit={(data) => {
            addProduct(data);
            setIsCreating(false);
          }}
          onCancel={() => setIsCreating(false)}
        />
      </AdminShell>
    );
  }

  if (editingProduct) {
    return (
      <AdminShell title="Products Catalogue Management">
        <ProductForm
          key={editingProduct.id}
          title={`Edit Product: ${editingProduct.name}`}
          initialProduct={editingProduct}
          onSubmit={(data) => {
            updateProduct(editingProduct.id, data);
            setEditingId(null);
          }}
          onCancel={() => setEditingId(null)}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Products Catalogue Management">
      {/* Header controls */}
      <View className="gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <View className="flex-row gap-3">
          <View className="flex-1 justify-center">
            <View className="absolute left-3 z-10">
              <Search size={16} color="#737373" />
            </View>
            <TextInput
              placeholder="Filter products..."
              placeholderTextColor="#737373"
              value={search}
              onChangeText={setSearch}
              className="rounded-xl border border-neutral-300 bg-neutral-50 py-2.5 pl-9 pr-3 text-xs text-black"
            />
          </View>
          <View className="w-[140px]">
            <Select
              variant="admin"
              title="Category"
              value={category}
              onChange={setCategory}
              options={[
                { label: 'All Categories', value: 'all' },
                { label: 'Brand New', value: 'brand-new' },
                { label: 'UK Used / Swap', value: 'uk-used' },
                { label: 'Defect Deals', value: 'defect-deals' },
                { label: 'Accessories', value: 'accessories' },
              ]}
            />
          </View>
        </View>

        <Pressable
          onPress={() => setIsCreating(true)}
          className="flex-row items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 shadow-md"
        >
          <Plus size={16} color="#fff" />
          <Text className="text-xs font-bold text-white">Add New Product</Text>
        </Pressable>
      </View>

      {/* Products */}
      <View className="gap-6">
        {filtered.map((product) => (
          <View key={product.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <View className="mb-3 flex-row items-start gap-3">
              <Img
                source={{ uri: product.image_url }}
                className="h-16 w-16 rounded-xl border border-neutral-200 bg-neutral-100"
                contentFit="cover"
              />
              <View className="flex-1">
                <Text className="font-mono text-[10px] font-bold uppercase text-black">{product.category}</Text>
                <Text className="font-serif text-base font-bold text-black" numberOfLines={1}>
                  {product.name}
                </Text>
                <View className="mt-1 flex-row items-center gap-2">
                  {!!product.storage && <Text className="font-mono text-xs text-neutral-600">{product.storage}</Text>}
                  {!!product.battery_health && (
                    <Text className="font-mono text-xs text-neutral-600">• {product.battery_health}% BH</Text>
                  )}
                </View>
              </View>
            </View>

            <View className="mb-3 flex-row items-center gap-2">
              <Text className="text-[10px] text-neutral-500">Badge:</Text>
              <View className="rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5">
                <Text className="text-xs font-semibold text-black">{product.badge_label}</Text>
              </View>
            </View>

            <Text className="text-xs text-neutral-600" numberOfLines={2}>
              {product.condition_description || product.description}
            </Text>

            <View className="mt-4 flex-row items-center justify-between border-t border-neutral-200 pt-3">
              <Text className="font-mono text-base font-bold text-black">{formatNaira(product.price)}</Text>
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => updateProduct(product.id, { is_published: !product.is_published })}
                  accessibilityLabel={product.is_published ? 'Published (Live)' : 'Draft (Hidden)'}
                  className={`rounded-lg border p-2 ${
                    product.is_published ? 'border-black bg-black' : 'border-neutral-300 bg-neutral-100'
                  }`}
                >
                  {product.is_published ? <Eye size={16} color="#fff" /> : <EyeOff size={16} color="#737373" />}
                </Pressable>
                <Pressable
                  onPress={() => setEditingId(product.id)}
                  accessibilityLabel="Edit product"
                  className="rounded-lg border border-neutral-300 bg-neutral-100 p-2"
                >
                  <Edit2 size={16} color="#000" />
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(product.id)}
                  accessibilityLabel="Delete product"
                  className="rounded-lg border border-neutral-300 bg-neutral-100 p-2"
                >
                  <Trash2 size={16} color="#000" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <Text className="py-10 text-center text-sm text-neutral-600">No products match this filter.</Text>
        )}
      </View>
    </AdminShell>
  );
}
