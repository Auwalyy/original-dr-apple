import { ArrowRight, Award, MapPin, MessageSquare, RefreshCw, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  FadeInDown,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Gradient, Img, Ping } from '@/components/ui/primitives';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
  scrollY: SharedValue<number>;
  onExploreClick: () => void;
  onSwapClick: () => void;
}

const fadeUp = (delay: number) => FadeInDown.duration(800).delay(delay).withInitialValues({ transform: [{ translateY: 20 }] });

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
      <Animated.View className="absolute inset-0" style={bgStyle}>
        <Img
          source={{ uri: settings.hero_bg_image }}
          className="h-full w-full opacity-25"
          style={{ transform: [{ scale: 1.05 }] }}
          contentFit="cover"
        />
        <Gradient colors={['transparent', 'rgba(255,255,255,0.8)', '#ffffff']} className="absolute inset-0" />
      </Animated.View>

      <Animated.View className="w-full items-center" style={textStyle}>
        {/* Kano location pill */}
        <Animated.View
          entering={fadeUp(0)}
          className="mb-6 flex-row items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-3.5 py-1.5 shadow-md"
        >
          <MapPin size={14} color="#000" />
          <Text className="font-mono text-[11px] uppercase tracking-[1.1px] text-black">
            Kano’s #1 Verified Apple Destination
          </Text>
          <Ping />
        </Animated.View>

        <Animated.Text
          entering={fadeUp(200)}
          className="text-center font-serif text-[32px] font-extrabold leading-[36px] tracking-tight text-black"
        >
          {settings.hero_title}
        </Animated.Text>

        <Animated.Text
          entering={fadeUp(400)}
          className="mt-6 max-w-2xl text-center text-sm font-light leading-relaxed text-neutral-700"
        >
          {settings.hero_subtitle}
        </Animated.Text>

        {/* CTAs */}
        <Animated.View entering={fadeUp(600)} className="mt-8 w-full gap-3.5 px-4">
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
        </Animated.View>

        {/* Kano trust pillars */}
        <Animated.View
          entering={fadeUp(800)}
          className="mt-12 w-full flex-row flex-wrap border-t border-neutral-200/80 pt-8"
          style={{ rowGap: 16 }}
        >
          <Pillar icon={<ShieldCheck size={20} color="#000" />} title="100% Tested Devices" sub="50-Point Kano Engineer Audit" />
          <Pillar icon={<Award size={20} color="#000" />} title="Store Guarantee" sub="Up to 12 Months Support" />
          <Pillar
            wide
            icon={<MessageSquare size={20} color="#000" />}
            title="Instant WhatsApp Order"
            sub="Direct Kano Dispatch"
          />
        </Animated.View>
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
