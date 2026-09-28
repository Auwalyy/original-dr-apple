import { router } from 'expo-router';
import { Menu, MessageSquare, RefreshCw, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/ui/primitives';
import { CategoryFilter } from '@/lib/types';
import { CATEGORY_OPTIONS, INQUIRY_TEXT, openWhatsApp } from '@/lib/utils';

interface NavbarProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  onOpenSwapModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  announcementText?: string;
  whatsappPhone: string;
  /** Solid glass state once the page has scrolled past 30px. */
  scrolled: boolean;
}

export function Navbar({
  activeCategory,
  onSelectCategory,
  onOpenSwapModal,
  searchQuery,
  onSearchChange,
  announcementText,
  whatsappPhone,
  scrolled,
}: NavbarProps) {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View className="z-50">
      {/* Status bar backdrop + announcement bar */}
      <View className={announcementText ? 'bg-black' : 'bg-white'} style={{ paddingTop: insets.top }}>
        {!!announcementText && (
          <View className="border-b border-neutral-800 px-4 py-1.5">
            <Text className="text-center text-[11px] font-medium tracking-[0.3px] text-white" numberOfLines={1}>
              {announcementText}
            </Text>
          </View>
        )}
      </View>

      {/* Main navbar */}
      {/* Shadow goes through `style`: toggling shadow-* classes makes NativeWind remount the view
          outside the navigation context ("Couldn't find a navigation context"). */}
      <View
        className={`flex-row items-center justify-between px-4 py-3.5 ${
          scrolled ? 'border-b border-black/10 bg-white/95' : 'border-b border-neutral-200/80 bg-white/80'
        }`}
        style={{ boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.08)' : 'none' }}
      >
        <Pressable
          onPress={() => setMenuOpen((v) => !v)}
          className="p-2"
          accessibilityLabel="Toggle Navigation Menu"
        >
          {menuOpen ? <X size={24} color="#000" /> : <Menu size={24} color="#000" />}
        </Pressable>

        <Pressable onPress={() => router.navigate('/')} className="flex-1 flex-row items-center gap-2.5 pl-1">
          <BrandMark size={36} radius={12} />
          <View>
            <Text className="font-serif text-base font-bold uppercase tracking-[1.6px] text-black">DR APPLE</Text>
            <Text className="-mt-0.5 font-mono text-[8px] uppercase tracking-[0.8px] text-neutral-500">
              PHONES • KANO, NIGERIA
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => openWhatsApp(whatsappPhone, INQUIRY_TEXT)}
          className="flex-row items-center gap-1.5 rounded-full border border-black bg-neutral-100 px-3.5 py-1.5 shadow-sm"
        >
          <MessageSquare size={14} color="#000" fill="#000" />
          <Text className="text-xs font-bold text-black">WhatsApp</Text>
        </Pressable>
      </View>

      {/* Mobile drawer menu */}
      {menuOpen && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={{ position: 'absolute', left: 0, right: 0, top: '100%' }}
        >
          <View className="gap-3 border-b border-neutral-200 bg-white px-6 py-6 shadow-2xl">
            <TextInput
              placeholder="Search iPhone models, storage, accessories..."
              placeholderTextColor="#737373"
              value={searchQuery}
              onChangeText={onSearchChange}
              className="mb-2 rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-2.5 text-xs text-black"
            />

            <Text className="mb-1 font-mono text-[10px] uppercase tracking-[1.5px] text-neutral-500">
              Browse Categories
            </Text>

            {CATEGORY_OPTIONS.map((cat) => {
              const active = activeCategory === cat.value;
              return (
                <Pressable
                  key={cat.value}
                  onPress={() => {
                    onSelectCategory(cat.value);
                    setMenuOpen(false);
                  }}
                  className={`rounded-xl px-3.5 py-2.5 ${active ? 'bg-black' : ''}`}
                >
                  <Text className={`text-xs ${active ? 'font-bold text-white' : 'font-medium text-neutral-700'}`}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}

            <View className="mt-1 gap-2.5 border-t border-neutral-200 pt-4">
              <Pressable
                onPress={() => {
                  onOpenSwapModal();
                  setMenuOpen(false);
                }}
                className="flex-row items-center justify-center gap-2 rounded-xl bg-black py-2.5"
              >
                <RefreshCw size={16} color="#fff" />
                <Text className="text-xs font-semibold text-white">Kano Phone Swap Calculator</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/admin');
                }}
                className="items-center rounded-xl border border-neutral-300 bg-neutral-100 py-2.5"
              >
                <Text className="text-xs font-medium text-black">Admin CMS Portal</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
