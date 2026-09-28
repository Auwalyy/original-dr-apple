import { ArrowRight, Award, MapPin, MessageSquare, RefreshCw, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { Gradient, Img, Ping, Reveal } from '@/components/ui/primitives';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
  scrollY: SharedValue<number>;
  onExploreClick: () => void;
  onSwapClick: () => void;
}

export function HeroSection({ settings, scrollY, onExploreClick, onSwapClick }: HeroSectionProps) {
  const { height } = useWindowDimensions();
  const minHeight = height * 0.9;

  // Parallax background (0% → 25%) and fading copy, as on the website.
  const bgStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, minHeight], [0, minHeight * 0.25], 'clamp') }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, minHeight * 0.8], [1, 0], 'clamp'),
  }));

  return (
    <View className="items-center justify-center overflow-hidden bg-white px-4 pb-16 pt-12" style={{ minHeight }}>
      {/* Parallax background with light vignette */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, bgStyle]}>
        <Img
          source={{ uri: settings.hero_bg_image }}
          className="h-full w-full opacity-25"
          style={{ transform: [{ scale: 1.05 }] }}
          contentFit="cover"
        />
        <Gradient colors={['transparent', 'rgba(255,255,255,0.8)', '#ffffff']} className="absolute inset-0" />
      </Animated.View>

      <Animated.View style={[{ width: '100%' }, textStyle]}>
        {/* Kano location pill */}
        <Reveal className="items-center">
          <View className="mb-6 flex-row items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-3.5 py-1.5 shadow-md">
            <MapPin size={14} color="#000" />
            <Text className="font-mono text-[11px] uppercase tracking-[1.1px] text-black">
              Kano’s #1 Verified Apple Destination
            </Text>
            <Ping />
          </View>
        </Reveal>

        <Reveal delay={200}>
          <Text className="text-center font-serif text-[32px] font-extrabold leading-[36px] tracking-tight text-black">
            {settings.hero_title}
          </Text>
        </Reveal>

        <Reveal delay={400}>
          <Text className="mt-6 text-center text-sm font-light leading-relaxed text-neutral-700">
            {settings.hero_subtitle}
          </Text>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={600} className="mt-8 w-full gap-3.5 px-4">
          <Pressable
            onPress={onExploreClick}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 shadow-xl active:bg-neutral-800"
          >
            <Text className="text-xs font-bold text-white">{settings.hero_cta_text || 'Explore Catalogue'}</Text>
            <ArrowRight size={16} color="#fff" />
          </Pressable>

          <Pressable
            onPress={onSwapClick}
            className="flex-row items-center justify-center gap-2 rounded-xl border border-black bg-white px-8 py-4 shadow-md active:bg-neutral-100"
          >
            <RefreshCw size={16} color="#000" />
            <Text className="text-xs font-semibold text-black">Kano Phone Swap Calculator</Text>
          </Pressable>
        </Reveal>

        {/* Kano trust pillars */}
        <Reveal delay={800} className="mt-12 w-full flex-row flex-wrap gap-y-4 border-t border-neutral-200/80 pt-8">
          <Pillar icon={<ShieldCheck size={20} color="#000" />} title="100% Tested Devices" sub="50-Point Kano Engineer Audit" />
          <Pillar icon={<Award size={20} color="#000" />} title="Store Guarantee" sub="Up to 12 Months Support" />
          <Pillar
            wide
            icon={<MessageSquare size={20} color="#000" />}
            title="Instant WhatsApp Order"
            sub="Direct Kano Dispatch"
          />
        </Reveal>
      </Animated.View>
    </View>
  );
}

function Pillar({ icon, title, sub, wide }: { icon: React.ReactNode; title: string; sub: string; wide?: boolean }) {
  return (
    <View className={`flex-row items-center justify-center gap-2.5 ${wide ? 'w-full' : 'w-1/2'}`}>
      {icon}
      <View>
        <Text className="text-xs font-semibold text-black">{title}</Text>
        <Text className="text-[10px] text-neutral-600">{sub}</Text>
      </View>
    </View>
  );
}
