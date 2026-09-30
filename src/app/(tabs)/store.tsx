import Constants from 'expo-constants';
import { router } from 'expo-router';
import {
  LayoutDashboard,
  LucideIcon,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
} from 'lucide-react-native';
import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { Button, Gradient, Img, ListRow, ListSection } from '@/components/ui/primitives';
import { LargeTitle, TabScrollView } from '@/components/ui/Screen';
import { colors, shadows } from '@/components/ui/theme';
import { haptics } from '@/lib/haptics';
import { useCMS } from '@/lib/store';
import { INQUIRY_TEXT, openWhatsApp } from '@/lib/utils';

export default function StoreScreen() {
  const { settings, swapProgram, session } = useCMS();
  const address = `${settings.store_address}, ${settings.store_city}`;

  const steps = [
    { title: swapProgram.step1_title, text: swapProgram.step1_desc },
    { title: swapProgram.step2_title, text: swapProgram.step2_desc },
    { title: swapProgram.step3_title, text: swapProgram.step3_desc },
  ].map((s) => ({ ...s, title: s.title.replace(/^\d+\.\s*/, '') }));

  return (
    <TabScrollView>
      <LargeTitle title="Visit us" subtitle="Certified Apple devices in the heart of Kano." />

      {/* Place card */}
      <View className="mx-5 mt-4 overflow-hidden rounded-3xl bg-white" style={shadows.raised}>
        <View className="h-44 bg-fill">
          <Img source={{ uri: swapProgram.pinned_image_url }} className="h-full w-full" contentFit="cover" />
          <Gradient colors={['transparent', 'rgba(0,0,0,0.55)']} className="absolute inset-0" />
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="font-serif text-title3 font-bold text-white">Dr Apple Phones</Text>
            <Text className="text-subhead text-white/80">Official Kano Swap Hub</Text>
          </View>
        </View>

        <View className="p-4">
          <View className="flex-row items-start gap-3">
            <MapPin size={18} color={colors.secondary} style={{ marginTop: 2 }} />
            <Text className="flex-1 text-body text-ink">{address}</Text>
          </View>

          <View className="mt-4 flex-row gap-2">
            <QuickAction
              icon={Phone}
              label="Call"
              onPress={() => Linking.openURL(`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`)}
            />
            <QuickAction
              icon={MessageCircle}
              label="WhatsApp"
              onPress={() => openWhatsApp(settings.contact_whatsapp, INQUIRY_TEXT)}
            />
            <QuickAction
              icon={Navigation}
              label="Directions"
              onPress={() =>
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`)
              }
            />
          </View>
        </View>
      </View>

      {/* How swapping works */}
      <View className="mt-10 px-5">
        <Text className="text-title3 font-bold text-ink">How swapping works</Text>
        <Text className="mt-1 text-body text-secondary">{swapProgram.subtitle}</Text>

        <View className="mt-5">
          {steps.map((step, i) => (
            <View key={i} className="flex-row gap-4">
              <View className="items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-ink">
                  <Text className="text-subhead font-bold text-white">{i + 1}</Text>
                </View>
                {i < steps.length - 1 && <View className="w-px flex-1 bg-separator" />}
              </View>
              <View className="flex-1 pb-6">
                <Text className="text-body font-semibold text-ink">{step.title}</Text>
                <Text className="mt-1 text-subhead leading-5 text-secondary">{step.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <Button title="Get a swap estimate" variant="secondary" onPress={() => router.navigate('/swap')} />
      </View>

      {/* Guarantee */}
      <View className="mx-5 mt-10 flex-row gap-3 rounded-2xl bg-fill p-4">
        <ShieldCheck size={22} color={colors.ink} />
        <View className="flex-1">
          <Text className="text-body font-semibold text-ink">Kano trade-in guarantee</Text>
          <Text className="mt-1 text-subhead text-secondary">{swapProgram.valuation_guarantee_text}</Text>
        </View>
      </View>

      {/* Staff */}
      <View className="mx-5 mt-10">
        <ListSection title="For staff" inset={60}>
          <ListRow
            icon={LayoutDashboard}
            title={session ? 'Admin dashboard' : 'Staff sign in'}
            subtitle={session ? `Signed in as ${session.email}` : 'Manage products, banners and swap content'}
            onPress={() => router.push(session ? '/admin' : '/admin/login')}
          />
        </ListSection>
      </View>

      <Text className="mt-8 text-center text-caption text-tertiary">
        Dr Apple Phones Kano · v{Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
    </TabScrollView>
  );
}

function QuickAction({ icon: Icon, label, onPress }: { icon: LucideIcon; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        haptics.light();
        onPress();
      }}
      accessibilityRole="button"
      className="flex-1 items-center gap-1.5 rounded-2xl bg-fill py-3 active:opacity-70"
    >
      <Icon size={20} color={colors.ink} />
      <Text className="text-caption font-semibold text-ink">{label}</Text>
    </Pressable>
  );
}
