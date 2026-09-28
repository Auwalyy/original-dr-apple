import { router } from 'expo-router';
import {
  ArrowRight,
  Award,
  ChevronRight,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { Button, Gradient, IconButton, Img, SectionHeader, BrandMark } from '@/components/ui/primitives';
import { TabScrollView } from '@/components/ui/Screen';
import { colors, shadows } from '@/components/ui/theme';
import { CATEGORIES, discountPercent } from '@/lib/catalog';
import { haptics } from '@/lib/haptics';
import { useCMS } from '@/lib/store';
import { Product } from '@/lib/types';
import { INQUIRY_TEXT, openWhatsApp } from '@/lib/utils';

const CARD_WIDTH = 168;

export default function HomeScreen() {
  const { products, settings, swapProgram } = useCMS();
  const live = products.filter((p) => p.is_published);
  const featured = live.filter((p) => p.is_featured);
  const bestValue = [...live]
    .filter((p) => discountPercent(p) > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 8);

  const openShop = (params?: { category?: string; focus?: string }) => router.navigate({ pathname: '/shop', params });

  return (
    <TabScrollView>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-4">
        <View className="flex-row items-center gap-3">
          <BrandMark size={40} />
          <View>
            <Text className="font-serif text-title3 font-bold text-ink">Dr Apple</Text>
            <Text className="text-subhead text-secondary">Farm Centre, Kano</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <IconButton icon={Search} accessibilityLabel="Search" onPress={() => openShop({ focus: '1' })} />
          <IconButton
            icon={MessageCircle}
            accessibilityLabel="Chat on WhatsApp"
            onPress={() => openWhatsApp(settings.contact_whatsapp, INQUIRY_TEXT)}
          />
        </View>
      </View>

      {/* Announcement */}
      {settings.announcement_enabled && !!settings.announcement_text && (
        <Pressable
          onPress={() => {
            haptics.selection();
            router.navigate('/swap');
          }}
          className="mx-5 mb-4 flex-row items-center gap-3 rounded-2xl bg-fill px-4 py-3"
        >
          <View className="h-8 w-8 items-center justify-center rounded-full bg-ink">
            <Zap size={16} color="#fff" fill="#fff" />
          </View>
          <Text className="flex-1 text-subhead font-medium text-ink" numberOfLines={2}>
            {settings.announcement_text.replace(/^⚡\s*/, '')}
          </Text>
          <ChevronRight size={18} color={colors.tertiary} />
        </Pressable>
      )}

      {/* Hero */}
      <View className="mx-5 h-[400px] overflow-hidden rounded-3xl bg-ink" style={shadows.raised}>
        <Img
          source={{ uri: settings.hero_bg_image }}
          className="absolute inset-0"
          contentFit="cover"
          transition={300}
        />
        <Gradient
          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.88)']}
          locations={[0, 0.4, 1]}
          className="absolute inset-0"
        />
        <View className="flex-1 justify-end p-6">
          <View className="mb-3 self-start rounded-full bg-white/20 px-3 py-1">
            <Text className="text-caption font-semibold text-white">Kano’s #1 verified Apple store</Text>
          </View>
          <Text className="font-serif text-[28px] font-bold leading-[34px] text-white">{settings.hero_title}</Text>
          <Text className="mt-2 text-body text-white/80" numberOfLines={2}>
            {settings.hero_subtitle}
          </Text>
          <View className="mt-5 flex-row gap-3">
            <Button
              title={settings.hero_cta_text || 'Shop now'}
              variant="inverse"
              icon={ArrowRight}
              className="flex-1"
              onPress={() => openShop()}
            />
            <Button title="Swap" variant="glass" icon={RefreshCw} onPress={() => router.navigate('/swap')} />
          </View>
        </View>
      </View>

      {/* Categories */}
      <SectionHeader title="Shop by category" className="mb-3 mt-8" />
      <View className="flex-row flex-wrap gap-3 px-5">
        {CATEGORIES.map(({ value, label, description, icon: Icon }) => (
          <Pressable
            key={value}
            onPress={() => {
              haptics.selection();
              openShop({ category: value });
            }}
            className="rounded-2xl bg-fill p-4"
            style={({ pressed }) => ({ width: '48.3%', opacity: pressed ? 0.7 : 1 })}
          >
            <View className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white">
              <Icon size={20} color={colors.ink} />
            </View>
            <Text className="text-body font-semibold text-ink">{label}</Text>
            <Text className="mt-0.5 text-caption text-secondary" numberOfLines={1}>
              {description}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Featured */}
      {featured.length > 0 && (
        <>
          <SectionHeader title="Featured" actionLabel="See all" onAction={() => openShop()} className="mb-3 mt-8" />
          <ProductRail products={featured} />
        </>
      )}

      {/* Swap promo */}
      <View className="mx-5 mt-8 overflow-hidden rounded-3xl bg-ink p-6">
        <View className="mb-4 h-11 w-11 items-center justify-center rounded-full bg-white/15">
          <RefreshCw size={22} color="#fff" />
        </View>
        <Text className="font-serif text-title font-bold text-white">Trade in. Trade up.</Text>
        <Text className="mt-2 text-body text-white/70">{swapProgram.valuation_guarantee_text}</Text>
        <Button
          title="Get an instant estimate"
          variant="inverse"
          className="mt-5 self-start"
          icon={ArrowRight}
          onPress={() => router.navigate('/swap')}
        />
      </View>

      {/* Best value */}
      {bestValue.length > 0 && (
        <>
          <SectionHeader
            title="Best value"
            actionLabel="See all"
            onAction={() => openShop({ category: 'defect-deals' })}
            className="mb-3 mt-8"
          />
          <ProductRail products={bestValue} />
        </>
      )}

      {/* Trust */}
      <View className="mx-5 mt-8 gap-4 rounded-3xl bg-fill p-5">
        <TrustRow icon={ShieldCheck} title="50-point inspection" text="Every device tested by our Kano engineers" />
        <TrustRow icon={Award} title="Up to 12 months guarantee" text="Store-backed support after you buy" />
        <TrustRow icon={Truck} title="Order on WhatsApp" text="Pickup at Farm Centre or delivery in Kano" />
      </View>
    </TabScrollView>
  );
}

function ProductRail({ products }: { products: Product[] }) {
  return (
    <FlatList
      horizontal
      data={products}
      keyExtractor={(p) => p.id}
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + 12}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      renderItem={({ item }) => <ProductCard product={item} width={CARD_WIDTH} />}
    />
  );
}

function TrustRow({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
        <Icon size={20} color={colors.ink} />
      </View>
      <View className="flex-1">
        <Text className="text-body font-semibold text-ink">{title}</Text>
        <Text className="text-subhead text-secondary">{text}</Text>
      </View>
    </View>
  );
}
