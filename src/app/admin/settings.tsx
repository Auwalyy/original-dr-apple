import { MapPin, Sliders } from 'lucide-react-native';
import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';

import { AdminShell, Panel, PublishButton, SavedBanner } from '@/components/admin/AdminShell';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Input, Label } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { SiteSettings } from '@/lib/types';

export default function AdminSettingsScreen() {
  const { settings: saved, saveSiteSettings } = useCMS();
  const [settings, setSettings] = useState<SiteSettings>(saved);
  const [savedMessage, setSavedMessage] = useState('');

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = () => {
    if (!settings.hero_title.trim()) return;
    saveSiteSettings(settings);
    setSavedMessage('Site settings & Dynamic Hero Banners published immediately to storefront!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <AdminShell title="Dynamic Hero Banner & Site Settings">
      <SavedBanner message={savedMessage} />

      {/* Hero banner */}
      <Panel>
        <View className="gap-3 border-b border-neutral-200 pb-4">
          <View className="flex-row items-center gap-3">
            <Sliders size={20} color="#000" />
            <Text className="flex-1 font-serif text-lg font-bold text-black">Solène Fragrance Dynamic Hero Banner</Text>
          </View>
          <PublishButton label="Publish Banner Changes" onPress={handleSave} />
        </View>

        <View>
          <Label>Hero Headline Title</Label>
          <Input value={settings.hero_title} onChangeText={(t) => set('hero_title', t)} className="font-serif text-base" />
        </View>
        <View>
          <Label>Hero Subtitle Narrative</Label>
          <Input
            multiline
            textAlignVertical="top"
            value={settings.hero_subtitle}
            onChangeText={(t) => set('hero_subtitle', t)}
            className="min-h-[64px]"
          />
        </View>
        <View>
          <Label>Hero CTA Button Text</Label>
          <Input value={settings.hero_cta_text} onChangeText={(t) => set('hero_cta_text', t)} />
        </View>
        <View>
          <Label>Announcement Ticker Text</Label>
          <Input value={settings.announcement_text} onChangeText={(t) => set('announcement_text', t)} />
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-xs font-semibold text-neutral-700">Show announcement bar</Text>
            <Switch
              value={settings.announcement_enabled}
              onValueChange={(v) => set('announcement_enabled', v)}
              trackColor={{ true: '#000', false: '#d4d4d4' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <ImageUploader
          value={settings.hero_bg_image}
          onChange={(url) => set('hero_bg_image', url)}
          label="Hero Background Image Asset (Supabase Storage)"
        />
      </Panel>

      {/* Store contact */}
      <Panel>
        <View className="flex-row items-center gap-3 border-b border-neutral-200 pb-4">
          <MapPin size={20} color="#000" />
          <Text className="flex-1 font-serif text-lg font-bold text-black">Kano Store Physical Location & Contact</Text>
        </View>
        <View>
          <Label>Store Address</Label>
          <Input value={settings.store_address} onChangeText={(t) => set('store_address', t)} />
        </View>
        <View>
          <Label>City & State</Label>
          <Input value={settings.store_city} onChangeText={(t) => set('store_city', t)} />
        </View>
        <View>
          <Label>Phone Call Number</Label>
          <Input
            keyboardType="phone-pad"
            value={settings.contact_phone}
            onChangeText={(t) => set('contact_phone', t)}
            className="font-mono"
          />
        </View>
        <View>
          <Label>WhatsApp Order Phone Number</Label>
          <Input
            keyboardType="phone-pad"
            value={settings.contact_whatsapp}
            onChangeText={(t) => set('contact_whatsapp', t)}
            className="font-mono"
          />
        </View>
        <PublishButton label="Publish Banner Changes" onPress={handleSave} />
      </Panel>
    </AdminShell>
  );
}
