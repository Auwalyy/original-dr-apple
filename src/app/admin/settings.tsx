import { Stack } from 'expo-router';
import { MapPin, MessageCircle, Phone } from 'lucide-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';

import { AdminScreen } from '@/components/admin/AdminScreen';
import { BrandSwitch, FormSection, ToggleRow } from '@/components/admin/FormSection';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useFeedback } from '@/components/ui/Feedback';
import { HeaderButton, TextField } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { SiteSettings } from '@/lib/types';

export default function AdminSettingsScreen() {
  const { settings: saved, saveSiteSettings } = useCMS();
  const { toast } = useFeedback();
  const [settings, setSettings] = useState<SiteSettings>(saved);
  const [titleError, setTitleError] = useState<string>();

  const dirty = JSON.stringify(settings) !== JSON.stringify(saved);
  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const save = () => {
    if (!settings.hero_title.trim()) {
      setTitleError('The banner needs a headline');
      return;
    }
    saveSiteSettings(settings);
    toast('Storefront updated');
  };

  return (
    <>
      <Stack.Screen options={{ headerRight: () => <HeaderButton title="Save" onPress={save} disabled={!dirty} /> }} />
      <AdminScreen>
        <FormSection title="Home banner" footer="Shown at the top of the Home tab.">
          <ImageUploader
            value={settings.hero_bg_image}
            onChange={(url) => set('hero_bg_image', url)}
            aspect={16 / 10}
          />
          <TextField
            label="Headline"
            value={settings.hero_title}
            onChangeText={(t) => {
              set('hero_title', t);
              setTitleError(undefined);
            }}
            error={titleError}
          />
          <TextField
            label="Subtitle"
            multiline
            value={settings.hero_subtitle}
            onChangeText={(t) => set('hero_subtitle', t)}
          />
          <TextField label="Button text" value={settings.hero_cta_text} onChangeText={(t) => set('hero_cta_text', t)} />
        </FormSection>

        <FormSection title="Announcement">
          <ToggleRow
            title="Show announcement"
            description="A highlighted strip above the banner"
            control={
              <BrandSwitch value={settings.announcement_enabled} onChange={(v) => set('announcement_enabled', v)} />
            }
          />
          {settings.announcement_enabled && (
            <TextField multiline value={settings.announcement_text} onChangeText={(t) => set('announcement_text', t)} />
          )}
        </FormSection>

        <FormSection title="Store & contact" footer="Used by the Call, WhatsApp and Directions buttons.">
          <TextField
            label="Address"
            icon={MapPin}
            value={settings.store_address}
            onChangeText={(t) => set('store_address', t)}
          />
          <TextField label="City & state" value={settings.store_city} onChangeText={(t) => set('store_city', t)} />
          <View className="gap-4">
            <TextField
              label="Phone number"
              icon={Phone}
              keyboardType="phone-pad"
              value={settings.contact_phone}
              onChangeText={(t) => set('contact_phone', t)}
            />
            <TextField
              label="WhatsApp number"
              icon={MessageCircle}
              keyboardType="phone-pad"
              helper="International format without +, e.g. 2348031234567"
              value={settings.contact_whatsapp}
              onChangeText={(t) => set('contact_whatsapp', t)}
            />
          </View>
        </FormSection>
      </AdminScreen>
    </>
  );
}
