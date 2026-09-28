import { router } from 'expo-router';
import {
  CheckCircle,
  Image as ImageIcon,
  LucideIcon,
  Package,
  Plus,
  RefreshCw,
  Sliders,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AdminShell, Panel } from '@/components/admin/AdminShell';
import { Img } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { formatNaira } from '@/lib/utils';

export default function AdminDashboardScreen() {
  const { products, updateProduct } = useCMS();

  const metrics: { icon: LucideIcon; tag: string; label: string; value: number }[] = [
    { icon: Package, tag: 'Active', label: 'Total Products', value: products.length },
    { icon: CheckCircle, tag: 'Storefront', label: 'Published Live', value: products.filter((p) => p.is_published).length },
    { icon: RefreshCw, tag: 'Kano Trade-in', label: 'UK Used & Swaps', value: products.filter((p) => p.category === 'uk-used').length },
    { icon: Zap, tag: 'Discounted', label: 'Defect Deals', value: products.filter((p) => p.category === 'defect-deals').length },
  ];

  const modules = [
    { icon: Package, title: 'Products Catalogue', desc: 'Manage price, specs, stock & condition badges.', path: '/admin/products' },
    { icon: Sliders, title: 'Dynamic Banners', desc: 'Hero title, background image & announcement text.', path: '/admin/settings' },
    { icon: RefreshCw, title: 'Swap Program Copy', desc: 'Pinned image & step-by-step narrative copy.', path: '/admin/swap-program' },
    { icon: ImageIcon, title: 'Supabase Cloud Storage', desc: 'Upload & manage image assets in cloud storage.', path: '/admin/media' },
  ] as const;

  return (
    <AdminShell title="Admin Overview & Operations">
      {/* Key metrics */}
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {metrics.map(({ icon: Icon, tag, label, value }) => (
          <View key={label} className="w-[48%] gap-2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Icon size={20} color="#000" />
              <View className="rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5">
                <Text className="font-mono text-[10px] font-bold text-black" numberOfLines={1}>
                  {tag}
                </Text>
              </View>
            </View>
            <Text className="text-xs font-medium text-neutral-600">{label}</Text>
            <Text className="font-serif text-3xl font-bold text-black">{value}</Text>
          </View>
        ))}
      </View>

      {/* CMS modules */}
      <View className="gap-4">
        <Text className="font-serif text-lg font-bold text-black">CMS Core Modules</Text>
        <View className="gap-4">
          {modules.map(({ icon: Icon, title, desc, path }) => (
            <Pressable
              key={path}
              onPress={() => router.push(path)}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm active:border-black"
            >
              <View className="mb-3">
                <Icon size={24} color="#000" />
              </View>
              <Text className="text-sm font-bold text-black">{title}</Text>
              <Text className="mt-1 text-xs text-neutral-600">{desc}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Catalogue quick control */}
      <Panel className="shadow-md">
        <View className="gap-3">
          <View>
            <Text className="font-serif text-lg font-bold text-black">Catalogue Quick Control</Text>
            <Text className="text-xs text-neutral-600">Toggle published state or launch product editor</Text>
          </View>
          <Pressable
            onPress={() => router.push('/admin/products')}
            className="flex-row items-center gap-1.5 self-start rounded-xl bg-black px-4 py-2 shadow-sm"
          >
            <Plus size={16} color="#fff" />
            <Text className="text-xs font-bold text-white">Manage Products</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View className="flex-row border-b border-neutral-300 bg-neutral-100">
              {['Item', 'Category', 'Price (NGN)', 'Badge', 'Status', 'Actions'].map((h, i) => (
                <Text key={h} className="px-4 py-3 font-mono text-[10px] uppercase text-black" style={{ width: COLS[i] }}>
                  {h}
                </Text>
              ))}
            </View>

            {products.slice(0, 5).map((product) => (
              <View key={product.id} className="flex-row items-center border-b border-neutral-200">
                <View className="flex-row items-center gap-3 px-4 py-3" style={{ width: COLS[0] }}>
                  <Img
                    source={{ uri: product.image_url }}
                    className="h-9 w-9 rounded-lg border border-neutral-300 bg-neutral-100"
                    contentFit="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-black" numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text className="font-mono text-[10px] text-neutral-500" numberOfLines={1}>
                      {product.storage} • {product.color}
                    </Text>
                  </View>
                </View>
                <View className="px-4 py-3" style={{ width: COLS[1] }}>
                  <View className="self-start rounded border border-neutral-300 bg-neutral-100 px-2 py-1">
                    <Text className="font-mono text-[11px] font-semibold text-black">{product.category}</Text>
                  </View>
                </View>
                <Text className="px-4 py-3 font-mono text-xs font-bold text-black" style={{ width: COLS[2] }}>
                  {formatNaira(product.price)}
                </Text>
                <Text className="px-4 py-3 font-mono text-[10px] text-black" style={{ width: COLS[3] }}>
                  {product.badge_label}
                </Text>
                <View className="px-4 py-3" style={{ width: COLS[4] }}>
                  <Pressable
                    onPress={() => updateProduct(product.id, { is_published: !product.is_published })}
                    className={`self-start rounded-full border px-3 py-1 ${
                      product.is_published ? 'border-black bg-black' : 'border-neutral-300 bg-neutral-100'
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold uppercase tracking-[0.5px] ${
                        product.is_published ? 'text-white' : 'text-neutral-600'
                      }`}
                    >
                      {product.is_published ? 'Live' : 'Draft'}
                    </Text>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => router.push({ pathname: '/admin/products', params: { edit: product.id } })}
                  className="px-4 py-3"
                  style={{ width: COLS[5] }}
                >
                  <Text className="text-xs font-semibold text-black">Edit →</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </Panel>
    </AdminShell>
  );
}

const COLS = [260, 140, 130, 130, 100, 90];
