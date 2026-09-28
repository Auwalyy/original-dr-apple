import { RefreshCw, Shield, Zap } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Gradient, Img } from '@/components/ui/primitives';
import { SwapProgramContent } from '@/lib/types';

interface DiscoverySplitScreenProps {
  content: SwapProgramContent;
  onStartSwapClick: () => void;
}

const reveal = (delay = 0) => FadeInDown.duration(800).delay(delay);

export function DiscoverySplitScreen({ content, onStartSwapClick }: DiscoverySplitScreenProps) {
  const steps = [
    { n: 1, title: content.step1_title, desc: content.step1_desc },
    { n: 2, title: content.step2_title, desc: content.step2_desc },
    { n: 3, title: content.step3_title, desc: content.step3_desc },
  ];

  return (
    <View className="gap-10 border-y border-neutral-200 bg-neutral-50 px-4 py-20">
      {/* Pinned image */}
      <Animated.View
        entering={reveal()}
        className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
      >
        <View className="aspect-[4/5] w-full bg-neutral-100">
          <Img source={{ uri: content.pinned_image_url }} className="h-full w-full" contentFit="cover" />
        </View>
        <Gradient
          colors={['transparent', 'transparent', 'rgba(0,0,0,0.4)']}
          className="absolute inset-0 opacity-60"
          pointerEvents="none"
        />

        <View className="absolute bottom-6 left-6 right-6 rounded-xl border border-neutral-300 bg-white/95 p-5 shadow-lg">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-lg bg-black">
              <RefreshCw size={20} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="font-serif text-sm font-bold text-black">Official Kano Swap Hub</Text>
              <Text className="text-xs text-neutral-600">Farm Centre Electronics Complex, Kano</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Narrative */}
      <Animated.View entering={reveal()}>
        <View className="mb-4 flex-row items-center gap-2 self-start rounded-full border border-neutral-300 bg-white px-3 py-1 shadow-sm">
          <Zap size={14} color="#000" />
          <Text className="font-mono text-xs uppercase tracking-[1.2px] text-black">
            Discovery Split-Screen Narrative
          </Text>
        </View>
        <Text className="font-serif text-3xl font-bold leading-tight text-black">{content.title}</Text>
        <Text className="mt-4 text-sm font-light leading-relaxed text-neutral-700">{content.subtitle}</Text>
      </Animated.View>

      {steps.map((step, i) => (
        <Animated.View
          key={step.n}
          entering={reveal(100 * (i + 1))}
          className="rounded-xl border border-neutral-200 bg-white p-6 shadow-md"
        >
          <View className="flex-row items-start gap-4">
            <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-black">
              <Text className="text-sm font-bold text-white">{step.n}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-serif text-lg font-bold text-black">{step.title}</Text>
              <Text className="mt-2 text-xs font-light leading-relaxed text-neutral-600">{step.desc}</Text>
            </View>
          </View>
        </Animated.View>
      ))}

      {/* Guarantee */}
      <Animated.View entering={reveal(400)} className="rounded-xl border border-black bg-white p-6 shadow-lg">
        <View className="mb-3 flex-row items-center gap-2.5">
          <Shield size={20} color="#000" />
          <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-black">Kano Trade-in Guarantee</Text>
        </View>
        <Text className="text-xs italic text-neutral-700">“{content.valuation_guarantee_text}”</Text>
        <Pressable
          onPress={onStartSwapClick}
          className="mt-6 flex-row items-center justify-center gap-2 rounded-lg bg-black py-3.5 shadow-xl active:bg-neutral-800"
        >
          <RefreshCw size={16} color="#fff" />
          <Text className="text-xs font-bold text-white">Calculate Trade-In Value Now</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
