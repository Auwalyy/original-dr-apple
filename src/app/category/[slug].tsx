import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useStorefrontModals } from '@/components/useStorefrontModals';
import { useCMS } from '@/lib/store';
import { CategoryFilter } from '@/lib/types';
import { matchesSearch } from '@/lib/utils';

const CATEGORY_TITLES: Record<string, string> = {
  'brand-new': 'Brand New Factory Sealed iPhones',
  'uk-used': 'UK Used & Certified Trade-Ins',
  'defect-deals': 'Defect Deals & Discounted iPhones',
  accessories: 'Original Apple Accessories & Chargers',
};

export default function CategoryScreen() {
  const { slug = 'brand-new' } = useLocalSearchParams<{ slug: string }>();
  const { products, settings } = useCMS();
  const { openSwap, openQuickView, modals } = useStorefrontModals();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(slug as CategoryFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const title = CATEGORY_TITLES[activeCategory] || 'Certified Apple Inventory';
  const filtered = products.filter(
    (p) =>
      p.is_published && (activeCategory === 'all' || p.category === activeCategory) && matchesSearch(p, searchQuery)
  );
  const announcement = settings.announcement_enabled ? settings.announcement_text : undefined;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style={announcement ? 'light' : 'dark'} />

      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenSwapModal={() => openSwap()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        announcementText={announcement}
        whatsappPhone={settings.contact_whatsapp}
        scrolled={scrolled}
      />

      <ScrollView
        onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 30)}
        scrollEventThrottle={32}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-4 pb-20 pt-10">
          {/* Breadcrumb & header */}
          <View className="mb-10">
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              className="mb-4 flex-row items-center gap-1"
            >
              <ArrowLeft size={14} color="#737373" />
              <Text className="font-mono text-xs text-neutral-500">Back to Storefront</Text>
            </Pressable>
            <View className="mb-2 flex-row items-center gap-2">
              <Sparkles size={16} color="#000" />
              <Text className="font-mono text-xs uppercase tracking-[1.2px] text-neutral-500">
                Kano Dedicated Category View
              </Text>
            </View>
            <Text className="font-serif text-3xl font-bold text-black">{title}</Text>
            <Text className="mt-2 text-sm font-light text-neutral-600">
              Browse {filtered.length} certified items available in Kano State.
            </Text>
          </View>

          {filtered.length === 0 ? (
            <View className="items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-16">
              <Text className="text-center text-sm text-neutral-600">No items found in this category.</Text>
            </View>
          ) : (
            <View className="gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={openQuickView} />
              ))}
            </View>
          )}
        </View>

        <Footer settings={settings} onOpenSwapModal={() => openSwap()} />
      </ScrollView>

      {modals}
    </View>
  );
}
