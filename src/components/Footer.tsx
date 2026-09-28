import { router } from 'expo-router';
import { MapPin, MessageSquare, Phone, RefreshCw, ShieldCheck, UserCheck } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { BrandMark } from '@/components/ui/primitives';
import { ProductCategory, SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
  onOpenSwapModal?: () => void;
}

const CATEGORY_LINKS: { label: string; slug: ProductCategory }[] = [
  { label: 'Brand New iPhones', slug: 'brand-new' },
  { label: 'UK Used / Swap Devices', slug: 'uk-used' },
  { label: 'Defect Deals (Discounted)', slug: 'defect-deals' },
  { label: 'Original Apple Accessories', slug: 'accessories' },
];

export function Footer({ settings, onOpenSwapModal }: FooterProps) {
  return (
    <View className="border-t border-neutral-300 bg-white px-4 pb-12 pt-16">
      <View className="gap-10 border-b border-neutral-200 pb-12">
        {/* Brand info */}
        <View className="gap-4">
          <View className="flex-row items-center gap-2.5">
            <BrandMark size={32} radius={8} />
            <Text className="font-serif text-lg font-bold uppercase tracking-[1.8px] text-black">DR APPLE PHONES</Text>
          </View>
          <Text className="text-xs font-light leading-relaxed text-neutral-600">
            Kano State’s premier certified Apple device destination. Specializing in Brand New factory sealed units,
            Grade-A UK Used iPhones, Swap Upgrades & Defect Deals.
          </Text>
          <View className="flex-row items-center gap-2">
            <ShieldCheck size={14} color="#000" />
            <Text className="font-mono text-[11px] text-black">Certified 50-Point Technical Guarantee</Text>
          </View>
        </View>

        {/* Categories */}
        <View className="gap-3">
          <Text className="font-serif text-sm font-bold uppercase tracking-[0.7px] text-black">Categories</Text>
          <View className="gap-2">
            {CATEGORY_LINKS.map((link) => (
              <Pressable
                key={link.slug}
                onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: link.slug } })}
              >
                <Text className="text-xs font-light text-neutral-600">{link.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Kano store hub */}
        <View className="gap-3">
          <Text className="font-serif text-sm font-bold uppercase tracking-[0.7px] text-black">Kano Store Hub</Text>
          <View className="gap-2">
            <View className="flex-row items-start gap-2">
              <MapPin size={16} color="#000" style={{ marginTop: 2 }} />
              <Text className="flex-1 text-xs font-light text-neutral-600">
                {settings.store_address || 'Suite 14, Farm Centre Electronic Complex, Zoo Road, Kano State'}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Phone size={16} color="#000" />
              <Text className="text-xs font-light text-neutral-600">{settings.contact_phone}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <MessageSquare size={16} color="#000" />
              <Text className="text-xs font-light text-neutral-600">Direct WhatsApp Order Dispatch</Text>
            </View>
          </View>
        </View>

        {/* Services & portal */}
        <View className="gap-4">
          <Text className="font-serif text-sm font-bold uppercase tracking-[0.7px] text-black">Services & Portal</Text>
          {onOpenSwapModal && (
            <Pressable
              onPress={onOpenSwapModal}
              className="flex-row items-center justify-center gap-2 rounded-lg border border-black bg-black py-2.5"
            >
              <RefreshCw size={14} color="#fff" />
              <Text className="text-xs font-medium text-white">Kano Swap Calculator</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => router.push('/admin')}
            className="flex-row items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-neutral-100 py-2.5"
          >
            <UserCheck size={14} color="#000" />
            <Text className="text-xs font-medium text-black">Admin CMS Portal</Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom bar */}
      <View className="mt-8 items-center gap-4">
        <Text className="text-center font-mono text-xs text-neutral-500">
          © {new Date().getFullYear()} Dr Apple Phones Kano, Nigeria. All Rights Reserved.
        </Text>
        <Text className="text-center font-mono text-xs text-neutral-500">
          Solène Fragrance Black & White Palette • Direct WhatsApp Routing
        </Text>
      </View>
    </View>
  );
}
