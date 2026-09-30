import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  PackageX,
  RefreshCw,
  Share2,
  ShieldCheck,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, ScrollView, Share, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConditionTag, StockIndicator } from '@/components/ProductBadge';
import { Button, EmptyState, IconButton, ImageFallback, Img } from '@/components/ui/primitives';
import { colors, shadows } from '@/components/ui/theme';
import { discountPercent } from '@/lib/catalog';
import { useCMS } from '@/lib/store';
import { formatNaira, triggerDirectWhatsAppBuy, openWhatsApp } from '@/lib/utils';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, settings } = useCMS();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);

  const product = products.find((p) => p.id === id);
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!product) {
    return (
      <View className="flex-1 justify-center bg-white" style={{ paddingTop: insets.top }}>
        <EmptyState
          icon={PackageX}
          title="Product unavailable"
          message="This item may have been sold or removed."
          actionLabel="Back to shop"
          onAction={goBack}
        />
      </View>
    );
  }

  const gallery = [product.image_url, ...(product.gallery ?? [])].filter((u, i, all) => all.indexOf(u) === i);
  const discount = discountPercent(product);
  const soldOut = product.stock <= 0;
  const savings = product.original_price ? product.original_price - product.price : 0;

  const specs = [
    { label: 'Condition', value: product.badge_label },
    product.storage && { label: 'Storage', value: product.storage },
    product.color && { label: 'Colour', value: product.color },
    { label: 'Availability', value: soldOut ? 'Sold out' : `${product.stock} in stock` },
    { label: 'Pickup', value: 'Farm Centre, Kano' },
  ].filter(Boolean) as { label: string; value: string }[];

  const share = () =>
    Share.share({
      message: `${product.name} — ${formatNaira(product.price)} at Dr Apple Phones, Farm Centre Kano.`,
    });

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
        {/* Gallery */}
        <View className="bg-fill" style={{ width, height: width * 1.05 }}>
          <FlatList
            horizontal
            pagingEnabled
            data={gallery}
            keyExtractor={(u) => u}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <View style={{ width, height: width * 1.05 }}>
                <ImageFallback size={48} />
                <Img source={{ uri: item }} style={{ width, height: width * 1.05 }} contentFit="cover" transition={200} />
              </View>
            )}
          />
          {gallery.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-1.5">
              {gallery.map((u, i) => (
                <View
                  key={u}
                  className="h-1.5 rounded-full"
                  style={{
                    width: i === page ? 18 : 6,
                    backgroundColor: i === page ? '#fff' : 'rgba(255,255,255,0.55)',
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Title & price */}
        <View className="px-5 pt-5">
          <View className="flex-row items-center justify-between">
            <ConditionTag type={product.badge_type} label={product.badge_label} />
            <StockIndicator product={product} />
          </View>

          <Text className="mt-3 font-serif text-title font-bold text-ink">{product.name}</Text>

          <View className="mt-3 flex-row flex-wrap items-center gap-x-3 gap-y-1">
            <Text className="text-title font-bold text-ink">{formatNaira(product.price)}</Text>
            {!!product.original_price && savings > 0 && (
              <>
                <Text className="text-body text-tertiary line-through">{formatNaira(product.original_price)}</Text>
                <View className="rounded-md bg-fill px-2 py-1">
                  <Text className="text-caption font-semibold text-ink">
                    Save {formatNaira(savings)} ({discount}%)
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Battery */}
        {!!product.battery_health && product.category !== 'accessories' && (
          <View className="mx-5 mt-6 rounded-2xl bg-fill px-4 py-3.5">
            <View className="flex-row items-center justify-between">
              <Text className="text-caption text-secondary">Battery health</Text>
              <Text className="text-body font-semibold text-ink">{product.battery_health}%</Text>
            </View>
            <View className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-separator">
              <View className="h-full rounded-full bg-ink" style={{ width: `${product.battery_health}%` }} />
            </View>
          </View>
        )}

        {/* Details */}
        <View className="mt-6 px-5">
          <Text className="mb-1 text-headline font-semibold text-ink">Details</Text>
          {specs.map((s, i) => (
            <View
              key={s.label}
              className={`flex-row items-center justify-between py-3 ${i > 0 ? 'border-t border-separator' : ''}`}
            >
              <Text className="text-body text-secondary">{s.label}</Text>
              <Text className="ml-4 flex-1 text-right text-body font-medium text-ink" numberOfLines={1}>
                {s.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Condition report */}
        {!!product.condition_description && (
          <View className="mx-5 mt-6 flex-row gap-3 rounded-2xl border border-separator p-4">
            <ClipboardCheck size={20} color={colors.ink} />
            <View className="flex-1">
              <Text className="text-body font-semibold text-ink">Condition report</Text>
              <Text className="mt-1 text-body text-secondary">{product.condition_description}</Text>
            </View>
          </View>
        )}

        {/* About */}
        <View className="mt-6 px-5">
          <Text className="text-headline font-semibold text-ink">About this item</Text>
          <Text className="mt-2 text-body leading-6 text-secondary">{product.description}</Text>
        </View>

        {/* Promises */}
        <View className="mx-5 mt-6 gap-4 rounded-2xl bg-fill p-4">
          <PromiseRow
            icon={ShieldCheck}
            title="50-point technical guarantee"
            text="Inspected by Dr Apple Kano engineers"
          />
          <PromiseRow icon={RefreshCw} title="Swap your old iPhone" text="Put its value toward this purchase" />
          <PromiseRow
            icon={MapPin}
            title="Pickup or delivery"
            text={`${settings.store_address}, ${settings.store_city}`}
          />
        </View>
      </ScrollView>

      {/* Floating navigation */}
      <View
        className="absolute left-0 right-0 flex-row justify-between px-4"
        style={{ top: insets.top + 8 }}
        pointerEvents="box-none"
      >
        <IconButton icon={ChevronLeft} variant="glass" accessibilityLabel="Back" onPress={goBack} iconSize={22} />
        <IconButton icon={Share2} variant="glass" accessibilityLabel="Share" onPress={share} iconSize={18} />
      </View>

      {/* Purchase bar */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-separator bg-white px-5 pt-3"
        style={[{ paddingBottom: Math.max(insets.bottom, 12) }, shadows.bar]}
      >
        {product.category !== 'accessories' && (
          <Button
            title="Swap"
            variant="secondary"
            size="lg"
            icon={RefreshCw}
            onPress={() => router.navigate({ pathname: '/swap', params: { target: product.id } })}
          />
        )}
        <Button
          title={soldOut ? 'Ask about restock' : 'Buy on WhatsApp'}
          size="lg"
          icon={MessageCircle}
          className="flex-1"
          onPress={() =>
            soldOut
              ? openWhatsApp(
                  settings.contact_whatsapp,
                  `Hello Dr Apple Kano, when will the ${product.name} be back in stock?`,
                )
              : triggerDirectWhatsAppBuy(product, settings.contact_whatsapp)
          }
        />
      </View>
    </View>
  );
}

function PromiseRow({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
        <Icon size={18} color={colors.ink} />
      </View>
      <View className="flex-1">
        <Text className="text-body font-semibold text-ink">{title}</Text>
        <Text className="text-subhead text-secondary" numberOfLines={2}>
          {text}
        </Text>
      </View>
    </View>
  );
}
