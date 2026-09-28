import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { DiscoverySplitScreen } from '@/components/DiscoverySplitScreen';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { HorizontalProductScroll } from '@/components/HorizontalProductScroll';
import { MobileDock } from '@/components/MobileDock';
import { Navbar } from '@/components/Navbar';
import { useStorefrontModals } from '@/components/useStorefrontModals';
import { useCMS } from '@/lib/store';
import { CategoryFilter } from '@/lib/types';
import { matchesSearch } from '@/lib/utils';

export default function StorefrontScreen() {
  const { products, settings, swapProgram } = useCMS();
  const insets = useSafeAreaInsets();
  const { openSwap, openQuickView, modals } = useStorefrontModals();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const catalogueY = useRef(0);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  useAnimatedReaction(
    () => scrollY.value > 30,
    (isScrolled, prev) => {
      if (isScrolled !== prev) scheduleOnRN(setScrolled, isScrolled);
    }
  );

  const filteredProducts = products.filter(
    (p) =>
      p.is_published && (activeCategory === 'all' || p.category === activeCategory) && matchesSearch(p, searchQuery)
  );

  const scrollToCatalogue = () => scrollRef.current?.scrollTo({ y: catalogueY.current, animated: true });

  const announcement = settings.announcement_enabled ? settings.announcement_text : undefined;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style={announcement ? 'light' : 'dark'} />

      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalogue();
        }}
        onOpenSwapModal={() => openSwap()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        announcementText={announcement}
        whatsappPhone={settings.contact_whatsapp}
        scrolled={scrolled}
      />

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}
      >
        <HeroSection
          settings={settings}
          scrollY={scrollY}
          onExploreClick={scrollToCatalogue}
          onSwapClick={() => openSwap()}
        />

        <View onLayout={(e) => (catalogueY.current = e.nativeEvent.layout.y)}>
          <HorizontalProductScroll
            products={filteredProducts}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onQuickView={openQuickView}
          />
        </View>

        <DiscoverySplitScreen content={swapProgram} onStartSwapClick={() => openSwap()} />

        <Footer settings={settings} onOpenSwapModal={() => openSwap()} />
      </Animated.ScrollView>

      <MobileDock
        onHome={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
        onPhones={scrollToCatalogue}
        onOpenSwapModal={() => openSwap()}
        whatsappPhone={settings.contact_whatsapp}
      />

      {modals}
    </View>
  );
}
